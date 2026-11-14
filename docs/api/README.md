# Playbook do Time — Contrato da API

Esta pasta é a superfície combinada entre o backend (`apps/api`) e o frontend
(`apps/web`). O backend é dono do contrato: qualquer endpoint novo nasce aqui
como primeiro entregável, para o frontend desenvolver em paralelo.

- [`openapi.yaml`](./openapi.yaml) — especificação OpenAPI 3.1, autoritativa.
- Este arquivo — narrativa curta do que a fundação entrega.

## O que esta fatia entrega

A fundação atravessa banco, autenticação, sessão, autorização e deploy. O
resto (elenco, playbook, eventos, push) chega nas próximas fatias.

### Autenticação

- **Código de uso único por e-mail** (`POST /auth/email/request` +
  `POST /auth/email/verify`), sem senha. O código é gravado só como hash, tem
  TTL curto, uso único e intervalo anti-abuso de reenvio.
- **Login com Google** (`GET /auth/google` + `GET /auth/google/callback`),
  OAuth com `openid email profile`. Primeiro acesso cria um `jogador` `ativo`.
- **Sessão por cookie** `httpOnly`, `secure`, `sameSite=lax`, com expiração
  deslizante. O cookie guarda um token opaco; o servidor mantém a sessão no
  banco (nada de JWT no cliente).

### Autorização (sempre no servidor)

- `jogador` entra direto como `ativo` e lê apenas o próprio estado.
- Quem se declara `staff` entra `pendente` até um `head_coach` aprovar
  (ADR-0005); enquanto pendente, lê `GET /auth/session` e **nada mais**.
- `GET /staff/pending` é restrito a `head_coach` ativo — a fila de aprovação.
  Aprovar/recusar e atribuir/remover subpapéis é o próximo item.

## Modelo de dados (migrações versionadas)

`apps/api/src/db/migrations/`, aplicadas em ordem por um runner próprio com
tabela `schema_migrations`. Toda tabela carrega `team_id` para suportar
multi-time no futuro (fase 3).

| Tabela | Papel |
| --- | --- |
| `team` | O time (um no MVP), com o `code` usado no cadastro. |
| `user` | Identidade, e-mail verificado, papel (`jogador`/`staff`) e estado de aprovação. |
| `player` | Vínculo do jogador com o elenco (status do elenco, observação, retorno). |
| `player_position` | Posições do jogador (mais de uma), cada uma ligada a uma unidade. |
| `staff_role` | Subpapéis do staff (head coach e coordenadores; special teams aditivo). |
| `session` | Sessões por cookie (token com hash, expiração deslizante). |
| `email_code` | Códigos de acesso por e-mail (hash, TTL, uso único). |

## Testes

Vitest chamando a API por `app.inject` contra um **Postgres efêmero** (PGlite,
Postgres real em WASM, criado por suíte). Dois testes de fundação:

- `test/auth.test.ts` — ciclo completo do código de e-mail (solicitar, recusar
  código inválido, verificar, sessão por cookie, logout).
- `test/authorization.test.ts` — matriz por papel: jogador 403 na fila de
  staff, staff pendente lê o próprio estado e 403 na fila, head coach vê a fila.

## Variáveis de ambiente

Documentadas em `apps/api/.env.example` (sem segredos). Em produção, o Railway
injeta `DATABASE_URL` ao anexar o Postgres; o resto é definido no painel do
serviço. O `apps/api/railway.json` assume o **root directory do serviço =
`apps/api`** (build `npm run build`, start `npm run start`, healthcheck
`/health`).

## Comandos

```bash
npm run dev:api          # servidor com recarga (tsx watch)
npm run db:migrate       # aplica migrações (via DATABASE_URL)
npm run db:seed          # semeia time + primeiro head coach
npm test                 # testes de todos os workspaces (raiz)
```
