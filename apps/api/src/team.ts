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

/** Normaliza o código do time para comparação: caixa alta, sem espaços. */
export function normalizeTeamCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Devolve o código do único time habilitado no catálogo (NAVS-2026). */
export function getActiveTeamCode(): string {
  const enabled = TEAM_CATALOG.filter((team) => team.enabled);
  if (enabled.length !== 1) {
    throw new Error(
      'o catálogo de times deve ter exatamente um time habilitado',
    );
  }
  return enabled[0].code;
}

/** Devolve true se o código (normalizado) pertence ao catálogo oficial. */
export function isKnownTeamCode(code: string): boolean {
  const normalized = normalizeTeamCode(code);
  return TEAM_CATALOG.some((team) => team.code === normalized);
}

/**
 * O MVP atende um time por vez: devolve o time habilitado do catálogo.
 * Códigos legados fora do catálogo nunca são devolvidos aqui, mesmo que ainda
 * carreguem `enabled` verdadeiro por deriva de dados antigos.
 */
export async function getTeam(db: Database): Promise<TeamRow | null> {
  const result = await db.query<TeamRow>(
    `SELECT ${TEAM_COLUMNS} FROM team WHERE code = $1 AND enabled = true`,
    [getActiveTeamCode()],
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
    [normalizeTeamCode(code)],
  );
  return result.rows[0] ?? null;
}
