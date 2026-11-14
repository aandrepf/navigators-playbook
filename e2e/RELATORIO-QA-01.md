# Relatório QA — Card 01 "Esqueleto andante"

Data: 2026-11-14 · Branch testada: `qa` (app idêntico a `main`, `api` e `web`)
Responsável: worker QA (`task_e93f7d69f8ab`)

## Veredito

**Não concluir.** Os três achados do card continuam reproduzíveis. Não há
commit de correção nas branches `api`, `web` ou `main` (todas sem alterações
pendentes e sem commits posteriores a `dc815cb`/`91a46fe`/`9ec8998`). O card
deve voltar para **Em andamento** até os três itens abaixo passarem no reteste.

## Reteste dos três achados

| # | Achado | Como foi retestado | Resultado |
| --- | --- | --- | --- |
| 1 | Cadastro duplicado de coordenador vira 500 | `POST /auth/email/verify` com `role: staff`, `staffRole: coordenador_defensivo`, para dois e-mails novos, contra a API local | **Reproduzido.** O primeiro cadastro responde 200 (pendente). O segundo responde **500** `{"error":"erro interno"}`. Causa: `staff_role_exclusive_per_team` não é traduzida em 4xx. Código: nenhum tratamento de `23505` em `apps/api/src`. |
| 2 | Web sem proxy de `/auth` no dev | `vite --config apps/web/vite.config.ts` (config padrão do app), `GET /auth/session` | **Reproduzido.** Responde **404** do Vite, nunca a resposta da API. `apps/web/vite.config.ts` não tem `server.proxy`. Com o `e2e/vite.config.ts`, o mesmo endpoint responde 401 (proxy ok), mas esse é o config de testes, não o do app. |
| 3 | Retorno do Google com erro silencioso | `GET /auth/google` e análise de `AuthScreen` | **Reproduzido por leitura de código.** A API ainda responde 503 (Google não configurado), então o redirect `login=erro&motivo=` não é alcançável neste ambiente. A `AuthScreen` não lê `login`/`motivo` (`git grep` sem resultado em `apps/web/src`). Desbloquear o reteste exige credenciais Google no ambiente. |

## O que segue verde (sem mudança)

- Suíte E2E em `qa` (commit `06502bc`): **64 execuções passando**, 34 `fixme`
  (17 casos × 2 projetos), banco zerado a cada execução.
- Lint, build e testes existentes: verdes.

## Pendências para liberar o card

1. Backend: mapear a violação de `staff_role_exclusive_per_team` para erro de
   negócio (4xx com mensagem). Depois, remover o `fixme` de cadastro de staff
   duplicado, se a suíte ganhar esse caso.
2. Frontend/infra: adicionar `server.proxy` para `/auth`, `/staff` e `/health`
   em `apps/web/vite.config.ts` (ou documentar um comando de dev que faça o
   mesmo). Depois, o reteste é `npm run dev` + API, `GET /auth/session` → 401 JSON.
3. Frontend: ler `login=erro&motivo=...` na `AuthScreen` e mostrar mensagem.
   Depois, desbloquear o `fixme` de `auth.spec.ts` ("retorno do Google com erro").

## Fora deste reteste

- Acúmulo de special teams no cadastro (`subRoles[0]`) continua como `fixme`
  de contrato/produto, não faz parte do card 01.
- Consentimento real do Google continua sem cobertura automatizada.
