import type { Config } from '../config.js';
import type { Database } from './types.js';
import { TEAM_CATALOG } from '../team.js';

/**
 * Garante os times do catálogo (idempotente): insere os sete times com os
 * códigos e a habilitação corretos e desabilita qualquer time fora do
 * catálogo (ex.: código legado). Apenas o time habilitado aceita cadastro.
 */
export async function seedTeams(db: Database): Promise<void> {
  const codes = TEAM_CATALOG.map((team) => team.code);

  await db.query(
    'UPDATE team SET enabled = false WHERE NOT (code = ANY($1::text[]))',
    [codes],
  );

  for (const team of TEAM_CATALOG) {
    await db.query(
      `INSERT INTO team (name, code, enabled) VALUES ($1, $2, $3)
       ON CONFLICT (code) DO UPDATE
         SET name = EXCLUDED.name, enabled = EXCLUDED.enabled`,
      [team.name, team.code, team.enabled],
    );
  }
}

/** Devolve o id do único time habilitado, lançando se não houver nenhum. */
async function getEnabledTeamId(db: Database): Promise<string> {
  const team = await db.query<{ id: string }>(
    'SELECT id FROM team WHERE enabled = true ORDER BY created_at ASC LIMIT 1',
  );
  const teamId = team.rows[0]?.id;
  if (!teamId) {
    throw new Error('não foi possível encontrar o time habilitado no seed');
  }
  return teamId;
}

/**
 * Garante que o time e o primeiro head coach existam (idempotente).
 *
 * O head coach é semeado a partir de `SEED_HEAD_COACH_EMAIL` porque é ele quem
 * aprova os próximos cadastros de staff — não existe fila de aprovação sem um
 * head coach inicial.
 */
export async function seedHeadCoach(db: Database, config: Config): Promise<void> {
  await seedTeams(db);
  const teamId = await getEnabledTeamId(db);

  if (!config.seedHeadCoach.email) {
    console.warn(
      '[seed] SEED_HEAD_COACH_EMAIL não definido; head coach não será semeado.',
    );
    return;
  }

  const email = config.seedHeadCoach.email.toLowerCase();
  const existing = await db.query<{ id: string }>(
    'SELECT id FROM "user" WHERE team_id = $1 AND email = $2',
    [teamId, email],
  );
  if (existing.rows.length > 0) return;

  await db.transaction(async (tx) => {
    const user = await tx.query<{ id: string }>(
      `INSERT INTO "user" (team_id, email, name, role, approval_state, email_verified_at)
       VALUES ($1, $2, $3, 'staff', 'ativo', now())
       RETURNING id`,
      [teamId, email, config.seedHeadCoach.name ?? 'Head Coach'],
    );
    await tx.query(
      `INSERT INTO staff_role (team_id, user_id, role) VALUES ($1, $2, 'head_coach')`,
      [teamId, user.rows[0].id],
    );
  });
}

/** Garante um admin geral configurado pelo ambiente para operação e testes. */
export async function seedAdmin(db: Database, config: Config): Promise<void> {
  if (!config.seedAdmin.email) {
    console.warn('[seed] SEED_ADMIN_EMAIL não definido; admin não será semeado.');
    return;
  }

  await seedTeams(db);
  const teamId = await getEnabledTeamId(db);

  const email = config.seedAdmin.email.toLowerCase();
  const existing = await db.query<{ id: string }>(
    'SELECT id FROM "user" WHERE team_id = $1 AND email = $2',
    [teamId, email],
  );

  if (existing.rows[0]) {
    await db.query(
      `UPDATE "user"
       SET is_admin = true, approval_state = 'ativo', email_verified_at = COALESCE(email_verified_at, now())
       WHERE id = $1`,
      [existing.rows[0].id],
    );
    return;
  }

  await db.query(
    `INSERT INTO "user"
      (team_id, email, name, role, approval_state, is_admin, email_verified_at)
     VALUES ($1, $2, $3, 'staff', 'ativo', true, now())`,
    [teamId, email, config.seedAdmin.name ?? 'Admin'],
  );
}
