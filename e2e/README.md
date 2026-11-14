# Suíte E2E — Playbook do Time

Testes end-to-end com Playwright, contra a API real e o front real, nos
projetos **mobile** (Pixel 7) e **desktop** (1280×800), ambos em Chromium.

## Como rodar (um comando)

Pré-requisitos: Node 22, um Postgres dedicado a testes e o Chromium do Playwright.

```bash
# 1. Postgres de testes (uma vez). O nome do banco precisa conter "e2e" ou "test".
docker run -d --name playbook-e2e-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=playbook_e2e postgres:17

# 2. Dependências e browser (uma vez)
npm ci
npx playwright install chromium

# 3. A suíte: sobe a API, sobe o web, roda os dois projetos
E2E_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/playbook_e2e npm run test:e2e
```

O relatório HTML fica em `e2e/.report` (`npx playwright show-report e2e/.report`).
Traces e screenshots das falhas ficam em `e2e/.results`.

Para depurar visualmente: `npx playwright test --ui` (com a mesma variável).

## O que a suíte faz sozinha

O `playwright.config.ts` sobe dois servidores antes dos testes:

| Serviço | Como sobe | Porta |
| --- | --- | --- |
| API (`apps/api`) | `e2e/scripts/start-api.mjs` (`tsx src/server.ts`) | 3000 |
| Web (`apps/web`) | `vite --config e2e/vite.config.ts` | 5173 |

- **Banco zerado a cada execução.** O `start-api.mjs` apaga o schema `public` do
  `E2E_DATABASE_URL` e deixa as migrações e o seed do head coach rodarem do zero.
  Ele **se recusa** a rodar se o nome do banco não contém `e2e` ou `test`, para não
  apagar um banco de desenvolvimento por engano.
- **Código de acesso sem endpoint de teste.** A API roda com o mailer `console`,
  que escreve o código em log. O script grava esse log em
  `e2e/.runtime/api.log`, e os helpers leem o código de lá. Nenhuma rota fora de
  `docs/api/openapi.yaml` é usada.
- **Proxy /auth e /staff.** O `apps/web` chama a API por caminho relativo e não tem
  proxy no Vite. O `e2e/vite.config.ts` reaproveita o projeto e só adiciona o proxy.
- **Contas compartilhadas.** O `global-setup.ts` autentica o head coach e cria um
  staff pendente, uma vez por execução (`e2e/.runtime/shared-accounts.json`). Os
  testes que usam essas contas só leem.

### Rodar a API e o web à mão

Útil para inspecionar um cenário no navegador:

```bash
# terminal 1: API de testes (banco zerado, código de acesso em e2e/.runtime/api.log)
E2E_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/playbook_e2e node e2e/scripts/start-api.mjs

# terminal 2: web com proxy para a API
npx vite --config e2e/vite.config.ts
```

Abra `http://127.0.0.1:5173/login`. Para ver o código de acesso, leia o final de
`e2e/.runtime/api.log`.

## Estrutura

```
playwright.config.ts          projetos, retries, traces, webServer
e2e/
  global-setup.ts             head coach e staff pendente compartilhados
  vite.config.ts              web de testes (proxy /auth e /staff)
  scripts/start-api.mjs       API de testes (zera o banco, grava o log)
  specs/
    auth.spec.ts              login por e-mail, Google, sessão e logout
    cadastro.spec.ts          cadastro de jogador e de staff pendente
    autorizacao.spec.ts       jogador, staff pendente, head coach
    acessibilidade.spec.ts    teclado, skip link, landmarks, títulos
    playbook.spec.ts          consulta de jogada (smoke + bloqueados)
    presenca-e-jogo.spec.ts   evento, presença, jogo, game plan (bloqueados)
  support/
    constants.mjs             URLs, portas, e-mails, caminhos
    accounts.ts               contas via API (signIn, createAccount, apiAs)
    mail.ts                   lê o código de acesso do log da API
    fixtures.ts               fixtures jogador, staffPendente, headCoach
    keyboard.ts               tabUntilFocused (foco só por Tab)
    shell.ts                  navegação principal visível
    pages/auth-page.ts        page object do login e cadastro
```

Os testes usam papel, rótulo e texto. Seletor por `data-testid` não foi
necessário. Dados vêm da API (`docs/api`), nunca de clique para semear estado.

## Status atual

32 casos ativos e 17 marcados como `fixme`, cada um executado nos dois projetos
(64 execuções passando e 34 marcadas como *skipped*). Os `fixme` não são falhas:
cada um aponta a dependência que falta (ver abaixo). Quando a dependência chegar,
remova o `fixme` e preencha o corpo. Checagem de tipos: `npx tsc -p e2e/tsconfig.json`.

### Bloqueados por dependência (`test.fixme`)

| Área | Motivo |
| --- | --- |
| Posições e unidades no cadastro | `POST /auth/email/verify` não recebe nem persiste posições (contrato). |
| Acúmulo de special teams no cadastro | Contrato aceita um `staffRole`; a tela descarta o checkbox. |
| Erro do retorno do Google | A tela de entrada não lê `login=erro&motivo=`. |
| Consulta de jogada e visibilidade | Sem listagem/detalhe de jogadas em `docs/api`. |
| Evento, presença e justificativa | Sem rotas de evento e resposta em `docs/api`. |
| Jogo, marcação e game plan | Sem rotas de jogo e game plan em `docs/api`. |
| Coordenadores por unidade | Sem aprovação de staff nem atribuição de subpapel em `docs/api`. |

### Achados de produto (reproduzíveis)

1. **Cadastro duplicado de coordenador vira 500.** Com `coordenador_defensivo`
   pendente ou ativo, um segundo `POST /auth/email/verify` com role `staff` e o
   mesmo subpapel responde 500 (violação de `staff_role_exclusive_per_team`, sem
   mapeamento para erro de negócio). Esperado: 4xx com mensagem.
2. **Web sem proxy de API no dev.** `apps/web/vite.config.ts` não encaminha
   `/auth` nem `/staff`; `npm run dev` com a API não funciona sozinho.
3. **Retorno do Google com erro é silencioso.** Ver o `fixme` em `auth.spec.ts`.
4. **Acúmulo de special teams descartado.** Ver o `fixme` em `cadastro.spec.ts`.

## Regras da suíte

- **Determinismo:** cada execução parte de um banco zerado. Contas de jogador
  têm e-mail único por teste. Nenhum teste depende do resultado de outro.
- **Retry:** só na CI (uma nova tentativa). Um teste que precisa de retry aparece
  como *flaky* no relatório e deve ser corrigido. O bloco de cadastro de staff
  roda sem retry, porque ocupa uma vaga exclusiva do banco.
- **Tempo:** por ora não há prazo a congelar. Quando houver eventos com prazo, use
  `page.clock` com data fixa.
- **Acessibilidade:** o fluxo de login e cadastro de jogador roda só com teclado.
  Landmarks e títulos são checados nas telas principais.
- **Limitação:** não há checagem automatizada de contraste nem axe-core. A
  cobertura de acessibilidade é de operação por teclado e de estrutura semântica.
- **Limitação:** o consentimento real do Google não roda sem credenciais. O botão
  é verificado até a requisição a `GET /auth/google`.

## CI

`.github/workflows/e2e.yml` roda `npm run test:e2e` com um service container
Postgres 17 (banco `playbook_e2e`). Em caso de falha, sobe os traces e o relatório
como artefatos.
