import pg from 'pg'
import { expect, test } from '../support/fixtures'
import { uniqueEmail, verifyRaw } from '../support/accounts'
import { DISABLED_TEAM_CODES, TEAM_CODE } from '../support/constants.mjs'

/** Código do time legado (antes do catálogo atual). Existe só como registro preservado. */
const LEGACY_TEAM_CODE = 'NAVIGATORS'
const LEGACY_TEAM_NAME = 'Navigators Antigo (legado)'

/**
 * Insere o legado como o seed o deixa após a correção QA-03: registro
 * preservado (nome e código), `enabled = false`. Idempotente: se já existir,
 * garante que continua desabilitado e com o nome original.
 */
async function ensureLegacyTeamPreservedAndDisabled(): Promise<void> {
  const url = process.env.E2E_DATABASE_URL
  if (!url) throw new Error('E2E_DATABASE_URL não definido: a suíte precisa do Postgres de teste.')
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    await client.query(
      `INSERT INTO team (name, code, enabled) VALUES ($1, $2, false)
       ON CONFLICT (code) DO UPDATE SET enabled = false`,
      [LEGACY_TEAM_NAME, LEGACY_TEAM_CODE],
    )
  } finally {
    await client.end()
  }
}

async function readTeamRow(code: string): Promise<{ name: string; enabled: boolean } | null> {
  const url = process.env.E2E_DATABASE_URL
  if (!url) throw new Error('E2E_DATABASE_URL não definido: a suíte precisa do Postgres de teste.')
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    const result = await client.query<{ name: string; enabled: boolean }>(
      'SELECT name, enabled FROM team WHERE code = $1',
      [code],
    )
    return result.rows[0] ?? null
  } finally {
    await client.end()
  }
}

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

  test('registro do time legado NAVIGATORS é preservado e indisponível (não aceita cadastro)', async () => {
    await ensureLegacyTeamPreservedAndDisabled()

    const { status, body } = await verifyRaw(uniqueEmail('times.legado'), {
      role: 'jogador',
      teamCode: LEGACY_TEAM_CODE,
    })
    // Contrato (docs/api/README.md e openapi): código fora do catálogo é inválido (400),
    // nunca aceito. Ver nota de divergência no RELATORIO-QA-04.md.
    expect(status).toBe(400)
    expect(JSON.stringify(body)).toMatch(/código do time inválido/)

    // O registro continua no banco, com o nome original e desabilitado.
    expect(await readTeamRow(LEGACY_TEAM_CODE)).toEqual({
      name: LEGACY_TEAM_NAME,
      enabled: false,
    })
  })

  test('com o legado preservado, NAVS-2026 continua aceitando cadastro', async () => {
    await ensureLegacyTeamPreservedAndDisabled()

    const { status, body } = await verifyRaw(uniqueEmail('times.navs-com-legado'), {
      role: 'jogador',
      teamCode: TEAM_CODE,
    })
    expect(status).toBe(200)
    expect(body).toMatchObject({ user: { role: 'jogador', approvalState: 'ativo' } })
  })

  test('código desconhecido responde 400 (inválido), não indisponível', async () => {
    const { status, body } = await verifyRaw(uniqueEmail('times.desconhecido'), {
      role: 'jogador',
      teamCode: 'NAO-EXISTE-2026',
    })
    expect(status).toBe(400)
    expect(JSON.stringify(body)).toMatch(/código do time inválido/)
  })
})
