/**
 * Configuração carregada do ambiente. Nenhum segredo deve ser commitado: tudo
 * aqui vem de variáveis de ambiente documentadas em `apps/api/.env.example`.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function int(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export type NodeEnv = 'development' | 'test' | 'production';

export interface Config {
  env: NodeEnv;
  logLevel: string;
  port: number;
  host: string;
  databaseUrl: string;
  frontendUrl: string;
  cookie: {
    name: string;
    secure: boolean;
    sameSite: 'lax' | 'none' | 'strict';
    maxAgeMs: number;
  };
  otp: {
    ttlMs: number;
    length: number;
    /** intervalo mínimo entre envios para o mesmo e-mail (anti-abuso). */
    resendIntervalMs: number;
  };
  seedHeadCoach: {
    email: string | null;
    name: string | null;
  };
  seedAdmin: {
    email: string | null;
    name: string | null;
  };
  mailer: 'console' | 'smtp';
  smtp: {
    host: string;
    port: number;
    user: string | null;
    pass: string | null;
    from: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const rawEnv = env.NODE_ENV ?? 'development';
  const nodeEnv: NodeEnv =
    rawEnv === 'production' || rawEnv === 'test' ? rawEnv : 'development';
  const isProd = nodeEnv === 'production';

  const sessionTtlMs = int(env.SESSION_TTL_DAYS, 30) * DAY_MS;

  return {
    env: nodeEnv,
    logLevel: env.LOG_LEVEL ?? (isProd ? 'info' : 'info'),
    port: int(env.PORT, 3000),
    host: env.HOST ?? '0.0.0.0',
    databaseUrl: env.DATABASE_URL ?? '',
    frontendUrl: env.FRONTEND_URL ?? 'http://localhost:5173',
    cookie: {
      name: env.SESSION_COOKIE_NAME ?? 'playbook_session',
      secure:
        env.SESSION_COOKIE_SECURE !== undefined
          ? env.SESSION_COOKIE_SECURE === 'true'
          : isProd,
      sameSite: 'lax',
      maxAgeMs: sessionTtlMs,
    },
    otp: {
      ttlMs: int(env.OTP_TTL_MINUTES, 10) * 60 * 1000,
      length: int(env.OTP_LENGTH, 6),
      resendIntervalMs: int(env.OTP_RESEND_SECONDS, 60) * 1000,
    },
    seedHeadCoach: {
      email: env.SEED_HEAD_COACH_EMAIL ?? null,
      name: env.SEED_HEAD_COACH_NAME ?? null,
    },
    seedAdmin: {
      email: env.SEED_ADMIN_EMAIL ?? null,
      name: env.SEED_ADMIN_NAME ?? null,
    },
    mailer: env.MAILER === 'smtp' ? 'smtp' : 'console',
    smtp: {
      host: env.SMTP_HOST ?? '',
      port: int(env.SMTP_PORT, 587),
      user: env.SMTP_USER ?? null,
      pass: env.SMTP_PASS ?? null,
      from: env.MAIL_FROM ?? 'Playbook do Time <no-reply@playbook.local>',
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
      redirectUri:
        env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/auth/google/callback',
    },
  };
}
