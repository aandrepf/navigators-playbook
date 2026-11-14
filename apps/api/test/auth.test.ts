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
});
