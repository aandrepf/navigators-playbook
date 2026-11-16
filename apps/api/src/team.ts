import type { Database } from './db/types.js';

export interface TeamRow {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
}

/** Identidade de um time no catálogo do SnapIn. */
export interface TeamDefinition {
  name: string;
  code: string;
  enabled: boolean;
}

/**
 * Catálogo oficial de times do SnapIn. Apenas o time habilitado aceita
 * cadastro; os demais existem no banco (multi-time, fase 3) mas respondem
 * indisponível quando usados no cadastro.
 */
export const TEAM_CATALOG: readonly TeamDefinition[] = [
  { name: 'Navigators', code: 'NAVS-2026', enabled: true },
  { name: 'Devils', code: 'DEVILS-2026', enabled: false },
  { name: 'Bulldogs', code: 'BLDS-2026', enabled: false },
  { name: 'Renegades', code: 'RNGD-2026', enabled: false },
  { name: 'Warriors', code: 'WARS-2026', enabled: false },
  { name: 'Mutts', code: 'MUTTS-2026', enabled: false },
  { name: 'Crusaders', code: 'CRSD-2026', enabled: false },
];

const TEAM_COLUMNS = 'id, name, code, enabled';

/** O MVP atende um time por vez: devolve o único time habilitado. */
export async function getTeam(db: Database): Promise<TeamRow | null> {
  const result = await db.query<TeamRow>(
    `SELECT ${TEAM_COLUMNS} FROM team WHERE enabled = true ORDER BY created_at ASC LIMIT 1`,
  );
  return result.rows[0] ?? null;
}

/** Devolve o time pelo código (normalizado), habilitado ou não. */
export async function getTeamByCode(
  db: Database,
  code: string,
): Promise<TeamRow | null> {
  const result = await db.query<TeamRow>(
    `SELECT ${TEAM_COLUMNS} FROM team WHERE code = $1`,
    [code.trim().toUpperCase()],
  );
  return result.rows[0] ?? null;
}
