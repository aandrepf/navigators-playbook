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

## Reteste 2 — `main` integrado (commit 0c65a87)

Branch `qa` com `main` integrado (`58fe35b`). Suíte completa: `npm run test:e2e`.

| # | Achado | Resultado | Evidência |
| --- | --- | --- | --- |
| 1 | Cadastro duplicado de coordenador vira 500 | **Resolvido.** O segundo candidato à mesma vaga exclusiva recebe 409 `este subpapel de staff já está ocupado` e a tela mostra o alerta. Caso ativo em `cadastro.spec.ts`, nos dois projetos. Teste de API de unidade também cobre 409 e special teams aditivo. | `cadastro.spec.ts` verde |
| 2 | Web sem proxy de `/auth` no dev | **Resolvido.** A config padrão `apps/web/vite.config.ts` encaminha `/auth` e `/staff`: `GET /auth/session` → 401 JSON da API (antes: 404 do Vite). | curl na config padrão |
| 3 | Retorno do Google com erro silencioso | **Não resolvido.** Reproduzido de ponta a ponta com a API real (credenciais fictícias, sem rede externa): `GET /auth/google/callback?error=access_denied` → 302 para `http://127.0.0.1:5173?login=erro&motivo=access_denied`. A raiz cai em `/login`, que não mostra alerta. O componente novo `GoogleCallback` só trata `/auth/google/callback?error=...`, rota que o backend nunca usa. | `auth.spec.ts` "erro devolvido pelo Google" falha nos dois projetos (`getByRole('alert')` não encontrado) |

Também verdes: alerta acessível para login Google indisponível (503).

### Reprodução do achado 3

1. Subir a API com `E2E_DATABASE_URL` apontando para banco `e2e`/`test`, e o web com `npm run dev` ou `npx vite --config apps/web/vite.config.ts`.
2. Abrir `http://127.0.0.1:5173/auth/google/callback?error=access_denied` (no dev, a requisição vai pela API).
3. Esperado: alerta "Você cancelou o login com Google..." na tela de entrada. Obtido: tela de entrada sem alerta, URL `/login`.

Correção sugerida (backend ou frontend, a decidir): ou o backend redireciona para
`${FRONTEND_URL}/auth/google/callback?error=...` (alinhado ao componente novo), ou a
tela de entrada lê `login=erro&motivo=...`. Qualquer uma passa no teste.

### Observações não bloqueantes

- O frontend lê um parâmetro de teste `forceError` em `AuthScreen` e envia
  `?forceError=` ao `GET /auth/google`, e o mock também o interpreta. Isso é um gancho
  de teste no código de produção. Sugerido: mover para o mock/MSW ou remover.
- Acúmulo de special teams no cadastro segue `fixme` (`subRoles[0]`).
- Posições/unidades no cadastro seguem `fixme` (contrato).

### Veredito do reteste

**Card 01 não pode ir para Concluído.** Dois de três achados resolvidos. O erro do
Google continua reproduzível de ponta a ponta.

## Reteste 3 — `main` com 8ef0823 (branch `qa` integrada em `86ddc7c`)

- Suíte completa (`npm run test:e2e`), duas execuções seguidas com banco zerado:
  **68 passam, 0 falham** (32 casos ativos × 2 projetos). Os 34 `fixme` seguem
  marcados como *skipped*.
- Lint, build e testes unitários: verdes (`web` 10 testes, `api` 9 testes).
- Achado 3 (retorno do Google com erro): **resolvido.** `/?login=erro&motivo=access_denied`
  mostra o alerta acessível "Você cancelou o login com Google..." (`LoginErrorScreen`).
  O teste ponta a ponta, que parte do callback real da API, passa nos dois projetos.
- Achados 1 e 2: seguem resolvidos (reteste 2).

### Veredito QA

Os três achados do card 01 estão resolvidos e a suíte está verde. **Do ponto de vista QA, o
card 01 pode ser concluído.** Ressalvas que não bloqueiam este card:

- Não há cobertura automatizada do manifesto PWA, do service worker nem do deploy no
  Railway, que estão nos critérios do card 01 e ficam fora da suíte E2E.
- O parâmetro de teste `forceError` no código de produção segue (não bloqueante).
- Os `fixme` (posições no cadastro, acúmulo de special teams e as fatias de eventos,
  jogo e playbook) pertencem aos cards seguintes.
