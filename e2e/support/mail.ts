import { readFile } from 'node:fs/promises'
import { API_LOG_PATH } from './constants.mjs'

/**
 * Lê o código de acesso emitido pela API para um e-mail.
 *
 * A API (mailer `console`) escreve `código de acesso para <email>: <código>` no
 * log, e `scripts/start-api.mjs` grava esse log em `e2e/.runtime/api.log`. Usamos
 * o último código emitido para o e-mail, então um reenvio nunca lê código velho.
 */
export async function waitForLoginCode(email: string, timeoutMs = 10_000): Promise<string> {
  const deadline = Date.now() + timeoutMs
  const needle = `código de acesso para ${email.toLowerCase()}: `

  for (;;) {
    const code = await lastCodeFor(needle)
    if (code) return code
    if (Date.now() > deadline) {
      throw new Error(
        `Código de acesso para ${email} não apareceu em ${API_LOG_PATH}. ` +
          'Confirme que a API subiu com MAILER=console e que o e-mail não caiu no ' +
          'intervalo anti-abuso de reenvio (60s).',
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
}

async function lastCodeFor(needle: string): Promise<string | null> {
  let log: string
  try {
    log = await readFile(API_LOG_PATH, 'utf8')
  } catch {
    return null
  }
  const lines = log.split('\n').filter((line) => line.includes(needle))
  const last = lines.at(-1)
  if (!last) return null
  const code = last.slice(last.indexOf(needle) + needle.length).trim()
  return /^\d{6}$/.test(code) ? code : null
}
