import { expect, openAs, test } from '../support/fixtures'
import { uniqueEmail } from '../support/accounts'
import { waitForLoginCode } from '../support/mail'
import { AuthPage } from '../support/pages/auth-page'

/**
 * Regressão da revisão UX 02.1 do cadastro (docs/design/REVIEW-02.1-CADASTRO-UI.md).
 * Cada teste cobre um achado S0/S1/S2 e roda nos projetos mobile e desktop.
 */

const POSITIONS_OFENSIVA = ['QB', 'RB', 'FB', 'WR', 'TE', 'OL']
const POSITIONS_DEFESA = ['DL', 'LB', 'CB', 'S']

async function goToPositions(page: import('@playwright/test').Page, email: string) {
  const auth = new AuthPage(page)
  await auth.goto()
  await auth.startEmailLogin()
  await auth.requestCode({ email })
  await auth.enterCode('123456')
  await auth.choosePapel('JOGADOR')
  await expect(page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()
  return auth
}

test.describe('Revisão 02.1: posições (S0-01, S0-02)', () => {
  test('todos os 10 botões de posição têm alvo de toque de no mínimo 44×44px', async ({ page }) => {
    await goToPositions(page, uniqueEmail('rev021.alvo'))

    for (const position of [...POSITIONS_OFENSIVA, ...POSITIONS_DEFESA]) {
      const box = await page.getByRole('button', { name: position, exact: true }).boundingBox()
      expect(box, `posição ${position} sem caixa visível`).not.toBeNull()
      expect(box!.height, `altura de ${position}`).toBeGreaterThanOrEqual(44)
      expect(box!.width, `largura de ${position}`).toBeGreaterThanOrEqual(44)
    }
  })

  test('posição marcada tem indicador além da cor e fundo distinto da não marcada', async ({ page }) => {
    await goToPositions(page, uniqueEmail('rev021.marcada'))

    const rb = page.getByRole('button', { name: 'RB', exact: true })
    const qb = page.getByRole('button', { name: 'QB', exact: true })
    const bgNaoMarcada = await rb.evaluate((el) => getComputedStyle(el).backgroundColor)

    await qb.click()
    const marcada = page.getByRole('button', { name: /^✓ QB$/ })
    await expect(marcada).toHaveAttribute('aria-pressed', 'true')
    // A transição de cor leva ~150ms: espera o estado final, não o intermediário.
    await expect
      .poll(() => marcada.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(bgNaoMarcada)
    const bgMarcada = await marcada.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bgMarcada).not.toBe('rgba(0, 0, 0, 0)')
    await expect(page.getByRole('button', { name: 'RB', exact: true })).toHaveAttribute('aria-pressed', 'false')
  })

  test('desmarcar uma posição devolve o nome e o estado não marcado', async ({ page }) => {
    await goToPositions(page, uniqueEmail('rev021.desmarcar'))

    await page.getByRole('button', { name: 'QB', exact: true }).click()
    const marcada = page.getByRole('button', { name: /^✓ QB$/ })
    await expect(marcada).toHaveAttribute('aria-pressed', 'true')
    await marcada.click()
    await expect(page.getByRole('button', { name: 'QB', exact: true })).toHaveAttribute('aria-pressed', 'false')
  })
})

test.describe('Revisão 02.1: papel, erros e voltar (S1-02)', () => {
  test('etapa de papel tem Voltar que retorna à etapa do código', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.voltar') })
    await auth.enterCode('123456')

    await expect(page.getByRole('heading', { name: 'Como você participa do time?' })).toBeVisible()
    await auth.backButton().click()
    await expect(page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()
  })

  test('falha ao confirmar Staff aparece como erro na própria etapa de papel', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.erro') })
    await auth.enterCode('123456')

    // Falha de servidor simulada na rede: o erro precisa aparecer sem sair da etapa.
    await page.route('**/auth/email/verify', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"internal"}' }),
    )
    await page.getByRole('button', { name: /^STAFF\b/i }).click()

    await expect(auth.alert()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Como você participa do time?' })).toBeVisible()
  })
})

test.describe('Revisão 02.1: código do time e Google (S0-03, S1-04)', () => {
  test('código de verificação usa numerais tabulares', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.tabular') })

    const codigo = page.getByLabel(/código de verificação/i)
    await expect(codigo).toHaveCSS('font-variant-numeric', /tabular-nums/)
  })

  test('botão Google: texto visível e nome acessível coincidem', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await expect(page.getByRole('button', { name: 'Entrar com o Google', exact: true })).toBeVisible()
    await expect(auth.googleButton()).toHaveCount(1)
  })
})

test.describe('Revisão 02.1: time atual e vocabulário (S0-03)', () => {
  test('a tela não tem campo de código do time e envia NAVS-2026 automaticamente', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()

    await expect(page.getByLabel('Time atual: Navigators')).toBeVisible()
    await expect(page.getByLabel(/código do time/i)).toHaveCount(0)

    await auth.requestCode({ email: uniqueEmail('rev021.codigo') })
    await auth.enterCode('123456')
    await auth.choosePapel('JOGADOR')

    // Captura o corpo do cadastro sem depender da API: o time vai fixo como NAVS-2026.
    const verify = page.waitForRequest((req) => req.url().endsWith('/auth/email/verify') && req.method() === 'POST')
    await page.getByRole('button', { name: 'QB', exact: true }).click()
    await auth.createAccountButton().click()
    expect((await verify).postDataJSON()).toMatchObject({ teamCode: 'NAVS-2026' })
    await expect(page).toHaveURL('/')
  })

  test('erro de time vindo da API volta à etapa de dados com alerta acessível', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.codigo.api') })
    await auth.enterCode('123456')
    await auth.choosePapel('JOGADOR')

    // Simula a resposta 400 da API para um time indisponível; a tela não permite digitar outro código.
    await page.route('**/auth/email/verify', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'código do time inválido' }),
      }),
    )
    await page.getByRole('button', { name: 'QB', exact: true }).click()
    await auth.createAccountButton().click()

    await expect(page.getByRole('heading', { name: 'Criar conta ou entrar' })).toBeVisible()
    await expect(auth.alert()).toContainText(/código do time inválido/i)
    await expect(page.getByLabel(/código do time/i)).toHaveCount(0)
  })
})

test.describe('Revisão 02.1: código de 6 dígitos incorreto no cadastro', () => {
  test('código incorreto volta à etapa do código com o erro, sem avançar', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.otp') })
    await auth.enterCode('000000')
    await auth.choosePapel('JOGADOR')
    await page.getByRole('button', { name: 'QB', exact: true }).click()
    await auth.createAccountButton().click()

    await expect(page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()
    await expect(auth.alert()).toContainText(/código inválido/i)
  })
})

test.describe('Revisão 02.1: reenvio de código (S2-04)', () => {
  test('clicar em Reenviar código solicita um novo código para o mesmo e-mail', async ({ page }) => {
    const auth = new AuthPage(page)
    const email = uniqueEmail('rev021.reenviar')
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email })

    await auth.resendCodeButton().click()

    // Spinners dos botões também têm role="status"; filtra pela mensagem de sucesso.
    await expect(page.getByRole('status').filter({ hasText: /novo código enviado/i })).toBeVisible()

    // O novo código deve funcionar para concluir o cadastro.
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ positions: ['WR'] })
    await expect(page).toHaveURL('/')
  })

  test('botão Voltar na etapa do código retorna à etapa de dados', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('rev021.voltar.email') })

    await auth.backButton().click()
    await expect(page.getByRole('heading', { name: 'Criar conta ou entrar' })).toBeVisible()
    await expect(page.getByLabel(/^e-mail/i)).toHaveValue(/rev021\.voltar\.email/i)
  })
})

test.describe('Revisão 02.1: staff pendente (S1-01)', () => {
  test('Home do staff pendente não mostra subpapel vazio e oferece Sair da conta', async ({ page, staffPendente }) => {
    await openAs(page, staffPendente, '/')

    await expect(page.getByText(/Você solicitou acesso no papel de Staff/)).toBeVisible()
    await expect(page.getByText(/Staff \(\)/)).toHaveCount(0)
    await expect(page.getByText(/Admin ou Head Coach/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sair da conta' })).toBeVisible()
  })
})

test.describe('Revisão 02.1: landmarks das telas de entrada (S2-03)', () => {
  test('tela de entrada expõe landmark main e skip link', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('main')).toHaveAttribute('id', 'conteudo-principal')
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo principal' })).toBeVisible()
  })
})
