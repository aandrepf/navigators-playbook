# Playbook do Time — Contrato da API

Esta pasta é a superfície combinada entre o backend (`apps/api`) e o frontend
(`apps/web`). O backend é dono do contrato: qualquer endpoint novo nasce aqui
como primeiro entregável, para o frontend desenvolver em paralelo.

- [`openapi.yaml`](./openapi.yaml) — especificação OpenAPI 3.1, autoritativa.
- Este arquivo — narrativa curta do que a fundação entrega.

## O que esta fatia entrega

A fundação atravessa banco, autenticação, sessão, autorização, cadastro com
papel e posições e deploy. O resto (elenco, playbook, eventos, push) chega nas
próximas fatias.

### Autenticação e cadastro

- **Código de uso único por e-mail** (`POST /auth/email/request` +
  `POST /auth/email/verify`), sem senha. O código é gravado só como hash, tem
  TTL curto, uso único e intervalo anti-abuso de reenvio.
- **Login com Google** (`GET /auth/google` + `GET /auth/google/callback`),
  OAuth com `openid email profile`. Nesta fatia o primeiro acesso cria um
  `jogador` `ativo`; o onboarding de posições no Google chega na próxima fatia.
- **Cadastro com papel e posições** (card 02): o mesmo onboarding serve e-mail
  e Google. `jogador` escolhe posições opcionais de ofensiva/defesa (ou pula) e
  entra `ativo`; cada posição informada nasce `pendente`. `staff` não escolhe
  subpapel e entra `pendente`. Telefone é opcional e só é armazenado.
- **Sessão por cookie** `httpOnly`, `secure`, `sameSite=lax`, com expiração
  deslizante. O cookie guarda um token opaco; o servidor mantém a sessão no
  banco (nada de JWT no cliente). A sessão devolve papel, subpapéis, posições
  com estado de validação, unidades derivadas e a permissão `admin`.

### Autorização (sempre no servidor)

- `jogador` entra direto como `ativo`; sem posição `aprovada`, vê apenas o
  próprio estado e não tem unidade liberada.
- Quem se declara `staff` entra `pendente` até um admin ou `head_coach` aprovar
  (ADR-0005/0007); enquanto pendente, lê `GET /auth/session` e **nada mais**.
- `admin` é uma permissão geral configurada pelo seed/ambiente, nunca
  auto-cadastrada; pode coexistir com o vínculo de staff.
- `GET /staff/pending` é restrito a admin ou `head_coach` ativo — a fila de
  aprovação. Aprovar/recusar e atribuir/remover subpapéis é o próximo item.

## Modelo de dados (migrações versionadas)

`apps/api/src/db/migrations/`, aplicadas em ordem por um runner próprio com
tabela `schema_migrations`. Toda tabela carrega `team_id` para suportar
multi-time no futuro (fase 3).

| Tabela | Papel |
| --- | --- |
| `team` | O time (um no MVP), com o `code` usado no cadastro. |
| `user` | Identidade, e-mail verificado, telefone opcional, papel (`jogador`/`staff`), permissão `is_admin` e estado de aprovação. |
| `player` | Vínculo do jogador com o elenco (status do elenco, observação, retorno). |
| `player_position` | Posições do jogador (mais de uma), cada uma ligada a uma unidade e a um estado de validação (`pendente`/`aprovada`). |
| `staff_role` | Subpapéis do staff (head coach e coordenadores; special teams aditivo). |
| `session` | Sessões por cookie (token com hash, expiração deslizante). |
| `email_code` | Códigos de acesso por e-mail (hash, TTL, uso único). |

O catálogo autoritativo de posições vive no backend (`src/domain.ts`) e é
espelhado pelo frontend: ofensiva `QB RB FB WR TE OL`, defesa `DL LB CB S` e
special teams `K P LS KR/PR Gunner`. Unidades derivam das posições `aprovada`;
special teams coexiste com ofensiva/defesa.

## Testes

Vitest chamando a API por `app.inject` contra um **Postgres efêmero** (PGlite,
Postgres real em WASM, criado por suíte):

- `test/auth.test.ts` — ciclo do código de e-mail (solicitar, código inválido,
  verificar, sessão por cookie, logout), jogador com posições e com skip,
  posição inválida/duplicada, staff com posições rejeitado e código de time
  inválido.
- `test/authorization.test.ts` — matriz por papel: jogador 403 na fila, staff
  pendente lê o próprio estado e 403 na fila, staff ativo sem subpapel 403,
  head coach vê a fila, admin (semeado) administra a fila e a derivação de
  unidades apenas de posições aprovadas.

## Variáveis de ambiente

Documentadas em `apps/api/.env.example` (sem segredos). Em produção, o Railway
injeta `DATABASE_URL` ao anexar o Postgres; o resto é definido no painel do
serviço. O `apps/api/railway.json` assume o **root directory do serviço =
`apps/api`** (build `npm run build`, start `npm run start`, healthcheck
`/health`). `SEED_ADMIN_EMAIL`/`SEED_ADMIN_NAME` semeiam o admin geral inicial
(opcional em desenvolvimento).

## Comandos

```bash
npm run dev:api          # servidor com recarga (tsx watch)
npm run db:migrate       # aplica migrações (via DATABASE_URL)
npm run db:seed          # semeia time + primeiro head coach + admin geral
npm test                 # testes de todos os workspaces (raiz)
```
