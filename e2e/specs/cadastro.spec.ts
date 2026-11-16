import { expect, test } from '../support/fixtures'
import { uniqueEmail } from '../support/accounts'
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

  test('cria conta de jogador ativo com posições pendentes', async ({ page }) => {
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
})

test.describe('Cadastro de staff', () => {
  test('cadastro de staff fica pendente sem subpapel', async ({ page }) => {
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
    })
    expect((await page.request.get('/staff/pending')).status()).toBe(403)

    await page.goto('/playbook')
    await expect(page.getByRole('heading', { name: 'Acesso bloqueado' })).toBeVisible()
  })
})
