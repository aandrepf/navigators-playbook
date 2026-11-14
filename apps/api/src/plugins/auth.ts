import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Config } from '../config.js';
import type { Database } from '../db/types.js';
import type { PublicUser } from '../domain.js';
import { resolveSession, touchSession } from '../auth/session.js';

const TOUCH_THRESHOLD_MS = 15 * 60 * 1000;

declare module 'fastify' {
  interface FastifyRequest {
    /** Usuário da sessão atual, ou `null` quando não autenticado. */
    sessionUser: PublicUser | null;
    /** Token opaco do cookie da sessão, ou `null`. */
    sessionToken: string | null;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply, done: () => void) => void;
    requireActiveStaff: (
      req: FastifyRequest,
      reply: FastifyReply,
      done: () => void,
    ) => void;
    requireHeadCoach: (
      req: FastifyRequest,
      reply: FastifyReply,
      done: () => void,
    ) => void;
  }
}

export interface AuthOptions {
  db: Database;
  config: Config;
}

function unauthorized(reply: FastifyReply): void {
  reply.code(401).send({ error: 'não autenticado' });
}

function forbidden(reply: FastifyReply, message: string): void {
  reply.code(403).send({ error: message });
}

/**
 * Configura sessão e autorização na instância raiz (não é um plugin
 * encapsulado): o hook de sessão e os guards valem para todas as rotas
 * registradas depois. Deve ser chamado após `@fastify/cookie`.
 */
export function setupAuth(app: FastifyInstance, opts: AuthOptions): void {
  const { db, config } = opts;

  app.decorateRequest('sessionUser', null);
  app.decorateRequest('sessionToken', null);

  app.addHook('preHandler', async (req) => {
    const token = req.cookies[config.cookie.name];
    if (!token) return;
    const resolved = await resolveSession(db, token);
    if (!resolved) return;
    req.sessionToken = token;
    req.sessionUser = resolved.user;
    // Expiração deslizante: renova apenas de tempos em tempos.
    if (Date.now() - resolved.lastSeenAt > TOUCH_THRESHOLD_MS) {
      await touchSession(db, resolved.sessionId, config.cookie.maxAgeMs);
    }
  });

  app.decorate('requireAuth', (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
    if (reply.sent) return done();
    if (!req.sessionUser) return unauthorized(reply);
    done();
  });

  app.decorate(
    'requireActiveStaff',
    (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
      if (reply.sent) return done();
      const user = req.sessionUser;
      if (!user) return unauthorized(reply);
      if (user.role !== 'staff' || user.approvalState !== 'ativo') {
        return forbidden(reply, 'exige staff ativo');
      }
      done();
    },
  );

  app.decorate(
    'requireHeadCoach',
    (req: FastifyRequest, reply: FastifyReply, done: () => void) => {
      if (reply.sent) return done();
      const user = req.sessionUser;
      if (!user) return unauthorized(reply);
      if (
        user.role !== 'staff' ||
        user.approvalState !== 'ativo' ||
        !user.subRoles.includes('head_coach')
      ) {
        return forbidden(reply, 'exige head coach');
      }
      done();
    },
  );
}
