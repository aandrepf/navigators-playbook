import { expect, openAs, test } from '../support/fixtures'
import { uniqueEmail } from '../support/accounts'
import { waitForLoginCode } from '../support/mail'
import { tabUntilFocused } from '../support/keyboard'
import { AuthPage } from '../support/pages/auth-page'
import { navLink } from '../support/shell'

test.describe('Operação por teclado', () => {
  test('login e cadastro de jogador completos só com teclado', async ({ page }) => {
    const email = uniqueEmail('a11y.teclado')
    await page.goto('/login')

    await tabUntilFocused(page, page.getByRole('button', { name: 'Entrar com código por e-mail' }))
    await page.keyboard.press('Enter')

    // Após abrir o formulário, o foco parte do topo. O time é só exibição (não
    // focável), então o primeiro campo alcançável é o nome.
    await tabUntilFocused(page, page.getByLabel(/nome completo/i))
    await page.keyboard.type('Rafael Costa')
    // Telefone (opcional) fica entre nome e e-mail: o foco vai até o e-mail pela ordem natural.
    await tabUntilFocused(page, page.getByLabel(/^e-mail/i))
    await page.keyboard.type(email)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()

    await tabUntilFocused(page, page.getByLabel(/código de verificação/i))
    await page.keyboard.type(await waitForLoginCode(email))
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Como você participa do time?' })).toBeVisible()

    await tabUntilFocused(page, page.getByRole('button', { name: /^JOGADOR\b/i }))
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()

    // Unidade não é escolhida: ela é derivada das posições. Basta marcar uma posição.
    await tabUntilFocused(page, page.getByRole('button', { name: 'QB', exact: true }))
    await page.keyboard.press('Space')
    // Posição marcada ganha prefixo "✓ " (indicador não-cromático): o nome muda.
    await expect(page.getByRole('button', { name: /^(✓ )?QB$/ })).toHaveAttribute('aria-pressed', 'true')
    await tabUntilFocused(page, new AuthPage(page).createAccountButton())
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()
  })

  test('link de pular para o conteúdo leva o foco ao <main>', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()

    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo principal' })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(page.getByRole('main')).toBeFocused()
  })

  test('navega pelo menu principal só com teclado', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()

    await tabUntilFocused(page, navLink(page, 'Perfil'))
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/\/perfil$/)
    await expect(page.getByRole('button', { name: 'Sair da conta' })).toBeVisible()
  })
})

test.describe('Landmarks e títulos', () => {
  test('tela logada expõe banner, navegação principal e main', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(page.getByRole('heading', { name: 'Próximos Eventos' })).toBeVisible()

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('navigation', { name: /Navegação principal/ })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'SnapIn' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Playbook' })).toBeVisible()
  })

  test('tela de entrada expõe main, skip link e título h1', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pular para o conteúdo principal' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'SnapIn' })).toBeVisible()
  })

  test('item ativo da navegação expõe aria-current', async ({ page, jogador }) => {
    await openAs(page, jogador)
    await expect(navLink(page, 'Home')).toHaveAttribute('aria-current', 'page')
    await expect(navLink(page, 'Playbook')).not.toHaveAttribute('aria-current', 'page')
  })

  for (const path of ['/', '/evento', '/playbook', '/jogo', '/perfil']) {
    test(`tela ${path} expõe título de seção (h2) para o jogador`, async ({ page, jogador }) => {
      await openAs(page, jogador, path)
      await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
    })
  }

  test('grupos de posição são rotulados e expõem o estado marcado', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('a11y.posicoes') })
    await auth.enterCode('123456')
    await auth.choosePapel('JOGADOR')

    const ofensiva = page.getByRole('group', { name: 'Posições de ofensiva' })
    await expect(ofensiva).toBeVisible()
    const qb = ofensiva.getByRole('button', { name: 'QB', exact: true })
    await expect(qb).toHaveAttribute('aria-pressed', 'false')
    await qb.click()
    await expect(ofensiva.getByRole('button', { name: /^(✓ )?QB$/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('group', { name: 'Posições de defesa' })).toBeVisible()
  })


  // Regressão do card 02 (corrigida no web, commit 96c85ec): a tela de entrada
  // precisa de um h1 como título da página, não de um h3 (CardTitle).
  test('tela de entrada tem título h1 e campos com rótulo', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await expect(auth.heading).toHaveText('SnapIn')

    await auth.startEmailLogin()
    await expect(page.getByLabel(/nome completo/i)).toBeVisible()
    await expect(page.getByLabel(/^e-mail/i)).toBeVisible()
  })
})
