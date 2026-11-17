import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Config } from '../config.js';
import type { Database } from '../db/types.js';
import type { Role } from '../domain.js';
import { HttpError } from '../errors.js';
import type { Mailer } from '../mail/mailer.js';
import { getTeam, getTeamByCode, normalizeTeamCode } from '../team.js';
import { findOrCreateUser } from '../users/users.js';
import type { GoogleClient } from './google.js';
import { randomToken } from './crypto.js';
import { consumeLoginCode, issueLoginCode, wasCodeIssuedRecently } from './otp.js';
import { createSession, destroySession } from './session.js';

export interface AuthRoutesOptions {
  db: Database;
  config: Config;
  mailer: Mailer;
  google: GoogleClient | null;
}

interface EmailRequestBody {
  email: string;
}

interface VerifyBody {
  email: string;
  code: string;
  teamCode: string;
  name?: string;
  phone?: string | null;
  role: Role;
  positions?: string[];
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setSessionCookie(reply: FastifyReply, config: Config, token: string): void {
  reply.setCookie(config.cookie.name, token, {
    path: '/',
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: Math.floor(config.cookie.maxAgeMs / 1000),
  });
}

const emailRequestSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: { email: { type: 'string' } },
  },
} as const;

const verifySchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'code', 'teamCode', 'role'],
    properties: {
      email: { type: 'string' },
      code: { type: 'string' },
      teamCode: { type: 'string' },
      name: { type: 'string' },
      phone: { type: ['string', 'null'] },
      role: { type: 'string', enum: ['jogador', 'staff'] },
      positions: { type: 'array', items: { type: 'string' } },
    },
  },
} as const;

export async function authRoutes(
  app: FastifyInstance,
  opts: AuthRoutesOptions,
): Promise<void> {
  const { db, config, mailer, google } = opts;

  // Solicita o código de uso único por e-mail. Sempre 202 para não vazar se o
  // e-mail está ou não cadastrado.
  app.post<{ Body: EmailRequestBody }>(
    '/auth/email/request',
    { schema: emailRequestSchema },
    async (req, reply) => {
      const { email } = req.body;
      if (!isValidEmail(email)) throw new HttpError(400, 'e-mail inválido');

      const team = await getTeam(db);
      if (!team) throw new HttpError(503, 'time não configurado');

      if (await wasCodeIssuedRecently(db, team.id, email, config.otp.resendIntervalMs)) {
        return reply.code(202).send({ ok: true });
      }

      const issued = await issueLoginCode(
        db,
        team.id,
        email,
        config.otp.ttlMs,
        config.otp.length,
      );
      try {
        await mailer.sendLoginCode(issued.email, issued.code);
      } catch (err) {
        req.log.warn(err, 'falha ao enviar código de acesso');
      }
      return reply.code(202).send({ ok: true });
    },
  );

  // Verifica o código e autentica (cria o usuário no primeiro acesso).
  app.post<{ Body: VerifyBody }>(
    '/auth/email/verify',
    { schema: verifySchema },
    async (req, reply) => {
      const body = req.body;
      if (!isValidEmail(body.email)) throw new HttpError(400, 'e-mail inválido');

      const teamCode = normalizeTeamCode(body.teamCode);
      // Distinção de contrato: o time que existe no banco mas está desabilitado
      // — do catálogo ou legado preservado (ex. o antigo NAVIGATORS) — responde
      // 409 (indisponível); um código inexistente responde 400 (inválido).
      const team = await getTeamByCode(db, teamCode);
      if (!team) throw new HttpError(400, 'código do time inválido');
      if (!team.enabled) throw new HttpError(409, 'time indisponível para cadastro');

      const consumed = await consumeLoginCode(db, team.id, body.email, body.code);
      if (!consumed) throw new HttpError(401, 'código inválido ou expirado');

      const { user } = await findOrCreateUser(db, {
        teamId: team.id,
        email: body.email,
        name: body.name?.trim() || null,
        phone: body.phone?.trim() || null,
        role: body.role,
        positions: body.positions,
      });

      const token = await createSession(db, team.id, user.id, config.cookie.maxAgeMs);
      setSessionCookie(reply, config, token);
      return { user };
    },
  );

  // Sessão atual.
  app.get(
    '/auth/session',
    { preHandler: [app.requireAuth] },
    async (req) => ({ user: req.sessionUser }),
  );

  // Logout: revoga a sessão e apaga o cookie.
  app.post('/auth/logout', async (req: FastifyRequest, reply) => {
    const token =
      req.sessionToken ?? req.cookies[config.cookie.name] ?? null;
    if (token) await destroySession(db, token);
    reply.clearCookie(config.cookie.name, {
      path: '/',
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
    });
    reply.code(204).send();
  });

  // Login com Google: redireciona para o consentimento.
  app.get('/auth/google', async (_req, reply) => {
    if (!google) throw new HttpError(503, 'login Google não configurado');
    const state = randomToken(16);
    reply.setCookie('google_oauth_state', state, {
      path: '/auth/google/callback',
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
      maxAge: 600,
    });
    reply.redirect(google.buildAuthUrl(state));
  });

  // Callback do Google: troca o código, autentica (jogador no primeiro acesso).
  app.get('/auth/google/callback', async (req, reply) => {
    if (!google) throw new HttpError(503, 'login Google não configurado');

    const query = req.query as {
      code?: string;
      state?: string;
      error?: string;
    };
    const stateCookie = req.cookies['google_oauth_state'];
    reply.clearCookie('google_oauth_state', {
      path: '/auth/google/callback',
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
    });

    const failRedirect = (reason: string): void => {
      reply.redirect(`${config.frontendUrl}?login=erro&motivo=${reason}`);
    };

    if (query.error) return failRedirect(query.error);
    if (!query.state || query.state !== stateCookie) {
      return failRedirect('estado');
    }
    if (!query.code) return failRedirect('codigo');

    let profile;
    try {
      profile = await google.exchangeCode(query.code);
    } catch (err) {
      req.log.warn(err, 'falha na troca de código Google');
      return failRedirect('troca');
    }

    const team = await getTeam(db);
    if (!team) throw new HttpError(503, 'time não configurado');

    const { user } = await findOrCreateUser(db, {
      teamId: team.id,
      email: profile.email,
      name: profile.name,
      phone: null,
      role: 'jogador',
    });
    const token = await createSession(db, team.id, user.id, config.cookie.maxAgeMs);
    setSessionCookie(reply, config, token);
    reply.redirect(config.frontendUrl);
  });
}
