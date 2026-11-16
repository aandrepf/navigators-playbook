import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { TEAM_CATALOG } from '../src/team.js';
import {
  createTestContext,
  registerViaEmail,
  type TestContext,
} from './helpers.js';

const DISABLED_CODES = TEAM_CATALOG.filter((team) => !team.enabled).map(
  (team) => team.code,
);

describe('times do SnapIn', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  afterAll(async () => {
    await ctx.db.close();
  });

  it('semeia os sete times com exatamente um habilitado', async () => {
    const teams = await ctx.db.query<{
      code: string;
      name: string;
      enabled: boolean;
    }>('SELECT code, name, enabled FROM team ORDER BY name');

    expect(TEAM_CATALOG).toHaveLength(7);
    expect(teams.rows).toHaveLength(7);

    const enabled = teams.rows.filter((team) => team.enabled);
    expect(enabled).toHaveLength(1);
    expect(enabled[0]).toMatchObject({ code: 'NAVS-2026', name: 'Navigators' });

    const codes = new Set(teams.rows.map((team) => team.code));
    for (const team of TEAM_CATALOG) {
      expect(codes.has(team.code)).toBe(true);
    }
  });

  it('aceita cadastro no time habilitado (NAVS-2026)', async () => {
    const res = await registerViaEmail(ctx, {
      email: 'jogador-navigators@example.com',
      role: 'jogador',
    });
    expect(res.statusCode).toBe(200);
  });

  it.each(DISABLED_CODES)(
    'responde indisponível para o código desabilitado %s',
    async (code) => {
      const res = await ctx.app.inject({
        method: 'POST',
        url: '/auth/email/verify',
        payload: {
          email: 'alguem@example.com',
          code: '000000',
          teamCode: code,
          role: 'jogador',
        },
      });
      expect(res.statusCode).toBe(409);
      expect(res.json()).toEqual({ error: 'time indisponível para cadastro' });
    },
  );

  it('responde inválido para código desconhecido', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/verify',
      payload: {
        email: 'alguem@example.com',
        code: '000000',
        teamCode: 'UNKNOWN-2026',
        role: 'jogador',
      },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: 'código do time inválido' });
  });
});
