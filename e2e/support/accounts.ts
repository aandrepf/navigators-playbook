import { readFile } from 'node:fs/promises'
import {
  request as playwrightRequest,
  type APIRequestContext,
  type Cookie,
} from '@playwright/test'
import { API_URL, RUN_ID, SHARED_ACCOUNTS_PATH, TEAM_CODE } from './constants.mjs'
import { waitForLoginCode } from './mail'

/** Forma pública do usuário, conforme `docs/api/openapi.yaml` (schema `User`). */
export type PublicUser = {
  id: string
  email: string
  name: string | null
  role: 'jogador' | 'staff'
  approvalState: 'ativo' | 'pendente' | 'recusado'
  subRoles: string[]
}

export type StaffRole =
  | 'coordenador_ofensivo'
  | 'coordenador_defensivo'
  | 'coordenador_special_teams'

export type Account = {
  email: string
  user: PublicUser
  /** Cookies de sessão (`playbook_session`) para injetar no browser ou em `request`. */
  cookies: Cookie[]
}

let counter = 0

/** E-mail único por teste e execução: nenhum teste depende de dados de outro. */
export function uniqueEmail(prefix: string): string {
  counter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}.${RUN_ID}.${counter}.${rand}@e2e.playbook.test`
}

/**
 * Autentica por código de e-mail direto na API (sem UI). Usado para semear
 * estado: é mais rápido e determinístico do que preencher o cadastro na tela.
 *
 * Para um e-mail já existente a API devolve o usuário atual e ignora `role`.
 */
export async function signIn(input: {
  email: string
  role: 'jogador' | 'staff'
  name?: string
  staffRole?: StaffRole
}): Promise<Account> {
  const api = await newApiContext([])
  try {
    const requested = await api.post('/auth/email/request', { data: { email: input.email } })
    if (requested.status() !== 202) {
      throw new Error(`POST /auth/email/request respondeu ${requested.status()} para ${input.email}`)
    }
    const code = await waitForLoginCode(input.email)

    const verified = await api.post('/auth/email/verify', {
      data: {
        email: input.email,
        code,
        teamCode: TEAM_CODE,
        name: input.name ?? 'Conta E2E',
        role: input.role,
        ...(input.staffRole ? { staffRole: input.staffRole } : {}),
      },
    })
    if (!verified.ok()) {
      throw new Error(`POST /auth/email/verify respondeu ${verified.status()} para ${input.email}`)
    }
    const { user } = (await verified.json()) as { user: PublicUser }
    const state = await api.storageState()
    return { email: input.email, user, cookies: state.cookies }
  } finally {
    await api.dispose()
  }
}

/** Cria uma conta nova com e-mail único. */
export function createAccount(input: {
  role: 'jogador' | 'staff'
  name?: string
  staffRole?: StaffRole
}): Promise<Account> {
  const prefix = input.role === 'staff' ? 'staff' : 'jogador'
  return signIn({ ...input, email: uniqueEmail(prefix) })
}

/** Contas compartilhadas geradas no global setup (somente leitura nos testes). */
export async function readSharedAccounts(): Promise<{ headCoach: Account; staffPendente: Account }> {
  return JSON.parse(await readFile(SHARED_ACCOUNTS_PATH, 'utf8')) as {
    headCoach: Account
    staffPendente: Account
  }
}

/**
 * Contexto de API para chamar `docs/api` diretamente. Com `account`, a sessão
 * da conta já vem nos cookies. Responsabilidade do chamador fazer `dispose()`.
 */
export function apiAs(account?: Account): Promise<APIRequestContext> {
  return newApiContext(account?.cookies ?? [])
}

function newApiContext(cookies: Account['cookies']): Promise<APIRequestContext> {
  return playwrightRequest.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: { Accept: 'application/json' },
    storageState: { cookies, origins: [] },
  })
}
