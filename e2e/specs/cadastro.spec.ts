import { expect, test } from '../support/fixtures'
import { uniqueEmail, verifyRaw } from '../support/accounts'
import { waitForLoginCode } from '../support/mail'
import { AuthPage } from '../support/pages/auth-page'

type SessionUser = {
  role: string
  approvalState: string
  subRoles: string[]
  positions: Array<{ unit: string; position: string; approvalState: string }>
  units: string[]
}

async function sessionUser(page: import('@playwright/test').Page): Promise<SessionUser> {
  const response = await page.request.get('/auth/session')
  expect(response.status()).toBe(200)
  return ((await response.json()) as { user: SessionUser }).user
}

test.describe('Cadastro: código do time', () => {
  test('código de time inválido é recusado com mensagem acessível', async ({ page }) => {
    const email = uniqueEmail('cadastro.time.errado')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, teamCode: 'CODIGO-ERRADO' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ positions: ['QB'] })

    await expect(auth.alert()).toContainText(/código do time inválido/i)
    await expect(page.getByRole('heading', { name: 'Criar conta ou entrar' })).toBeVisible()
    expect((await page.request.get('/auth/session')).status()).toBe(401)
  })
})

test.describe('Cadastro de jogador', () => {
  test('permite criar sem posição ou escolher uma posição', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('cadastro.posicao') })
    await auth.enterCode('123456')
    await auth.choosePapel('JOGADOR')

    await expect(page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()
    await expect(auth.createAccountButton()).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Pular posições por agora' })).toBeVisible()

    await page.getByRole('button', { name: 'QB', exact: true }).click()
    await expect(auth.createAccountButton()).toBeEnabled()
  })

  test('cria jogador ativo com posições pendentes, sem unidade aprovada', async ({ page }) => {
    const email = uniqueEmail('cadastro.jogador')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, name: 'Rafael Costa' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ positions: ['QB', 'LB'] })

    await expect(page).toHaveURL('/')
    expect(await sessionUser(page)).toMatchObject({
      role: 'jogador',
      approvalState: 'ativo',
      subRoles: [],
      positions: [
        { unit: 'ofensiva', position: 'QB', approvalState: 'pendente' },
        { unit: 'defesa', position: 'LB', approvalState: 'pendente' },
      ],
      units: [],
    })
  })

  test('pular posições cria jogador ativo sem nenhuma posição', async ({ page }) => {
    const email = uniqueEmail('cadastro.pular')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await expect(page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()
    await page.getByRole('button', { name: 'Pular posições por agora' }).click()

    await expect(page).toHaveURL('/')
    expect(await sessionUser(page)).toMatchObject({
      role: 'jogador',
      approvalState: 'ativo',
      positions: [],
      units: [],
    })
  })

  test('jogador sem posição aprovada vê aviso de pendência no cadastro', async ({ page }) => {
    const email = uniqueEmail('cadastro.aviso')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')

    await expect(
      page.getByText(/o staff validará suas posições antes de liberar o playbook/i),
    ).toBeVisible()
  })

  test.fixme('Perfil mostra posições pendentes e permite solicitar alteração', async () => {
    // BLOQUEADO: Perfil e solicitação de alteração são o card 04 (story 10–11).
    // Este card só persiste o estado pendente no cadastro.
  })
})

test.describe('Cadastro de staff', () => {
  test('staff nasce pendente, sem subpapel, e a sessão não concede edição', async ({ page }) => {
    const email = uniqueEmail('cadastro.staff')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, name: 'Marcos Viana' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('STAFF')
    await auth.submitStaff()

    expect(await sessionUser(page)).toMatchObject({
      role: 'staff',
      approvalState: 'pendente',
      subRoles: [],
      positions: [],
    })
    expect((await page.request.get('/staff/pending')).status()).toBe(403)

    await page.goto('/playbook')
    await expect(page.getByRole('heading', { name: 'Acesso bloqueado' })).toBeVisible()
  })

  test('staff pendente vê o próprio estado na tela de cadastro', async ({ page }) => {
    const email = uniqueEmail('cadastro.staff.tela')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('STAFF')

    await expect(auth.pendingHeading()).toBeVisible()
    await expect(page.getByText(/aguardando definição de um admin ou head coach/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ir para a tela inicial' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /coordenador|subpapel/i })).toHaveCount(0)
  })
})

/**
 * Fronteiras do contrato de cadastro (docs/api, POST /auth/email/verify). São
 * checadas pela API direta: a tela não envia esses campos.
 */
test.describe('Contrato de cadastro', () => {
  test('staff com positions é recusado com 400', async () => {
    const { status, body } = await verifyRaw(uniqueEmail('contrato.staff.posicao'), {
      role: 'staff',
      positions: ['QB'],
    })
    expect(status).toBe(400)
    expect(JSON.stringify(body)).toMatch(/staff não pode enviar posições/)
  })

  test('posição de special teams não é aceita no cadastro de jogador', async () => {
    const { status } = await verifyRaw(uniqueEmail('contrato.st'), {
      role: 'jogador',
      positions: ['K'],
    })
    expect(status).toBe(400)
  })

  test('posição desconhecida é recusada com 400', async () => {
    const { status } = await verifyRaw(uniqueEmail('contrato.desconhecida'), {
      role: 'jogador',
      positions: ['XYZ'],
    })
    expect(status).toBe(400)
  })

  test('posição repetida é recusada com 400', async () => {
    const { status } = await verifyRaw(uniqueEmail('contrato.repetida'), {
      role: 'jogador',
      positions: ['QB', 'QB'],
    })
    expect(status).toBe(400)
  })

  test('staffRole no cadastro é descartado: staff continua sem subpapel', async () => {
    const { status, body } = await verifyRaw(uniqueEmail('contrato.staffrole'), {
      role: 'staff',
      staffRole: 'coordenador_ofensivo',
    })
    // Pode ser recusado (400) ou ignorado (200 sem subpapel). O que não pode
    // acontecer é o cadastro entrar com subpapel atribuído.
    if (status === 200) {
      expect(body).toMatchObject({ user: { approvalState: 'pendente', subRoles: [] } })
    } else {
      expect(status).toBe(400)
    }
  })
})
