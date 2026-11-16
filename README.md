# Navigators Playbook

App web mobile-first para um time de futebol americano: playbook, presença em
treino, disponibilidade para jogo e status do elenco.

## Estrutura

```
apps/web      React + TypeScript + Vite (front-end, PWA e biblioteca UI P0 em src/components/ui/)
apps/api      Fastify + Postgres (backend; contrato em docs/api/)
docs/design   sistema de design Vega, inventário Figma autenticado e protótipo navegável (prototype/index.html)
docs/adr      decisões arquiteturais
.scratch      spec e tickets (tracker local)
```

Workspaces npm na raiz. Cada app tem o próprio `package.json`; os comandos
abaixo rodam na raiz e delegam para os workspaces.

## Desenvolvimento

```bash
npm install
npm run dev        # front em http://localhost:5173
npm run dev:api    # backend (quando apps/api existir)
npm run build      # build de todos os workspaces
npm run preview    # serve o build do front
npm run lint       # oxlint
npm test           # testes de todos os workspaces
npm run test:watch # vitest em modo watch (front)
```

### Ambiente Postgres com Podman ou Docker

O ambiente containerizado é portátil entre Podman e Docker. Ele está
documentado em [`docs/operations/CONTAINERS.md`](docs/operations/CONTAINERS.md).

```bash
podman compose up --build -d   # nesta máquina
# ou: docker compose up --build -d
curl http://localhost:3000/health
```

O Compose usa Postgres 17 e executa migrações/seed antes da API iniciar.
Não use o banco de desenvolvimento para os testes E2E.

### Testes

Vitest + jsdom + React Testing Library em `apps/web`, configurados em
`apps/web/vite.config.ts` (`test.environment`, `test.setupFiles`) e
`apps/web/src/test/setup.ts`. Testes ficam ao lado do código como
`src/**/*.test.tsx`. `describe`/`it`/`expect` são globais — os tipos vêm de
`vitest/globals` no `apps/web/tsconfig.app.json`.

O backend usa o mesmo Vitest, com os testes chamando a API por `app.inject`
contra um Postgres efêmero.

## Git e contas GitHub

Este repositório pertence à conta **pessoal** `aandrepf` e usa **SSH**. Não usar
URLs HTTPS neste repositório: o credential helper do macOS tem guardadas as
credenciais da conta de trabalho (`apfaccdev`) e o push iria para a conta errada.

### Configuração aplicada neste repositório

```bash
git config user.name "Andre Figueiredo"
git config user.email "figueiredoaphilippe@gmail.com"

git remote -v
# origin  git@github.com-pessoal:aandrepf/navigators-playbook.git (fetch)
# origin  git@github.com-pessoal:aandrepf/navigators-playbook.git (push)
```

Estas definições são locais (`.git/config`) e não alteram a configuração global
da máquina.

### Como a máquina alterna entre as contas

A alternância acontece em três camadas independentes:

| Camada | Conta de trabalho | Conta pessoal |
| --- | --- | --- |
| `gh` CLI | `apfaccdev` (ativa) | `aandrepf` (adicionar com `gh auth login`) |
| Identidade git | email Accenture (global) | `figueiredoaphilippe@gmail.com` (local neste repo) |
| Transporte SSH | sem chave de trabalho | `~/.ssh/id_ed25519_pessoal` |

#### `gh` CLI

O `gh` só guarda, por defeito, a conta de trabalho. Para adicionar e alternar:

```bash
# adicionar a conta pessoal (interativo, abre o browser)
gh auth login --hostname github.com --git-protocol ssh

# alternar
gh auth switch --user aandrepf     # pessoal
gh auth switch --user apfaccdev    # trabalho
gh auth status                     # ver a conta ativa
```

A conta ativa do `gh` é **global por host**, não por diretório. Para isolar um
comando sem trocar a conta ativa, usar `GH_TOKEN` nesse shell.

#### Identidade dos commits

A configuração global (`~/.gitconfig`) usa o email da Accenture. A identidade
pessoal é ativada automaticamente apenas em repositórios dentro de `LEARNING/`,
via `includeIf`:

```ini
[includeIf "gitdir:**/LEARNING/"]
    path = ~/.gitconfig-pessoal
```

Fora dessas pastas, definir a identidade por repositório (como neste projeto)
com `git config user.name` / `git config user.email`.

#### SSH

Só existe uma chave SSH configurada, a pessoal:

```sshconfig
Host github.com-pessoal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_pessoal
    AddKeysToAgent yes
    UseKeychain yes
```

Testar:

```bash
ssh -T git@github.com-pessoal
# Hi aandrepf! You've successfully authenticated...
```

Como é a única chave no agente, `git@github.com` também autentica como
`aandrepf`. O alias `github.com-pessoal` torna isso explícito e evita depender
da ordem das chaves.

### Publicar o repositório pela primeira vez

O repositório remoto ainda tem de existir em `github.com/aandrepf`. Duas opções:

```bash
# 1. Criar pela CLI (depois de gh auth switch --user aandrepf)
gh repo create aandrepf/navigators-playbook --private --source=. --remote=origin --push

# 2. Criar vazio na UI e fazer push
git push -u origin main
```

### Clonar noutra máquina

```bash
git clone git@github.com-pessoal:aandrepf/navigators-playbook.git
# ou, com a chave pessoal como predefinição:
git clone git@github.com:aandrepf/navigators-playbook.git
```

Se a chave pessoal não estiver no agente:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_pessoal
```
