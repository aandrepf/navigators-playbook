# Ambiente local com Podman ou Docker

## Objetivo

O repositório usa a especificação Compose e uma imagem OCI compatível com
Docker e Podman. A mesma configuração pode ser usada nesta máquina com
Podman, em outra máquina com Docker ou em um registry/cloud que aceite
containers.

O ambiente possui dois serviços:

- `postgres`: Postgres 17 para desenvolvimento;
- `api`: imagem construída a partir do `Containerfile`, com migrações e seed
  executados antes da API iniciar.

O frontend continua podendo rodar no host com Vite:

```bash
npm run dev
```

## Podman

Pré-requisitos: Podman e uma máquina virtual Podman ativa no macOS.

```bash
podman machine start
podman compose up -d postgres
```

Para subir Postgres e API em containers:

```bash
podman compose up --build -d
podman compose logs -f api
```

Verificação:

```bash
curl http://localhost:3000/health
podman compose ps
```

Parar sem remover os dados:

```bash
podman compose down
```

Remover também o volume local:

```bash
podman compose down -v
```

## Docker

Os mesmos arquivos e comandos funcionam com Docker Compose:

```bash
docker compose up --build -d
curl http://localhost:3000/health
docker compose down
```

O `Containerfile` segue a sintaxe Dockerfile/OCI e pode ser construído com
qualquer uma das ferramentas:

```bash
podman build -f Containerfile -t navigators-playbook-api .
docker build -f Containerfile -t navigators-playbook-api .
```

## Variáveis

Os valores padrão são adequados apenas para desenvolvimento local. Para
customizar, crie um `.env` na raiz (ignorado pelo Git), por exemplo:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=playbook
POSTGRES_PORT=5432
API_PORT=3000
TEAM_NAME=Navigators
TEAM_CODE=NAVIGATORS
SEED_HEAD_COACH_EMAIL=headcoach@example.com
SEED_HEAD_COACH_NAME=Head Coach
```

Segredos e credenciais reais não devem entrar no Compose nem no repositório.
Em cloud, use o secret manager e injete `DATABASE_URL` e as demais variáveis
no serviço.

## Banco de desenvolvimento e E2E

Não reutilize o banco `playbook` para E2E. A suíte E2E apaga o schema do banco
recebido em `E2E_DATABASE_URL` e exige que o nome contenha `e2e` ou `test`.

Para E2E com um segundo container Postgres:

```bash
podman run -d --name playbook-e2e-pg -p 5433:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=playbook_e2e \
  postgres:17

E2E_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/playbook_e2e \
  npm run test:e2e
```

Com Docker, substitua apenas `podman` por `docker`.

## Produção

O deploy planejado continua sendo Railway com Postgres gerenciado. O
`Containerfile` não substitui essa configuração: ele oferece uma imagem
portátil para desenvolvimento, CI ou um futuro serviço de containers.

Em produção:

- nunca use as senhas padrão do Compose;
- defina `DATABASE_URL` pelo provedor;
- mantenha `SESSION_COOKIE_SECURE=true`;
- configure `FRONTEND_URL`, e-mail e OAuth no ambiente do serviço;
- execute migrações como etapa controlada antes de iniciar a aplicação.
