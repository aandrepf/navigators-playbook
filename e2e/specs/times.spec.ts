import { expect, test } from '../support/fixtures'
import { uniqueEmail, verifyRaw } from '../support/accounts'
import { DISABLED_TEAM_CODES, TEAM_CODE } from '../support/constants.mjs'

/**
 * Disponibilidade de times no cadastro (docs/api, POST /auth/email/verify).
 * Só o Navigators (`NAVS-2026`) está habilitado: os demais códigos do catálogo
 * existem no banco e respondem 409; código desconhecido responde 400. A tela
 * não envia código de time, então estas fronteiras são checadas pela API.
 */
test.describe('Times do SnapIn: cadastro', () => {
  test('Navigators (NAVS-2026) habilitado aceita cadastro e devolve o jogador', async () => {
    const { status, body } = await verifyRaw(uniqueEmail('times.navs'), {
      role: 'jogador',
      teamCode: TEAM_CODE,
    })
    expect(status).toBe(200)
    expect(body).toMatchObject({ user: { role: 'jogador', approvalState: 'ativo' } })
  })

  test('o código do Navigators é normalizado (caixa e espaços)', async () => {
    const { status } = await verifyRaw(uniqueEmail('times.caixa'), {
      role: 'jogador',
      teamCode: `  ${TEAM_CODE.toLowerCase()} `,
    })
    expect(status).toBe(200)
  })

  for (const code of DISABLED_TEAM_CODES) {
    test(`código indisponível ${code} responde 409 e não abre sessão`, async () => {
      const { status, body } = await verifyRaw(uniqueEmail(`times.${code.toLowerCase()}`), {
        role: 'jogador',
        teamCode: code,
      })
      expect(status).toBe(409)
      expect(body).toEqual({ error: 'time indisponível para cadastro' })
    })
  }

  test('código desconhecido responde 400 (inválido), não indisponível', async () => {
    const { status, body } = await verifyRaw(uniqueEmail('times.desconhecido'), {
      role: 'jogador',
      teamCode: 'NAO-EXISTE-2026',
    })
    expect(status).toBe(400)
    expect(JSON.stringify(body)).toMatch(/código do time inválido/)
  })
})
