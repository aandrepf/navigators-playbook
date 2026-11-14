import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { RealGoogleClient, type GoogleClient } from './auth/google.js';
import { authRoutes } from './auth/routes.js';
import type { Config } from './config.js';
import type { Database } from './db/types.js';
import { HttpError } from './errors.js';
import { createMailer, type Mailer } from './mail/mailer.js';
import { setupAuth } from './plugins/auth.js';
import { staffRoutes } from './staff/routes.js';

export interface BuildAppOptions {
  db: Database;
  config: Config;
  mailer?: Mailer;
  google?: GoogleClient | null;
  logger?: boolean | { level: string };
}

/** Monta o app sem escutar porta (usado por `server.ts` e pelos testes). */
export async function buildApp(opts: BuildAppOptions): Promise<FastifyInstance> {
  const { db, config } = opts;
  const app = Fastify({ logger: opts.logger ?? { level: config.logLevel } });
  const mailer = opts.mailer ?? createMailer(config);
  const google =
    opts.google !== undefined
      ? opts.google
      : config.google.clientId
        ? new RealGoogleClient(config)
        : null;

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof HttpError) {
      return reply.code(err.statusCode).send({ error: err.message });
    }
    const candidate = err as {
      statusCode?: number;
      validation?: unknown;
      message?: string;
    };
    if (candidate.validation) {
      return reply.code(400).send({
        error: 'requisição inválida',
        details: candidate.validation,
      });
    }
    if (
      candidate.statusCode &&
      candidate.statusCode >= 400 &&
      candidate.statusCode < 500
    ) {
      return reply
        .code(candidate.statusCode)
        .send({ error: candidate.message ?? 'requisição inválida' });
    }
    req.log.error(err);
    return reply.code(500).send({ error: 'erro interno' });
  });

  await app.register(cors, {
    origin: [config.frontendUrl],
    credentials: true,
  });
  await app.register(cookie);
  setupAuth(app, { db, config });

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(authRoutes, { db, config, mailer, google });
  await app.register(staffRoutes, { db, config });

  return app;
}
