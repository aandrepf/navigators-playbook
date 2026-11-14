# apps/api

Backend do Playbook do Time: Fastify + Postgres, autorização por papel e
unidade, contrato publicado em [`docs/api/`](../../docs/api/).

## Estrutura

```
src/
  config.ts            variáveis de ambiente (ver .env.example)
  domain.ts            vocabulário do domínio (GLOSSARY.md) como tipos
  db/                  seam de dados (pg em produção, PGlite nos testes)
    migrations/        SQL versionado (NNNN_nome.sql)
    migrate.ts         runner com schema_migrations
    seed.ts            time + primeiro head coach (idempotente)
  auth/                código de e-mail, sessão por cookie, Google OAuth
  staff/               fila de cadastros pendentes (head coach)
  plugins/auth.ts      resolve sessão e registra os guards de autorização
  app.ts               buildApp (sem listen; usado por server.ts e testes)
  server.ts            entrypoint (migra + seed + listen)
test/                  Vitest via app.inject contra Postgres efêmero
```

## Comandos

```bash
npm run dev            # tsx watch src/server.ts
npm run build          # tsc + copia migrações para dist/
npm run start          # node dist/server.js (produção)
npm run db:migrate     # aplica migrações via DATABASE_URL
npm run db:seed        # semeia time + head coach
npm test               # vitest run
```

Nada de React aqui. O contrato é a única superfície combinada com `apps/web`.
