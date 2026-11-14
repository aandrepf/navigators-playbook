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
      staffRole: 'coordenador_ofensivo',
    });
    expect(pending.statusCode).toBe(200);
    expect(pending.json().user).toMatchObject({
      role: 'staff',
      approvalState: 'pendente',
      subRoles: ['coordenador_ofensivo'],
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
      staffRole: 'coordenador_defensivo',
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
    expect(
      staff.find((s: { email: string }) => s.email === 'coord2@example.com')
        .requestedSubrole,
    ).toBe('coordenador_defensivo');
  });
});
