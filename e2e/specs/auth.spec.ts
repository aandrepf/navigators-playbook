import { expect, openAs, test } from '../support/fixtures'
import { waitForLoginCode } from '../support/mail'
import { uniqueEmail } from '../support/accounts'
import { AuthPage } from '../support/pages/auth-page'
import { primaryNav } from '../support/shell'

test.describe('Login por e-mail', () => {
  test('entra com código de uso único e chega à Home', async ({ page }) => {
    const email = uniqueEmail('login.email')
    const auth = new AuthPage(page)

    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, name: 'Rafael Costa' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ units: ['Ofensiva'], positions: ['QB'] })

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()
    await expect(primaryNav(page)).toBeVisible()
  })

  test('código incorreto não autentica e pede novo código', async ({ page }) => {
    const email = uniqueEmail('login.codigo.errado')
    const auth = new AuthPage(page)

    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email })
    const real = await waitForLoginCode(email)
    const wrong = real === '000000' ? '111111' : '000000'

    await auth.enterCode(wrong)
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ units: ['Ofensiva'], positions: ['QB'] })

    await expect(auth.alert()).toContainText('Código inválido ou expirado')
    await expect(page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()

    const session = await page.request.get('/auth/session')
    expect(session.status()).toBe(401)
  })

  test('sem sessão, a área do app redireciona para o login', async ({ page }) => {
    await page.goto('/elenco')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('button', { name: 'Entrar com código por e-mail' })).toBeVisible()
  })
})

test.describe('Login com Google', () => {
  test('botão Google inicia o login OAuth pelo backend', async ({ page }) => {
    // O consentimento real depende de credenciais do Google, que a suíte não tem.
    // Verificamos o contrato do frontend: o botão faz GET /auth/google, e a
    // navegação sai da tela de entrada. A resposta é interceptada.
    await page.route('**/auth/google', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<h1>Redirecionamento para o Google (simulado)</h1>',
      }),
    )

    const auth = new AuthPage(page)
    await auth.goto()
    const oauthRequest = page.waitForRequest(
      (req) => req.method() === 'GET' && new URL(req.url()).pathname === '/auth/google',
    )
    await auth.googleButton().click()

    expect((await oauthRequest).method()).toBe('GET')
    await expect(page).toHaveURL(/\/auth\/google$/)
  })

  test.fixme(
    'retorno do Google com erro mostra o motivo na tela de entrada',
    async () => {
      // BUG (produto): GET /auth/google/callback redireciona para
      // `FRONTEND_URL?login=erro&motivo=...` (ver apps/api/src/auth/routes.ts),
      // mas a AuthScreen não lê esse parâmetro e não mostra erro algum.
      // Reprodução: abrir /login?login=erro&motivo=estado; nada é exibido.
      // Desbloquear quando a tela ler o parâmetro e exibir a mensagem.
    },
  )
})

test.describe('Sessão', () => {
  test('continua logado depois de recarregar a página', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()

    await page.reload()

    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()
    await expect(page).toHaveURL('/')
  })

  test('sair da conta encerra a sessão no servidor e fecha o app', async ({ page, jogador }) => {
    await openAs(page, jogador, '/perfil')
    await page.getByRole('button', { name: 'Sair da conta' }).click()

    await expect(page).toHaveURL(/\/login$/)
    const session = await page.request.get('/auth/session')
    expect(session.status()).toBe(401)

    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
  })
})
