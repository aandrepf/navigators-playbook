import type { Database, Queryable } from '../db/types.js';
import {
  type PlayerPosition,
  type PublicUser,
  type Role,
  type StaffSubrole,
  unitForPosition,
} from '../domain.js';
import { HttpError } from '../errors.js';

export interface UserRow {
  id: string;
  team_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: Role;
  approval_state: PublicUser['approvalState'];
  is_admin: boolean;
}

export interface RegisterInput {
  teamId: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: Role;
  positions?: string[];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(
  db: Queryable,
  teamId: string,
  email: string,
): Promise<UserRow | null> {
  const result = await db.query<UserRow>(
    `SELECT id, team_id, email, name, phone, role, approval_state, is_admin
     FROM "user" WHERE team_id = $1 AND email = $2`,
    [teamId, normalizeEmail(email)],
  );
  return result.rows[0] ?? null;
}

export async function toPublicUser(db: Queryable, user: UserRow): Promise<PublicUser> {
  const roles = await db.query<{ role: StaffSubrole }>(
    'SELECT role FROM staff_role WHERE user_id = $1',
    [user.id],
  );
  const positions = await db.query<{
    unit: PlayerPosition['unit'];
    position: string;
    approval_state: PlayerPosition['approvalState'];
  }>(
    `SELECT pp.unit, pp.position, pp.approval_state
     FROM player_position pp
     JOIN player p ON p.id = pp.player_id
     WHERE p.user_id = $1
     ORDER BY pp.created_at,
       CASE pp.unit WHEN 'ofensiva' THEN 1 WHEN 'defesa' THEN 2 ELSE 3 END,
       pp.position`,
    [user.id],
  );
  const publicPositions = positions.rows.map((row) => ({
    unit: row.unit,
    position: row.position,
    approvalState: row.approval_state,
  }));
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    approvalState: user.approval_state,
    isAdmin: user.is_admin,
    subRoles: roles.rows.map((r) => r.role),
    positions: publicPositions,
    units: [...new Set(
      publicPositions
        .filter((position) => position.approvalState === 'aprovada')
        .map((position) => position.unit),
    )],
  };
}

/**
 * Encontra o usuário pelo e-mail ou o cria. Jogadores entram ativos e suas
 * posições iniciais aguardam validação; staff entra pendente sem subpapel.
 */
export async function findOrCreateUser(
  db: Database,
  input: RegisterInput,
): Promise<{ user: PublicUser; created: boolean }> {
  const existing = await findUserByEmail(db, input.teamId, input.email);
  if (existing) {
    return { user: await toPublicUser(db, existing), created: false };
  }

  const email = normalizeEmail(input.email);
  if (input.role === 'staff' && input.positions?.length) {
    throw new HttpError(400, 'staff não pode enviar posições no cadastro');
  }
  const approvalState: PublicUser['approvalState'] =
    input.role === 'staff' ? 'pendente' : 'ativo';
  const positions = input.positions ?? [];
  const seen = new Set<string>();
  for (const position of positions) {
    if (seen.has(position)) throw new HttpError(400, `posição duplicada: ${position}`);
    seen.add(position);
    const unit = unitForPosition(position);
    if (!unit || unit === 'special_teams') {
      throw new HttpError(400, `posição inválida para cadastro: ${position}`);
    }
  }

  const user = await db.transaction(async (tx) => {
    const created = await tx.query<{ id: string }>(
      `INSERT INTO "user" (team_id, email, name, phone, role, approval_state, email_verified_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       RETURNING id`,
      [input.teamId, email, input.name, input.phone, input.role, approvalState],
    );
    const userId = created.rows[0].id;

    if (input.role === 'jogador') {
      await tx.query(
        `INSERT INTO player (team_id, user_id, roster_status)
          VALUES ($1, $2, 'disponivel')`,
        [input.teamId, userId],
      );
      if (positions.length) {
        const player = await tx.query<{ id: string }>(
          'SELECT id FROM player WHERE user_id = $1',
          [userId],
        );
        for (const position of positions) {
          await tx.query(
            `INSERT INTO player_position
              (team_id, player_id, unit, position, approval_state)
             VALUES ($1, $2, $3, $4, 'pendente')`,
            [input.teamId, player.rows[0].id, unitForPosition(position), position],
          );
        }
      }
    }

    return {
      id: userId,
      email,
      name: input.name,
      phone: input.phone,
      role: input.role,
      approvalState,
      isAdmin: false,
      subRoles: [],
      positions: positions.map((position) => ({
        unit: unitForPosition(position)!,
        position,
        approvalState: 'pendente' as const,
      })),
      units: [],
    };
  });

  return { user, created: true };
}
