import type { Config } from '../config.js';
import type { Database } from './types.js';

/**
 * Garante que o time e o primeiro head coach existam (idempotente).
 *
 * O head coach é semeado a partir de `SEED_HEAD_COACH_EMAIL` porque é ele quem
 * aprova os próximos cadastros de staff — não existe fila de aprovação sem um
 * head coach inicial.
 */
export async function seedHeadCoach(db: Database, config: Config): Promise<void> {
  const team = await db.query<{ id: string }>(
    'SELECT id FROM team ORDER BY created_at ASC LIMIT 1',
  );
  let teamId = team.rows[0]?.id;

  if (!teamId) {
    const inserted = await db.query<{ id: string }>(
      `INSERT INTO team (name, code) VALUES ($1, $2)
       ON CONFLICT (code) DO NOTHING
       RETURNING id`,
      [config.team.name, config.team.code],
    );
    teamId =
      inserted.rows[0]?.id ??
      (
        await db.query<{ id: string }>('SELECT id FROM team WHERE code = $1', [
          config.team.code,
        ])
      ).rows[0]?.id;
  }

  if (!teamId) {
    throw new Error('não foi possível criar o time no seed');
  }

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

  const team = await db.query<{ id: string }>(
    'SELECT id FROM team ORDER BY created_at ASC LIMIT 1',
  );
  const teamId = team.rows[0]?.id;
  if (!teamId) throw new Error('não foi possível encontrar o time no seed do admin');

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
