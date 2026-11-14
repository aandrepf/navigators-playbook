// Sobe a API para a suíte E2E.
//
// - Usa Postgres real (`E2E_DATABASE_URL` ou `DATABASE_URL`). Antes de subir,
//   zera o schema `public` para que cada execução parta do zero: o banco
//   permite um único head coach por time, e cadastros pendentes ocupam
//   subpapéis até aprovação. Só roda em banco cujo nome contenha `e2e` ou
//   `test`, para nunca apagar um banco de desenvolvimento por engano.
// - Migrações e seed do head coach rodam no boot, como em produção.
// - Mailer `console`: o código de acesso vai para o log. Este script grava a
//   saída em `e2e/.runtime/api.log` para que os testes leiam o código, sem
//   nenhum endpoint de teste fora do contrato em `docs/api`.
// - Não usa `tsx watch`: a suíte precisa de um processo estável.

import { spawn } from 'node:child_process'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import {
  API_LOG_PATH,
  API_PORT,
  HEAD_COACH_EMAIL,
  RUNTIME_DIR,
  TEAM_CODE,
  WEB_URL,
} from '../support/constants.mjs'

const databaseUrl = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL
if (!databaseUrl) {
  console.error(
    '[e2e] Defina E2E_DATABASE_URL apontando para um Postgres dedicado a testes (nome com "e2e" ou "test"). Veja e2e/README.md.',
  )
  process.exit(1)
}

const dbName = decodeURIComponent(new URL(databaseUrl).pathname.replace(/^\//, ''))
if (!/(e2e|test)/i.test(dbName)) {
  console.error(
    `[e2e] Recusado: o banco "${dbName}" não parece de teste. O nome precisa conter "e2e" ou "test", porque esta suíte apaga o schema public antes de cada execução.`,
  )
  process.exit(1)
}

await resetSchema(databaseUrl)

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const apiDir = join(repoRoot, 'apps', 'api')

mkdirSync(RUNTIME_DIR, { recursive: true })
const logFile = createWriteStream(API_LOG_PATH, { flags: 'w' })

const child = spawn('npx', ['tsx', 'src/server.ts'], {
  cwd: apiDir,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    DATABASE_URL: databaseUrl,
    HOST: '127.0.0.1',
    PORT: String(API_PORT),
    LOG_LEVEL: 'warn',
    MAILER: 'console',
    FRONTEND_URL: WEB_URL,
    TEAM_CODE,
    SEED_HEAD_COACH_EMAIL: HEAD_COACH_EMAIL,
    SEED_HEAD_COACH_NAME: 'Head Coach E2E',
    SESSION_COOKIE_SECURE: 'false',
    // Sem Google configurado: o botão de Google é coberto por interceptação.
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

child.stdout.on('data', (chunk) => {
  logFile.write(chunk)
  process.stdout.write(chunk)
})
child.stderr.on('data', (chunk) => {
  logFile.write(chunk)
  process.stderr.write(chunk)
})

const forward = (signal) => () => child.kill(signal)
process.on('SIGINT', forward('SIGINT'))
process.on('SIGTERM', forward('SIGTERM'))

child.on('exit', (code, signal) => {
  logFile.end()
  process.exit(code ?? (signal ? 1 : 0))
})

/** Zera o schema public: migrações e seed rodam do zero no boot da API. */
async function resetSchema(url) {
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
  } finally {
    await client.end()
  }
}
