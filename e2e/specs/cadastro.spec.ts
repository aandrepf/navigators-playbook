import { expect, test } from '../support/fixtures'
import { uniqueEmail } from '../support/accounts'
import { waitForLoginCode } from '../support/mail'
import { AuthPage } from '../support/pages/auth-page'

type SessionUser = { role: string; approvalState: string; subRoles: string[] }

/** GET /auth/session pelo mesmo cookie do browser (contrato em docs/api). */
async function sessionUser(page: import('@playwright/test').Page): Promise<SessionUser> {
  const response = await page.request.get('/auth/session')
  expect(response.status()).toBe(200)
  return ((await response.json()) as { user: SessionUser }).user
}

test.describe('Cadastro de jogador', () => {
  test('exige ao menos uma posição antes de criar a conta', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email: uniqueEmail('cadastro.posicao') })
    await auth.enterCode('123456')
    await auth.choosePapel('JOGADOR')

    await expect(page.getByRole('heading', { name: 'Unidades e Posições' })).toBeVisible()
    await page.getByRole('button', { name: 'Ofensiva', exact: true }).click()
    await expect(auth.createAccountButton()).toBeDisabled()
    await expect(page.getByText('Selecione pelo menos uma posição.')).toBeVisible()

    await page.getByRole('group', { name: 'Posições' }).getByRole('button', { name: 'QB', exact: true }).click()
    await expect(auth.createAccountButton()).toBeEnabled()
  })

  test('cria conta de jogador ativo com papel jogador', async ({ page }) => {
    const email = uniqueEmail('cadastro.jogador')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, name: 'Rafael Costa' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('JOGADOR')
    await auth.submitPlayer({ units: ['Ofensiva', 'Defesa'], positions: ['QB', 'LB'] })

    await expect(page).toHaveURL('/')
    expect(await sessionUser(page)).toMatchObject({
      role: 'jogador',
      approvalState: 'ativo',
      subRoles: [],
    })
  })

  test.fixme(
    'posições escolhidas no cadastro são gravadas no perfil',
    async () => {
      // BLOQUEADO (contrato): POST /auth/email/verify em docs/api não recebe
      // unidades nem posições. A AuthScreen coleta, mas não envia nem persiste.
      // Desbloquear quando o contrato de cadastro ganhar `positions`/`units` e
      // GET /auth/session ou o perfil devolver essas posições.
    },
  )
})

test.describe('Cadastro de staff', () => {
  // Este cadastro ocupa uma vaga exclusiva (ofensivo ou defensivo) do banco da
  // execução. Uma nova tentativa encontraria a vaga tomada, então não é
  // repetível: sem retry. A CI já roda cada teste uma vez, com banco zerado.
  test.describe.configure({ retries: 0 })

  test('cadastro de staff exige subpapel e fica pendente sem acesso de edição', async ({ page }, testInfo) => {
    // Ofensivo e defensivo são exclusivos por time. Cada projeto usa a sua vaga
    // porque o banco é compartilhado pela execução inteira.
    const subRole = testInfo.project.name.startsWith('mobile')
      ? { label: 'Coordenador Ofensivo' as const, value: 'coordenador_ofensivo' }
      : { label: 'Coordenador Defensivo' as const, value: 'coordenador_defensivo' }

    const email = uniqueEmail('cadastro.staff')
    const auth = new AuthPage(page)
    await auth.goto()
    await auth.startEmailLogin()
    await auth.requestCode({ email, name: 'Marcos Viana' })
    await auth.enterCode(await waitForLoginCode(email))
    await auth.choosePapel('STAFF')

    await expect(page.getByRole('heading', { name: 'Subpapel do Staff' })).toBeVisible()
    await expect(auth.createAccountButton()).toBeDisabled()

    await auth.submitStaff(subRole.label)
    await expect(auth.pendingHeading()).toBeVisible()

    expect(await sessionUser(page)).toMatchObject({
      role: 'staff',
      approvalState: 'pendente',
      subRoles: [subRole.value],
    })
    expect((await page.request.get('/staff/pending')).status()).toBe(403)

    await page.goto('/playbook')
    await expect(page.getByRole('heading', { name: 'Acesso bloqueado' })).toBeVisible()
  })

  test.fixme(
    'staff acumula o subpapel de coordenador de special teams no cadastro',
    async () => {
      // BUG (produto) + BLOQUEADO (contrato): a AuthScreen coleta o checkbox
      // "Acumulo também o subpapel de Coordenador de special teams", mas envia só
      // `subRoles[0]` como `staffRole`, então o acúmulo é descartado. O contrato
      // (`staffRole`, um único enum) também não expressa acúmulo. Reprodução:
      // cadastrar staff com ofensivo + checkbox ST; GET /auth/session devolve só
      // ['coordenador_ofensivo'].
    },
  )
})
