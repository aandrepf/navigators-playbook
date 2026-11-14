import type { Database } from '../db/types.js';
import type { PublicUser, StaffSubrole } from '../domain.js';
import { randomToken, sha256 } from './crypto.js';

export interface ResolvedSession {
  sessionId: string;
  user: PublicUser;
  lastSeenAt: number;
}

interface SessionRow {
  session_id: string;
  expires_at: Date | string;
  last_seen_at: Date | string;
  id: string;
  email: string;
  name: string | null;
  role: PublicUser['role'];
  approval_state: PublicUser['approvalState'];
}

/** Cria uma sessão e devolve o token opaco a colocar no cookie. */
export async function createSession(
  db: Database,
  teamId: string,
  userId: string,
  ttlMs: number,
): Promise<string> {
  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + ttlMs);
  await db.query(
    `INSERT INTO session (team_id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [teamId, userId, tokenHash, expiresAt],
  );
  return token;
}

/** Resolve o usuário a partir do token do cookie, ou `null` se inválido/expirado. */
export async function resolveSession(
  db: Database,
  token: string,
): Promise<ResolvedSession | null> {
  const tokenHash = sha256(token);
  const result = await db.query<SessionRow>(
    `SELECT s.id AS session_id, s.expires_at, s.last_seen_at,
            u.id, u.email, u.name, u.role, u.approval_state
     FROM session s
     JOIN "user" u ON u.id = s.user_id
     WHERE s.token_hash = $1`,
    [tokenHash],
  );

  const row = result.rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;

  const subRoles = await db.query<{ role: StaffSubrole }>(
    'SELECT role FROM staff_role WHERE user_id = $1',
    [row.id],
  );

  return {
    sessionId: row.session_id,
    lastSeenAt: new Date(row.last_seen_at).getTime(),
    user: {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      approvalState: row.approval_state,
      subRoles: subRoles.rows.map((r) => r.role),
    },
  };
}

/** Expiração deslizante: renova o prazo da sessão. */
export async function touchSession(
  db: Database,
  sessionId: string,
  ttlMs: number,
): Promise<void> {
  await db.query(
    'UPDATE session SET last_seen_at = now(), expires_at = $2 WHERE id = $1',
    [sessionId, new Date(Date.now() + ttlMs)],
  );
}

/** Revoga a sessão correspondente ao token. */
export async function destroySession(db: Database, token: string): Promise<void> {
  await db.query('DELETE FROM session WHERE token_hash = $1', [sha256(token)]);
}
