import type { Database, Queryable } from '../db/types.js';
import {
  isSelfDeclarableStaffSubrole,
  type PublicUser,
  type Role,
  type StaffSubrole,
} from '../domain.js';
import { HttpError } from '../errors.js';

export interface UserRow {
  id: string;
  team_id: string;
  email: string;
  name: string | null;
  role: Role;
  approval_state: PublicUser['approvalState'];
}

export interface RegisterInput {
  teamId: string;
  email: string;
  name: string | null;
  role: Role;
  /** Obrigatório e auto-declarável apenas quando `role === 'staff'`. */
  staffRole?: StaffSubrole;
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
    `SELECT id, team_id, email, name, role, approval_state
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
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    approvalState: user.approval_state,
    subRoles: roles.rows.map((r) => r.role),
  };
}

/**
 * Encontra o usuário pelo e-mail ou o cria (jogador entra `ativo`; staff entra
 * `pendente` com o subpapel auto-declarado). Devolve também se criou agora.
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
  const approvalState: PublicUser['approvalState'] =
    input.role === 'staff' ? 'pendente' : 'ativo';

  if (input.role === 'staff') {
    if (!input.staffRole || !isSelfDeclarableStaffSubrole(input.staffRole)) {
      throw new HttpError(400, 'subpapel de staff inválido ou ausente');
    }
  }

  const user = await db.transaction(async (tx) => {
    const created = await tx.query<{ id: string }>(
      `INSERT INTO "user" (team_id, email, name, role, approval_state, email_verified_at)
       VALUES ($1, $2, $3, $4, $5, now())
       RETURNING id`,
      [input.teamId, email, input.name, input.role, approvalState],
    );
    const userId = created.rows[0].id;

    if (input.role === 'jogador') {
      await tx.query(
        `INSERT INTO player (team_id, user_id, roster_status)
         VALUES ($1, $2, 'disponivel')`,
        [input.teamId, userId],
      );
    } else if (input.staffRole) {
      await tx.query(
        'INSERT INTO staff_role (team_id, user_id, role) VALUES ($1, $2, $3)',
        [input.teamId, userId, input.staffRole],
      );
    }

    return {
      id: userId,
      email,
      name: input.name,
      role: input.role,
      approvalState,
      subRoles: input.role === 'staff' && input.staffRole ? [input.staffRole] : [],
    };
  });

  return { user, created: true };
}
