import { expect, openAs, test } from '../support/fixtures'
import { uniqueEmail } from '../support/accounts'
import { waitForLoginCode } from '../support/mail'
import { tabUntilFocused } from '../support/keyboard'
import { AuthPage } from '../support/pages/auth-page'
import { navLink } from '../support/shell'
import { TEAM_CODE } from '../support/constants.mjs'

test.describe('Operação por teclado', () => {
  test('login e cadastro de jogador completos só com teclado', async ({ page }) => {
    const email = uniqueEmail('a11y.teclado')
    await page.goto('/login')

    await tabUntilFocused(page, page.getByRole('button', { name: 'Entrar com código por e-mail' }))
    await page.keyboard.press('Enter')

    // Após abrir o formulário, o foco parte do topo: Tab até o primeiro campo.
    const teamCode = page.getByLabel(/código do time/i)
    await tabUntilFocused(page, teamCode)
    await page.keyboard.type(TEAM_CODE)
    await page.keyboard.press('Tab')
    await page.keyboard.type('Rafael Costa')
    await page.keyboard.press('Tab')
    await page.keyboard.type(email)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Verifique seu e-mail' })).toBeVisible()

    await tabUntilFocused(page, page.getByLabel(/código de verificação/i))
    await page.keyboard.type(await waitForLoginCode(email))
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Como você participa do time?' })).toBeVisible()

    await tabUntilFocused(page, page.getByRole('button', { name: /^JOGADOR\b/ }))
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Suas posições' })).toBeVisible()

    await tabUntilFocused(page, page.getByRole('button', { name: 'Ofensiva', exact: true }))
    await page.keyboard.press('Space')
    await tabUntilFocused(page, page.getByRole('button', { name: 'QB', exact: true }))
    await page.keyboard.press('Space')
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
    await expect(page.getByRole('heading', { level: 1, name: 'Playbook do Time' })).toBeVisible()
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

  test('tela de entrada tem título h1 e campos com rótulo', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await expect(auth.heading).toHaveText('Playbook do Time')

    await auth.startEmailLogin()
    await expect(page.getByLabel(/código do time/i)).toBeVisible()
    await expect(page.getByLabel(/nome completo/i)).toBeVisible()
    await expect(page.getByLabel(/^e-mail/i)).toBeVisible()
  })
})
