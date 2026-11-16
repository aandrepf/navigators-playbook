import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { signIn, type Account } from './support/accounts'
import { HEAD_COACH_EMAIL, RUN_ID, SHARED_ACCOUNTS_PATH } from './support/constants.mjs'

/**
 * Prepara as contas compartilhadas da execução. O banco já foi zerado pelo
 * `scripts/start-api.mjs`, então o seed do head coach é novo a cada execução.
 *
 * - Head coach: autenticado uma vez (o reenvio tem limite de um por minuto).
 * - Staff pendente: cadastrado uma vez, como o contrato manda: sem subpapel e
 *   sem posições. Os testes apenas leem essa conta.
 */
export default async function globalSetup(): Promise<void> {
  const headCoach = await signIn({
    email: HEAD_COACH_EMAIL,
    role: 'staff',
    name: 'Head Coach E2E',
  })
  if (!(headCoach.user.approvalState === 'ativo' && headCoach.user.subRoles.includes('head_coach'))) {
    throw new Error(
      `O seed não criou um head_coach ativo para ${HEAD_COACH_EMAIL} ` +
        `(recebido: ${JSON.stringify(headCoach.user)}).`,
    )
  }

  const staffPendente = await signIn({
    email: `staff.pendente.${RUN_ID}@e2e.playbook.test`,
    role: 'staff',
    name: 'Marcos Viana',
  })
  if (
    staffPendente.user.approvalState !== 'pendente' ||
    staffPendente.user.subRoles.length !== 0 ||
    staffPendente.user.positions.length !== 0
  ) {
    throw new Error(
      `O staff compartilhado deveria estar pendente, sem subpapel e sem posições: ${JSON.stringify(staffPendente.user)}`,
    )
  }

  const shared: SharedAccounts = { headCoach, staffPendente }
  mkdirSync(dirname(SHARED_ACCOUNTS_PATH), { recursive: true })
  writeFileSync(SHARED_ACCOUNTS_PATH, JSON.stringify(shared, null, 2))
}

export type SharedAccounts = { headCoach: Account; staffPendente: Account }
