# Relatório QA — Card 02 "Cadastro com papel, subpapel e posições"

Data: 2026-11-16 · Branch testada: `qa`
Commits: integração `7ac03e4` (merge de `feat/02-cadastro-papel-posicoes` em `qa`,
com `6457129` feat e `86cf1d8` test do card), suíte QA `e265d19`.
Spec de referência: `.scratch/playbook/issues/02-cadastro-papel-posicoes.md` **da
branch `feat/02`** (spec completo, commit `a651b1f`). A cópia da `qa` é um resumo antigo e
diverge (ver "Divergências").
Responsável: worker QA (`task_a99754ae525f`)

## Veredito

**Não concluir.** A suíte está verde nos fluxos do card, exceto **um bug de produto**:
a tela de entrada não tem `h1`. Pela mesma regra do card 01, um achado de produto aberto
bloqueia a conclusão. Card 02 sobe para revisão quando o h1 for corrigido e o reteste passar.

## Ambiente

- Podman 6.0.2, máquina `podman-machine-default` (applehv, arm64), iniciada nesta sessão.
- Postgres 17 em container `playbook-e2e-pg` (porta 5433, banco `playbook_e2e`), zerado a cada execução pela suíte.
- Node 22.23.1, Playwright 1.65.1, Chromium do Playwright. API e web sobem pelo `playwright.config.ts`.
- Comando: `E2E_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/playbook_e2e npm run test:e2e`.

## Resultado

Duas execuções seguidas, banco zerado em cada uma, mesmo resultado:

| Execução | Verdes | Vermelhos | Skipped (`fixme`) |
| --- | --- | --- | --- |
| 1 | 88 | 2 | 30 |
| 2 | 88 | 2 | 30 |

Os 2 vermelhos são o mesmo caso nos dois projetos (`mobile-chromium` e `desktop-chromium`).
Lint sem erros (1 aviso preexistente em `AuthProvider.tsx`, fora do escopo). Tipos da
suíte (`tsc -p e2e/tsconfig.json`) limpos. Unitários: web 108 testes, api 10 testes, verdes.
Build verde.

### Casos verdes (novos ou ajustados no card 02)

- **Código do time:** código inválido recusado com alerta acessível "código do time inválido", sem sessão (401).
- **Jogador:** criação com posições (QB, LB) entra `ativo`, posições `pendente`, `units` vazio.
- **Jogador:** "Pular posições por agora" cria jogador `ativo` sem posição.
- **Jogador:** aviso de validação de posições visível no passo de posições.
- **Staff:** cadastro nasce `pendente`, `subRoles` vazio, `positions` vazio; `/staff/pending` 403; `/playbook` bloqueado.
- **Staff:** tela de pendência mostra o estado; não há escolha de subpapel na tela.
- **Contrato (API direta):** staff com `positions` → 400; special teams (`K`) no jogador → 400; posição desconhecida → 400; posição repetida → 400; `staffRole` não concede subpapel.
- **Autorização:** head coach lê a fila; staff pendente aparece sem `requestedSubrole` (contrato `PendingStaff`); staff pendente com sessão vazia de subpapel, posição e unidade; jogador sem Elenco; `/staff/pending` 401 sem sessão e 403 para jogador.
- **Acessibilidade:** teclado até o e-mail (telefone entre nome e e-mail); login e cadastro de jogador só com teclado; grupos de posição rotulados (`Posições de ofensiva`/`defesa`) com `aria-pressed` alternando; erro de código do time como `role="alert"`.
- **Regressão do card 01:** login por e-mail, código errado, Google indisponível (503), erro do Google, sessão, logout, skip link, navegação por teclado, landmarks da tela logada.

### Fixme mantidos (com motivo)

15 casos: Perfil com posições pendentes e solicitação de alteração (card 04); justificativa
de outro jogador (eventos ainda fora do contrato); playbook por unidade, presença, jogo e game
plan (outros cards); coordenadores por unidade (card 06).

## Bloqueios

### 1. Bug de produto: tela de entrada sem `h1` (vermelho, 2 casos)

- **Teste:** `acessibilidade.spec.ts` › "tela de entrada tem título h1 e campos com rótulo".
- **Reprodução:** abrir `/login`. A árvore de acessibilidade mostra `heading "Playbook do Time" [level=3]`.
  Não existe `h1` na tela de entrada.
- **Causa:** `CardTitle` renderiza `h3`, e a tela de entrada (`AuthScreen.tsx`, passo `welcome`) usa `CardTitle` como título da página.
  A tela logada tem `h1` e passa.
- **Correção sugerida (frontend):** título da página de entrada como `h1` (por exemplo, `as="h1"` ou elemento próprio). Não mudar a expectativa do teste.
- **Por que é bloqueio:** é a regra de título de tela e landmarks do card 01 (e do critério de acessibilidade), regredida pela migração para a biblioteca UI.

### 2. Checklist do card desalinhado (decisão vigente: staff não escolhe subpapel)

Decisão vigente: **staff não escolhe subpapel no cadastro** e nasce `pendente` sem subpapel nem posições
(spec completo em `feat/02`, `a651b1f`; contrato `PendingStaff` sem subpapel). A suíte e o contrato já seguem essa decisão.
O checklist em `.scratch/playbook/issues/02-cadastro-papel-posicoes.md` da `qa` ainda diz "Staff escolhe subpapel (head coach, coordenador ofensivo, defensivo ou de special teams)".
Esse arquivo está em `.scratch/**`, que o worker QA não edita. **Ação para o coordenador:** trocar o item por "Staff nasce pendente, sem subpapel; subpapel é atribuído depois por admin ou head coach (card 06)".

### 3. Lacunas do card (não bloqueiam a suíte, registradas)

- **Aviso de posição pendente após o cadastro** (story 10): a Home e o Perfil não mostram o estado das posições. O spec empurra isso para o card 04; o teste está em `fixme`.
- **Playbook sem gate por posição aprovada:** a tela `/playbook` mostra conteúdo estático para o jogador, mesmo sem posição aprovada. O spec diz que jogador sem posição aprovada não vê conteúdo específico. Conteúdo por unidade é fora de escopo do card 02, então é observação.
- **Cadastro com Google** (caminho 2 da matriz): sem credenciais externas o callback não roda. Cobertura fica no card 03. A suíte cobre o botão, o 503 e o erro de retorno.

### 4. Observações não bloqueantes

- `staffRole` é removido em silêncio pelo ajv do Fastify (`removeAdditional`), e o cadastro responde 200 sem subpapel. Atende ao contrato ("não aceita"), mas o contrato não diz se deve ser 400. Vale decidir.
- `AuthScreen` ainda lê o parâmetro `forceError` em produção (já apontado no QA-01).

## Mudanças nesta rodada (somente `e2e/`)

- `support/accounts.ts`: removido `staffRole`; `signIn` aceita `positions`; novo helper `verifyRaw` para os casos de contrato; tipo `PublicUser` com `positions`, `units`, `isAdmin`.
- `global-setup.ts`: staff pendente sem `staffRole`; asserção de sem subpapel e sem posição.
- `specs/cadastro.spec.ts`: reescrito para o card 02 (ver casos verdes).
- `specs/autorizacao.spec.ts`: fila sem `requestedSubrole`; sessão do staff pendente com `subRoles`, `positions`, `units`, `isAdmin`.
- `specs/acessibilidade.spec.ts`: teclado ajustado ao campo de telefone e sem botão de unidade; novos casos de grupo de posição e erro do time; caso do h1 mantido com a expectativa correta e comentário de bug.
- `support/fixtures.ts`: comentário atualizado.
- `README.md`: contagens, tabela de bloqueados e bug de produto.

## Próximo passo

1. Web: título `h1` na tela de entrada (bloqueio 1).
2. Coordenador: alinhar checklist do card 02 com o spec de `feat/02` (divergência 2).
3. QA: reteste com `npm run test:e2e`. Se o caso do h1 passar e o restante continuar verde, o card 02 pode ser concluído.
