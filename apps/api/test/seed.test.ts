import { PGlite } from '@electric-sql/pglite';
import { describe, expect, it } from 'vitest';
import { runMigrations } from '../src/db/migrate.js';
import { seedAdmin, seedAll, seedHeadCoach, seedTeams } from '../src/db/seed.js';
import type { Database } from '../src/db/types.js';
import { TEAM_CATALOG } from '../src/team.js';
import { createPgliteDatabase, makeTestConfig } from './helpers.js';

async function freshDb(): Promise<Database> {
  const pglite = new PGlite();
  const db = createPgliteDatabase(pglite);
  await runMigrations(db);
  return db;
}

describe('seed dos times (não destrutivo)', () => {
  it('preserva time legado fora do catálogo, sem desabilitar nem renomear', async () => {
    const db = await freshDb();
    try {
      // Time legado (código fora do catálogo) com head coach já vinculado.
      const legacy = await db.query<{ id: string }>(
        `INSERT INTO team (name, code, enabled)
         VALUES ('Navigators Antigo', 'NAVIGATORS', true)
         RETURNING id`,
      );
      const legacyId = legacy.rows[0].id;
      const coach = await db.query<{ id: string }>(
        `INSERT INTO "user" (team_id, email, role, approval_state)
         VALUES ($1, 'coach@example.com', 'staff', 'ativo')
         RETURNING id`,
        [legacyId],
      );
      await db.query(
        `INSERT INTO staff_role (team_id, user_id, role)
         VALUES ($1, $2, 'head_coach')`,
        [legacyId, coach.rows[0].id],
      );

      await seedTeams(db);

      const legacyRow = await db.query<{
        name: string;
        enabled: boolean;
      }>('SELECT name, enabled FROM team WHERE code = $1', ['NAVIGATORS']);
      expect(legacyRow.rows[0]).toMatchObject({
        name: 'Navigators Antigo',
        enabled: true,
      });

      // O head coach legado permanece vinculado ao time, sem alteração.
      const coachRow = await db.query(
        'SELECT id FROM "user" WHERE team_id = $1 AND email = $2',
        [legacyId, 'coach@example.com'],
      );
      expect(coachRow.rows).toHaveLength(1);
      const roleRow = await db.query(
        'SELECT role FROM staff_role WHERE user_id = $1',
        [coach.rows[0].id],
      );
      expect(roleRow.rows.map((r) => r.role)).toEqual(['head_coach']);

      // Os sete times do catálogo passam a existir.
      const codes = await db.query<{ code: string }>(
        'SELECT code FROM team',
      );
      for (const team of TEAM_CATALOG) {
        expect(codes.rows.some((r) => r.code === team.code)).toBe(true);
      }
    } finally {
      await db.close();
    }
  });

  it('preserva o nome de um time do catálogo existente e sincroniza só enabled', async () => {
    const db = await freshDb();
    try {
      await db.query(
        `INSERT INTO team (name, code, enabled)
         VALUES ('Navigators FA', 'NAVS-2026', false)`,
      );

      await seedTeams(db);

      const row = await db.query<{ name: string; enabled: boolean }>(
        'SELECT name, enabled FROM team WHERE code = $1',
        ['NAVS-2026'],
      );
      expect(row.rows[0]).toMatchObject({ name: 'Navigators FA', enabled: true });

      // Entre os sete do catálogo, apenas NAVS-2026 fica habilitado.
      const enabled = await db.query<{ code: string }>(
        `SELECT code FROM team WHERE enabled = true AND code = ANY($1::text[])`,
        [TEAM_CATALOG.map((t) => t.code)],
      );
      expect(enabled.rows).toEqual([{ code: 'NAVS-2026' }]);
    } finally {
      await db.close();
    }
  });
});

describe('seed do head coach e do admin geral', () => {
  it('seedHeadCoach é idempotente e não duplica nem altera o existente', async () => {
    const db = await freshDb();
    try {
      const config = makeTestConfig();

      await seedHeadCoach(db, config);
      const first = await db.query<{ id: string }>(
        'SELECT id FROM "user" WHERE email = $1',
        ['head@example.com'],
      );
      expect(first.rows).toHaveLength(1);

      await seedHeadCoach(db, config);
      const second = await db.query<{ id: string }>(
        'SELECT id FROM "user" WHERE email = $1',
        ['head@example.com'],
      );
      expect(second.rows).toHaveLength(1);
      expect(second.rows[0].id).toBe(first.rows[0].id);

      const roles = await db.query<{ role: string }>(
        'SELECT role FROM staff_role WHERE user_id = $1',
        [first.rows[0].id],
      );
      expect(roles.rows.map((r) => r.role)).toEqual(['head_coach']);
    } finally {
      await db.close();
    }
  });

  it('seedAdmin é idempotente e promove usuário existente sem duplicar', async () => {
    const db = await freshDb();
    try {
      const config = makeTestConfig();

      await seedAdmin(db, config);
      const first = await db.query<{ id: string; is_admin: boolean }>(
        'SELECT id, is_admin FROM "user" WHERE email = $1',
        ['admin@example.com'],
      );
      expect(first.rows).toHaveLength(1);
      expect(first.rows[0].is_admin).toBe(true);

      await seedAdmin(db, config);
      const second = await db.query<{ id: string; is_admin: boolean }>(
        'SELECT id, is_admin FROM "user" WHERE email = $1',
        ['admin@example.com'],
      );
      expect(second.rows).toHaveLength(1);
      expect(second.rows[0].id).toBe(first.rows[0].id);
      expect(second.rows[0].is_admin).toBe(true);
    } finally {
      await db.close();
    }
  });

  it('seedAll semeia head coach e admin juntos (caminho de arranque)', async () => {
    const db = await freshDb();
    try {
      await seedAll(db, makeTestConfig());

      const head = await db.query(
        'SELECT id FROM "user" WHERE email = $1',
        ['head@example.com'],
      );
      expect(head.rows).toHaveLength(1);

      const admin = await db.query<{ is_admin: boolean }>(
        'SELECT is_admin FROM "user" WHERE email = $1',
        ['admin@example.com'],
      );
      expect(admin.rows).toHaveLength(1);
      expect(admin.rows[0].is_admin).toBe(true);
    } finally {
      await db.close();
    }
  });
});
