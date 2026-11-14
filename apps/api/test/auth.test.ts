import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createTestContext,
  extractCookie,
  injectWithSession,
  registerViaEmail,
  type TestContext,
} from './helpers.js';

describe('autenticação por código de e-mail', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestContext();
  });

  afterAll(async () => {
    await ctx.db.close();
  });

  it('envia um código de uso único e sempre responde 202', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/request',
      payload: { email: 'jogador@example.com' },
    });

    expect(res.statusCode).toBe(202);
    expect(res.json()).toEqual({ ok: true });
    expect(ctx.mailer.lastCodeFor('jogador@example.com')).toMatch(/^\d{6}$/);
  });

  it('recusa código inválido com 401', async () => {
    await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/request',
      payload: { email: 'errado@example.com' },
    });

    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/verify',
      payload: {
        email: 'errado@example.com',
        code: '000000',
        teamCode: 'NAVIGATORS',
        role: 'jogador',
      },
    });

    expect(res.statusCode).toBe(401);
  });

  it('verifica o código, cria o jogador e abre uma sessão por cookie', async () => {
    const res = await registerViaEmail(ctx, {
      email: 'jogador@example.com',
      name: 'Jogador Um',
      role: 'jogador',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.user).toMatchObject({
      email: 'jogador@example.com',
      role: 'jogador',
      approvalState: 'ativo',
      subRoles: [],
    });

    const token = extractCookie(res, ctx.config.cookie.name);
    expect(token).toBeTruthy();
    const setCookie = res.headers['set-cookie'];
    const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
    expect(cookieStr).toContain('HttpOnly');
    expect(cookieStr).toContain('SameSite=Lax');

    // a sessão persiste e identifica o usuário
    const session = await injectWithSession(ctx, res, {
      method: 'GET',
      url: '/auth/session',
    });
    expect(session.statusCode).toBe(200);
    expect(session.json()).toEqual({ user: body.user });
  });

  it('falha sem sessão e encerra a sessão no logout', async () => {
    const anon = await ctx.app.inject({ method: 'GET', url: '/auth/session' });
    expect(anon.statusCode).toBe(401);

    const res = await registerViaEmail(ctx, {
      email: 'logout@example.com',
      role: 'jogador',
    });
    expect(res.statusCode).toBe(200);

    const loggedOut = await injectWithSession(ctx, res, {
      method: 'POST',
      url: '/auth/logout',
    });
    expect(loggedOut.statusCode).toBe(204);

    const after = await injectWithSession(ctx, res, {
      method: 'GET',
      url: '/auth/session',
    });
    expect(after.statusCode).toBe(401);
  });

  it('não vaza se o e-mail existe ou não: request sempre 202', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/request',
      payload: { email: 'ninguem@example.com' },
    });
    expect(res.statusCode).toBe(202);
  });

  it('retorna 409 ao registrar coordenador de unidade já ocupado', async () => {
    // primeiro coordenador ofensivo entra normalmente
    const first = await registerViaEmail(ctx, {
      email: 'coord-a@example.com',
      role: 'staff',
      staffRole: 'coordenador_ofensivo',
    });
    expect(first.statusCode).toBe(200);

    // segundo cadastro para a mesma vaga exclusiva → conflito de domínio
    const duplicate = await registerViaEmail(ctx, {
      email: 'coord-b@example.com',
      role: 'staff',
      staffRole: 'coordenador_ofensivo',
    });
    expect(duplicate.statusCode).toBe(409);
    expect(duplicate.json()).toMatchObject({
      error: 'este subpapel de staff já está ocupado',
    });

    // outra unidade exclusiva continua livre
    const defensive = await registerViaEmail(ctx, {
      email: 'coord-c@example.com',
      role: 'staff',
      staffRole: 'coordenador_defensivo',
    });
    expect(defensive.statusCode).toBe(200);

    // coordenador de special teams é aditivo: não conflita
    const st1 = await registerViaEmail(ctx, {
      email: 'st1@example.com',
      role: 'staff',
      staffRole: 'coordenador_special_teams',
    });
    expect(st1.statusCode).toBe(200);
    const st2 = await registerViaEmail(ctx, {
      email: 'st2@example.com',
      role: 'staff',
      staffRole: 'coordenador_special_teams',
    });
    expect(st2.statusCode).toBe(200);
  });
});
