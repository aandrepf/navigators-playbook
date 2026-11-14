import type { Database } from './db/types.js';

export interface TeamRow {
  id: string;
  name: string;
  code: string;
}

/** O MVP atende um time por vez; devolve o único time. */
export async function getTeam(db: Database): Promise<TeamRow | null> {
  const result = await db.query<TeamRow>(
    'SELECT id, name, code FROM team ORDER BY created_at ASC LIMIT 1',
  );
  return result.rows[0] ?? null;
}

export async function getTeamByCode(
  db: Database,
  code: string,
): Promise<TeamRow | null> {
  const result = await db.query<TeamRow>('SELECT id, name, code FROM team WHERE code = $1', [
    code.trim().toUpperCase(),
  ]);
  return result.rows[0] ?? null;
}
