import { test as base, expect, type Page } from '@playwright/test'
import { createAccount, readSharedAccounts, type Account } from './accounts'

type Fixtures = {
  /** Jogador ativo criado via API para este teste (e-mail único). */
  jogador: Account
  /**
   * Staff pendente compartilhado pela execução. Somente leitura: o cadastro
   * pendente não tem aprovação ainda, e não tem subpapel.
   */
  staffPendente: Account
  /** Head coach ativo semeado pela API, autenticado no global setup. */
  headCoach: Account
}

// O Playwright exige um padrão de desestruturação no primeiro argumento do
// fixture, mesmo vazio. O aviso do lint sobre padrão vazio não se aplica aqui.
export const test = base.extend<Fixtures>({
  // oxlint-disable-next-line no-empty-pattern
  jogador: async ({}, provide) => {
    await provide(await createAccount({ role: 'jogador', name: 'Rafael Costa' }))
  },
  // oxlint-disable-next-line no-empty-pattern
  staffPendente: async ({}, provide) => {
    await provide((await readSharedAccounts()).staffPendente)
  },
  // oxlint-disable-next-line no-empty-pattern
  headCoach: async ({}, provide) => {
    await provide((await readSharedAccounts()).headCoach)
  },
})

export { expect }

/** Abre o browser já autenticado com a sessão da conta (cookie httpOnly). */
export async function openAs(page: Page, account: Account, path = '/'): Promise<void> {
  await page.context().addCookies(account.cookies)
  await page.goto(path)
}
