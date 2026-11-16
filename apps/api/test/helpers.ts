import { PGlite } from '@electric-sql/pglite';
import type { FastifyInstance, InjectOptions, LightMyRequestResponse } from 'fastify';
import { buildApp } from '../src/app.js';
import type { Config } from '../src/config.js';
import { loadConfig } from '../src/config.js';
import { runMigrations } from '../src/db/migrate.js';
import { seedAdmin, seedHeadCoach } from '../src/db/seed.js';
import type { Database, Queryable } from '../src/db/types.js';
import type { Mailer } from '../src/mail/mailer.js';

export interface TestContext {
  app: FastifyInstance;
  db: Database;
  config: Config;
  mailer: RecordingMailer;
}

/** Adapta PGlite (Postgres real em WASM) para o seam `Database` do app. */
export function createPgliteDatabase(pglite: PGlite): Database {
  return {
    async query<T = Record<string, unknown>>(text, params) {
      const result = await pglite.query<T>(text, params as never);
      return { rows: result.rows, rowCount: result.affectedRows ?? null };
    },
    async exec(sql) {
      await pglite.exec(sql);
    },
    async transaction<T>(fn: (db: Queryable) => Promise<T>): Promise<T> {
      return pglite.transaction(async (tx) => {
        const q: Queryable = {
          async query<T2 = Record<string, unknown>>(text, params) {
            const result = await tx.query<T2>(text, params as never);
            return { rows: result.rows, rowCount: result.affectedRows ?? null };
          },
        };
        return fn(q);
      });
    },
    async close() {
      await pglite.close();
    },
  };
}

export class RecordingMailer implements Mailer {
  sent: Array<{ to: string; code: string }> = [];

  async sendLoginCode(to: string, code: string): Promise<void> {
    this.sent.push({ to, code });
  }

  lastCodeFor(email: string): string | undefined {
    const normalized = email.toLowerCase();
    const match = [...this.sent].reverse().find((s) => s.to === normalized);
    return match?.code;
  }
}

export const TEST_TEAM_CODE = 'NAVS-2026';

export function makeTestConfig(overrides: NodeJS.ProcessEnv = {}): Config {
  return loadConfig({
    NODE_ENV: 'test',
    SEED_HEAD_COACH_EMAIL: 'head@example.com',
    SEED_HEAD_COACH_NAME: 'Head Coach',
    SEED_ADMIN_EMAIL: 'admin@example.com',
    SEED_ADMIN_NAME: 'Admin Geral',
    LOG_LEVEL: 'silent',
    ...overrides,
  });
}

export async function createTestContext(): Promise<TestContext> {
  const pglite = new PGlite();
  const db = createPgliteDatabase(pglite);
  await runMigrations(db);

  const config = makeTestConfig();
  await seedHeadCoach(db, config);
  await seedAdmin(db, config);

  const mailer = new RecordingMailer();
  const app = await buildApp({ db, config, mailer, google: null, logger: false });

  return { app, db, config, mailer };
}

export function extractCookie(
  res: LightMyRequestResponse,
  name: string,
): string | undefined {
  const header = res.headers['set-cookie'];
  const cookies = Array.isArray(header) ? header : header ? [header] : [];
  for (const raw of cookies) {
    const [pair] = raw.split(';');
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const key = pair.slice(0, eq);
    if (key === name) return pair.slice(eq + 1);
  }
  return undefined;
}

export function cookieHeader(name: string, value: string): { cookie: string } {
  return { cookie: `${name}=${value}` };
}

export interface RegisterOptions {
  email: string;
  name?: string;
  phone?: string;
  role: 'jogador' | 'staff';
  positions?: string[];
}

/**
 * Fluxo completo de cadastro/login por e-mail: solicita o código, lê do mailer
 * e verifica. Devolve a resposta do verify (com o cookie de sessão).
 */
export async function registerViaEmail(
  ctx: TestContext,
  opts: RegisterOptions,
): Promise<LightMyRequestResponse> {
  await ctx.app.inject({
    method: 'POST',
    url: '/auth/email/request',
    payload: { email: opts.email },
  });
  const code = ctx.mailer.lastCodeFor(opts.email);
  if (!code) throw new Error(`código não emitido para ${opts.email}`);

  const payload: Record<string, unknown> = {
    email: opts.email,
    code,
    teamCode: TEST_TEAM_CODE,
    role: opts.role,
  };
  if (opts.name) payload.name = opts.name;
  if (opts.phone) payload.phone = opts.phone;
  if (opts.positions) payload.positions = opts.positions;

  return ctx.app.inject({
    method: 'POST',
    url: '/auth/email/verify',
    payload,
  });
}

export function injectWithSession(
  ctx: TestContext,
  res: LightMyRequestResponse,
  opts: Pick<InjectOptions, 'method' | 'url' | 'payload'>,
): Promise<LightMyRequestResponse> {
  const token = extractCookie(res, ctx.config.cookie.name);
  return ctx.app.inject({
    ...opts,
    headers: token ? cookieHeader(ctx.config.cookie.name, token) : undefined,
  });
}
