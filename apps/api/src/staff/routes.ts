import type { FastifyInstance } from 'fastify';
import type { Config } from '../config.js';
import type { Database } from '../db/types.js';
import type { PendingStaff } from '../domain.js';
import { HttpError } from '../errors.js';
import { getTeam } from '../team.js';

export interface StaffRoutesOptions {
  db: Database;
  config: Config;
}

interface PendingStaffRow {
  id: string;
  email: string;
  name: string | null;
  created_at: Date | string;
}

/**
 * Cadastros de staff aguardando aprovação. Restrito a admin ou head coach ativo;
 * a aprovação e a recusa em si são o próximo item (administração de staff).
 */
export async function staffRoutes(
  app: FastifyInstance,
  opts: StaffRoutesOptions,
): Promise<void> {
  const { db } = opts;

  app.get('/staff/pending', { preHandler: [app.requireHeadCoach] }, async () => {
    const team = await getTeam(db);
    if (!team) throw new HttpError(503, 'time não configurado');

    const result = await db.query<PendingStaffRow>(
      `SELECT u.id, u.email, u.name, u.created_at
       FROM "user" u
       WHERE u.team_id = $1 AND u.role = 'staff' AND u.approval_state = 'pendente'
       ORDER BY u.created_at ASC`,
      [team.id],
    );

    const staff: PendingStaff[] = result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.created_at).toISOString(),
    }));

    return { staff };
  });
}
