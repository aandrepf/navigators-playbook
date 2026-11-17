# Suíte E2E — Playbook do Time

Testes end-to-end com Playwright, contra a API real e o front real, nos
projetos **mobile** (Pixel 7) e **desktop** (1280×800), ambos em Chromium.

## Como rodar (um comando)

Pré-requisitos: Node 22, um Postgres dedicado a testes e o Chromium do Playwright.

```bash
# 1. Postgres de testes (uma vez). O nome do banco precisa conter "e2e" ou "test".
# Use podman nesta máquina ou docker em outra máquina.
podman run -d --name playbook-e2e-pg -p 5432:5432 \
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

Se a porta 5173 (web) ou 3000 (API) já estiver ocupada, por exemplo por um
`npm run dev` aberto, a suíte falha ao subir os servidores (ela não reaproveita
servidores existentes). Troque as portas sem editar código:

```bash
E2E_WEB_PORT=5273 E2E_API_PORT=3100 E2E_DATABASE_URL=... npm run test:e2e
```

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
- **Time de cadastro.** O cadastro usa o código `NAVS-2026` (Navigators), o
  único habilitado. O usuário não digita o código: a tela já mostra a equipe
  atual. Os testes de disponibilidade (`times.spec.ts`) chamam a API direta com
  os códigos desabilitados e um código desconhecido, e esperam `409` e `400`.
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
    cadastro.spec.ts          jogador com/sem posições, staff sem subpapel, contrato
    cadastro-revisao-02-1.spec.ts  revisão UX 02.1: alvos 44px, estados, papel, erros, staff
    times.spec.ts             Navigators habilitado, códigos indisponíveis e desconhecidos
    autorizacao.spec.ts       jogador, staff pendente, head coach
    acessibilidade.spec.ts    teclado, skip link, landmarks, títulos
    playbook.spec.ts          consulta de jogada (smoke + bloqueados)
    presenca-e-jogo.spec.ts   evento, presença, jogo, game plan (bloqueados)
  support/
    constants.mjs             URLs, portas, e-mails, caminhos
    accounts.ts               contas via API (signIn, createAccount, verifyRaw, apiAs)
    mail.ts                   lê o código de acesso do log da API
    fixtures.ts               fixtures jogador, staffPendente, headCoach
    keyboard.ts               tabUntilFocused (foco só por Tab)
    shell.ts                  navegação principal visível
    pages/auth-page.ts        page object do login e cadastro
```

Os testes usam papel, rótulo e texto. Seletor por `data-testid` não foi
necessário. Dados vêm da API (`docs/api`), nunca de clique para semear estado.

## Status atual

Última execução completa da QA-07 (`review/02.1-cadastro-ui` em `5b36a3a` incorporada na
`qa`, Postgres 17 em Podman, banco `playbook_e2e` zerado antes de cada uma de duas
execuções): **138 verdes, 0 vermelhos, 30 `fixme`** (69 casos ativos × 2 projetos;
15 `fixme` × 2). Ver `e2e/RELATORIO-QA-07.md`.

`times.spec.ts` cobre o Navigators (`NAVS-2026`) habilitado e os códigos indisponíveis
(`409`) e desconhecidos (`400`). `cadastro-revisao-02-1.spec.ts` cobre a revisão UX 02.1:
alvo de toque ≥ 44px nas posições, estado marcado com indicador (`✓`) e fundo distinto,
Voltar e erro na etapa de papel, código do time e código de 6 dígitos inválidos voltando
à etapa certa, numerais tabulares, nome acessível do botão Google e Home do staff
pendente sem `Staff ()`.
Os `fixme` não são falhas; cada um aponta a dependência que falta. Checagem de
tipos: `npx tsc -p e2e/tsconfig.json`.

Relatórios: `e2e/RELATORIO-QA-01.md` a `e2e/RELATORIO-QA-06.md`.

O card 01 foi aprovado sem E2E específico para manifesto PWA, service worker
ou deploy no Railway. Esses pontos ficam como melhorias não bloqueantes e
devem receber smoke checks próprios posteriormente, em vez de ampliar a suíte
de fluxos de usuário.

### Bloqueados por dependência (`test.fixme`)

| Área | Motivo |
| --- | --- |
| Perfil com posições pendentes e solicitação de alteração | Perfil é o card 04 (stories 10–11). |
| Não vê justificativa de outro jogador | Eventos e justificativas ainda não estão em `docs/api`. |
| Consulta de jogada e visibilidade | Sem listagem/detalhe de jogadas em `docs/api`. |
| Evento, presença e justificativa | Sem rotas de evento e resposta em `docs/api`. |
| Jogo, marcação e game plan | Sem rotas de jogo e game plan em `docs/api`. |
| Coordenadores por unidade | Sem aprovação de staff nem atribuição de subpapel em `docs/api` (card 06). |
| Landmark `main` nas telas de entrada (S2-03 da revisão 02.1) | `AuthScreen` usa `div.auth-layout`; o web ainda não corrigiu. Não bloqueia o cadastro. |

Cadastro com Google (caminho 2 da matriz de cadastro) não tem cena própria:
o callback exige credenciais externas. A suíte cobre o botão, o 503 e o erro
de retorno; o onboarding Google é do card 03.

### Achados de produto

Os três achados do card 01 foram corrigidos e retestados; consulte
`e2e/RELATORIO-QA-01.md` para a evidência completa:

1. Cadastro duplicado de coordenador retorna `409`.
2. O web tem proxy de `/auth` e `/staff` no desenvolvimento.
3. O retorno Google com `access_denied` exibe feedback acessível.

O acúmulo de special teams continua como `fixme` de contrato/produto e pertence
aos cards seguintes.

Na QA-02, o achado de produto abaixo foi corrigido pelo web (commit `96c85ec`,
integrado na `qa`) e retestado:

4. A tela de entrada (`/login`) tem `h1` como título da página (antes era `h3`).
   Teste: `acessibilidade.spec.ts` › "tela de entrada tem título h1 e campos com rótulo".

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
