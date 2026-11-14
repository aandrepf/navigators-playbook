import { apiAs } from '../support/accounts'
import { expect, openAs, test } from '../support/fixtures'
import { navLink } from '../support/shell'

/**
 * Fronteiras de autorização. A regra vale no servidor (docs/api, ADR-0005 e
 * ADR-0006); a tela só reflete. Por isso cada regra é checada duas vezes: pela
 * API direta e pelo que o usuário vê no app.
 */

test.describe('Jogador', () => {
  test('não vê a aba Elenco na navegação', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(navLink(page, 'Playbook')).toBeVisible()
    await expect(navLink(page, 'Elenco')).toHaveCount(0)
  })

  test('acessar /elenco pela URL mostra acesso restrito, sem dados do elenco', async ({ page, jogador }) => {
    await openAs(page, jogador, '/elenco')
    await expect(page.getByRole('heading', { name: 'Acesso restrito' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Elenco', exact: true })).toHaveCount(0)
  })

  test('sessão da API é jogador ativo e não acessa a fila de staff', async ({ jogador }) => {
    const api = await apiAs(jogador)
    try {
      const session = await api.get('/auth/session')
      expect(((await session.json()) as { user: unknown }).user).toMatchObject({
        role: 'jogador',
        approvalState: 'ativo',
        subRoles: [],
      })
      expect((await api.get('/staff/pending')).status()).toBe(403)
    } finally {
      await api.dispose()
    }
  })

  test.fixme(
    'não vê a justificativa de outro jogador nem o consolidado de presença',
    async () => {
      // BLOQUEADO: eventos e justificativas ainda não estão em docs/api. Desbloquear
      // com a fatia de presença (story 53–54): jogador vê só "ausente", nunca o texto.
    },
  )
})

test.describe('Staff pendente', () => {
  test('vê só o aviso de pendência na Home', async ({ page, staffPendente }) => {
    await openAs(page, staffPendente)
    await expect(page.getByRole('heading', { name: 'Seu cadastro como Staff está pendente' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toHaveCount(0)
  })

  test('Playbook, Elenco, Evento e Jogo ficam bloqueados', async ({ page, staffPendente }) => {
    await openAs(page, staffPendente)

    for (const path of ['/playbook', '/elenco', '/evento', '/jogo']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { name: 'Acesso bloqueado' }), `bloqueio em ${path}`).toBeVisible()
    }
  })

  test('não vê ação de edição nem lista de elenco', async ({ page, staffPendente }) => {
    await openAs(page, staffPendente, '/playbook')
    await expect(page.getByRole('heading', { name: 'Acesso bloqueado' })).toBeVisible()
    await expect(page.getByRole('button', { name: '+ Criar jogada' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Elenco', exact: true })).toHaveCount(0)
  })

  test('sessão da API é pendente e não lê a fila de aprovação', async ({ staffPendente }) => {
    const api = await apiAs(staffPendente)
    try {
      const session = await api.get('/auth/session')
      expect(((await session.json()) as { user: unknown }).user).toMatchObject({
        role: 'staff',
        approvalState: 'pendente',
      })
      expect((await api.get('/staff/pending')).status()).toBe(403)
    } finally {
      await api.dispose()
    }
  })
})

test.describe('Head coach', () => {
  test('lê a fila de cadastros pendentes', async ({ headCoach, staffPendente }) => {
    const api = await apiAs(headCoach)
    try {
      const response = await api.get('/staff/pending')
      expect(response.status()).toBe(200)
      const { staff } = (await response.json()) as {
        staff: Array<{ email: string; requestedSubrole: string }>
      }
      expect(staff).toContainEqual(
        expect.objectContaining({
          email: staffPendente.email,
          requestedSubrole: 'coordenador_special_teams',
        }),
      )
    } finally {
      await api.dispose()
    }
  })

  test('vê o elenco no app', async ({ page, headCoach }) => {
    await openAs(page, headCoach, '/elenco')
    await expect(navLink(page, 'Elenco')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Elenco', exact: true })).toBeVisible()
  })
})

test.describe('Fila de staff sem sessão ou com papel errado', () => {
  test('sem sessão responde 401', async () => {
    const api = await apiAs()
    try {
      expect((await api.get('/staff/pending')).status()).toBe(401)
    } finally {
      await api.dispose()
    }
  })

  test('jogador ativo responde 403', async ({ jogador }) => {
    const api = await apiAs(jogador)
    try {
      expect((await api.get('/staff/pending')).status()).toBe(403)
    } finally {
      await api.dispose()
    }
  })
})

test.describe('Coordenadores por unidade', () => {
  test.fixme(
    'coordenador ofensivo edita só a ofensiva e vê, sem editar, as outras unidades liberadas',
    async () => {
      // BLOQUEADO: depende de aprovação de staff (aprovar/recusar, atribuir
      // subpapel) e das rotas de jogadas, ainda fora de docs/api. Hoje não há
      // como criar um coordenador ativo pelo contrato; o head coach semeado é o
      // único staff ativo. Desbloquear com a fatia de administração de staff.
    },
  )
})
