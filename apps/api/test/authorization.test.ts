import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createTestContext,
  injectWithSession,
  registerViaEmail,
  type TestContext,
} from './helpers.js';

describe('autorização por papel', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  afterAll(async () => {
    await ctx.db.close();
  });

  it('staff pendente lê o próprio estado e nada mais', async () => {
    const pending = await registerViaEmail(ctx, {
      email: 'coord@example.com',
      name: 'Coordenador',
      role: 'staff',
    });
    expect(pending.statusCode).toBe(200);
    expect(pending.json().user).toMatchObject({
      role: 'staff',
      approvalState: 'pendente',
      subRoles: [],
    });

    // lê o próprio estado
    const own = await injectWithSession(ctx, pending, {
      method: 'GET',
      url: '/auth/session',
    });
    expect(own.statusCode).toBe(200);
    expect(own.json().user.approvalState).toBe('pendente');

    // mas não acessa recurso restrito a head coach
    const restricted = await injectWithSession(ctx, pending, {
      method: 'GET',
      url: '/staff/pending',
    });
    expect(restricted.statusCode).toBe(403);
  });

  it('jogador não acessa a fila de aprovação de staff', async () => {
    const player = await registerViaEmail(ctx, {
      email: 'jogador@example.com',
      role: 'jogador',
    });
    expect(player.statusCode).toBe(200);

    const res = await injectWithSession(ctx, player, {
      method: 'GET',
      url: '/staff/pending',
    });
    expect(res.statusCode).toBe(403);
  });

  it('head coach (semeado) vê os cadastros pendentes', async () => {
    await registerViaEmail(ctx, {
      email: 'coord2@example.com',
      name: 'Coordenador Dois',
      role: 'staff',
    });

    // o head coach semeado entra pelo mesmo fluxo de código
    const head = await registerViaEmail(ctx, {
      email: 'head@example.com',
      role: 'staff',
    });
    expect(head.statusCode).toBe(200);
    expect(head.json().user).toMatchObject({
      role: 'staff',
      approvalState: 'ativo',
      subRoles: ['head_coach'],
      isAdmin: false,
    });

    const res = await injectWithSession(ctx, head, {
      method: 'GET',
      url: '/staff/pending',
    });
    expect(res.statusCode).toBe(200);

    const { staff } = res.json();
    expect(staff.map((s: { email: string }) => s.email)).toContain(
      'coord2@example.com',
    );
    expect(staff.find((s: { email: string }) => s.email === 'coord2@example.com')).toMatchObject({
      email: 'coord2@example.com',
      name: 'Coordenador Dois',
    });
  });

  it('admin geral (semeado) administra a fila de staff pendentes', async () => {
    await registerViaEmail(ctx, {
      email: 'staff-admin@example.com',
      name: 'Staff Para Admin',
      role: 'staff',
    });

    const admin = await registerViaEmail(ctx, {
      email: 'admin@example.com',
      role: 'staff',
    });
    expect(admin.statusCode).toBe(200);
    expect(admin.json().user).toMatchObject({
      role: 'staff',
      approvalState: 'ativo',
      isAdmin: true,
    });

    const res = await injectWithSession(ctx, admin, {
      method: 'GET',
      url: '/staff/pending',
    });
    expect(res.statusCode).toBe(200);

    const { staff } = res.json();
    expect(staff.map((s: { email: string }) => s.email)).toContain(
      'staff-admin@example.com',
    );
  });

  it('staff ativo sem subpapel não administra a fila de pendentes', async () => {
    const staff = await registerViaEmail(ctx, {
      email: 'staff-ativo@example.com',
      name: 'Staff Ativo',
      role: 'staff',
    });
    expect(staff.statusCode).toBe(200);

    // promove manualmente a staff ativo (a aprovação formal é a próxima fatia)
    await ctx.db.query(`UPDATE "user" SET approval_state = 'ativo' WHERE id = $1`, [
      staff.json().user.id,
    ]);

    const res = await injectWithSession(ctx, staff, {
      method: 'GET',
      url: '/staff/pending',
    });
    expect(res.statusCode).toBe(403);
  });

  it('deriva unidades apenas de posições aprovadas na sessão', async () => {
    const res = await registerViaEmail(ctx, {
      email: 'jogador-unidades@example.com',
      role: 'jogador',
      positions: ['QB', 'LB'],
    });
    expect(res.statusCode).toBe(200);
    const { user } = res.json();
    expect(user.units).toEqual([]);

    // aprova a posição de ofensiva (fixture direta no banco; a revisão de
    // posições pelo staff é a próxima fatia)
    const player = await ctx.db.query<{ id: string }>(
      'SELECT id FROM player WHERE user_id = $1',
      [user.id],
    );
    await ctx.db.query(
      `UPDATE player_position SET approval_state = 'aprovada'
       WHERE player_id = $1 AND position = 'QB'`,
      [player.rows[0].id],
    );

    const session = await injectWithSession(ctx, res, {
      method: 'GET',
      url: '/auth/session',
    });
    expect(session.statusCode).toBe(200);
    expect(session.json().user.units).toEqual(['ofensiva']);
    expect(session.json().user.positions).toEqual([
      { unit: 'ofensiva', position: 'QB', approvalState: 'aprovada' },
      { unit: 'defesa', position: 'LB', approvalState: 'pendente' },
    ]);
  });
});
