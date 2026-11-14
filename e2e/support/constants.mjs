// Constantes compartilhadas entre o config do Playwright, os scripts de
// infraestrutura (API e web) e os helpers dos testes. Arquivo em JS puro para
// poder ser importado tanto pelo `playwright.config.ts` quanto pelos scripts `.mjs`.

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Identificador desta execução. Gerado uma vez no processo principal e herdado
 * por API, web e workers. Os e-mails de teste o carregam, para que nenhuma
 * execução leia um código de outra.
 */
export const RUN_ID =
  process.env.E2E_RUN_ID ?? (process.env.E2E_RUN_ID = Date.now().toString(36))

export const WEB_PORT = 5173
export const API_PORT = 3000
export const WEB_URL = `http://127.0.0.1:${WEB_PORT}`
export const API_URL = `http://127.0.0.1:${API_PORT}`

/** Código do time usado no cadastro (`TEAM_CODE` da API). */
export const TEAM_CODE = 'NAVIGATORS'

/**
 * Head coach semeado no início da API (`SEED_HEAD_COACH_EMAIL`). Fixo de propósito:
 * o banco permite um único head coach por time (`staff_role_exclusive_per_team`),
 * então um e-mail por execução quebraria o seed num banco reaproveitado.
 */
export const HEAD_COACH_EMAIL = 'head.coach@e2e.playbook.test'

const here = fileURLToPath(new URL('.', import.meta.url))
export const E2E_DIR = join(here, '..')
export const RUNTIME_DIR = join(E2E_DIR, '.runtime')
/** Log da API. Os códigos de acesso saem aqui (mailer `console`). */
export const API_LOG_PATH = join(RUNTIME_DIR, 'api.log')
/**
 * Contas compartilhadas por toda a execução (head coach e um staff pendente),
 * geradas no global setup. Os testes que as usam só leem: nunca as mutam.
 */
export const SHARED_ACCOUNTS_PATH = join(RUNTIME_DIR, 'shared-accounts.json')
