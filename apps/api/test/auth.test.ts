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
      phone: '+351912345678',
      role: 'jogador',
      positions: ['QB', 'LB'],
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.user).toMatchObject({
      email: 'jogador@example.com',
      role: 'jogador',
      approvalState: 'ativo',
      subRoles: [],
      phone: '+351912345678',
      positions: [
        { unit: 'ofensiva', position: 'QB', approvalState: 'pendente' },
        { unit: 'defesa', position: 'LB', approvalState: 'pendente' },
      ],
      units: [],
      isAdmin: false,
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

  it('cria jogador sem posições (skip) e devolve posições e unidades vazias', async () => {
    const res = await registerViaEmail(ctx, {
      email: 'jogador-skip@example.com',
      name: 'Jogador Skip',
      role: 'jogador',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().user).toMatchObject({
      role: 'jogador',
      approvalState: 'ativo',
      positions: [],
      units: [],
      isAdmin: false,
    });
  });

  it('recusa posição inválida e subpapel no cadastro de staff', async () => {
    const invalidPosition = await registerViaEmail(ctx, {
      email: 'invalid-position@example.com',
      role: 'jogador',
      positions: ['K'],
    });
    expect(invalidPosition.statusCode).toBe(400);
    expect(invalidPosition.json()).toMatchObject({
      error: 'posição inválida para cadastro: K',
    });

    const duplicate = await registerViaEmail(ctx, {
      email: 'dup-position@example.com',
      role: 'jogador',
      positions: ['QB', 'QB'],
    });
    expect(duplicate.statusCode).toBe(400);
    expect(duplicate.json()).toMatchObject({ error: 'posição duplicada: QB' });

    const staff = await registerViaEmail(ctx, {
      email: 'staff-with-position@example.com',
      role: 'staff',
      positions: ['QB'],
    });
    expect(staff.statusCode).toBe(400);
    expect(staff.json()).toMatchObject({
      error: 'staff não pode enviar posições no cadastro',
    });

    const unknown = await registerViaEmail(ctx, {
      email: 'unknown-position@example.com',
      role: 'jogador',
      positions: ['WR-X'],
    });
    expect(unknown.statusCode).toBe(400);
    expect(unknown.json()).toMatchObject({
      error: 'posição inválida para cadastro: WR-X',
    });
  });

  it('recusa código de time inválido com erro específico', async () => {
    await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/request',
      payload: { email: 'wrong-team@example.com' },
    });
    const code = ctx.mailer.lastCodeFor('wrong-team@example.com');
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/verify',
      payload: {
        email: 'wrong-team@example.com',
        code,
        teamCode: 'WRONG',
        role: 'jogador',
      },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: 'código do time inválido' });
  });

  it('ignora staffRole no cadastro: staff entra pendente sem subpapel', async () => {
    const email = 'staff-role-legacy@example.com';
    await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/request',
      payload: { email },
    });
    const code = ctx.mailer.lastCodeFor(email);
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/auth/email/verify',
      payload: {
        email,
        code,
        teamCode: 'NAVIGATORS',
        role: 'staff',
        staffRole: 'coordenador_ofensivo',
      },
    });
    // o contrato não autoatribui subpapel: mesmo enviado, staffRole é ignorado
    expect(res.statusCode).toBe(200);
    expect(res.json().user).toMatchObject({
      role: 'staff',
      approvalState: 'pendente',
      subRoles: [],
    });
  });
});
