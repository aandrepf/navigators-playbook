import type { Database } from '../db/types.js';
import { constantTimeEqual, generateOtpCode, randomToken, sha256 } from './crypto.js';

export interface IssuedCode {
  email: string;
  code: string;
  expiresAt: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Emite um código de uso único para o e-mail e grava apenas o hash.
 * O código em claro é devolvido para o chamador enviar pelo seam de mailer.
 */
export async function issueLoginCode(
  db: Database,
  teamId: string,
  email: string,
  ttlMs: number,
  length: number,
): Promise<IssuedCode> {
  const code = generateOtpCode(length);
  const salt = randomToken(16);
  const codeHash = sha256(`${code}:${salt}`);
  const expiresAt = new Date(Date.now() + ttlMs);

  await db.query(
    `INSERT INTO email_code (team_id, email, code_hash, salt, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [teamId, normalizeEmail(email), codeHash, salt, expiresAt],
  );

  return { email: normalizeEmail(email), code, expiresAt: expiresAt.toISOString() };
}

/** Consome (invalida) o código se ele for válido. Retorna `true` uma única vez. */
export async function consumeLoginCode(
  db: Database,
  teamId: string,
  email: string,
  code: string,
): Promise<boolean> {
  const result = await db.query<{
    id: string;
    code_hash: string;
    salt: string;
    expires_at: Date | string;
    consumed_at: Date | string | null;
  }>(
    `SELECT id, code_hash, salt, expires_at, consumed_at
     FROM email_code
     WHERE team_id = $1 AND email = $2 AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [teamId, normalizeEmail(email)],
  );

  const entry = result.rows[0];
  if (!entry) return false;
  if (new Date(entry.expires_at).getTime() < Date.now()) return false;

  const hash = sha256(`${code}:${entry.salt}`);
  if (!constantTimeEqual(hash, entry.code_hash)) return false;

  await db.query('UPDATE email_code SET consumed_at = now() WHERE id = $1', [
    entry.id,
  ]);
  return true;
}

/** Há um código emitido há menos de `intervalMs`? (anti-abuso de envio). */
export async function wasCodeIssuedRecently(
  db: Database,
  teamId: string,
  email: string,
  intervalMs: number,
): Promise<boolean> {
  const result = await db.query<{ created_at: Date | string }>(
    `SELECT created_at FROM email_code
     WHERE team_id = $1 AND email = $2
     ORDER BY created_at DESC
     LIMIT 1`,
    [teamId, normalizeEmail(email)],
  );
  const row = result.rows[0];
  if (!row) return false;
  return Date.now() - new Date(row.created_at).getTime() < intervalMs;
}
