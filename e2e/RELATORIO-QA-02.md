# Relatório QA — Card 02 "Cadastro com papel, subpapel e posições"

Data: 2026-11-16 · Branch testada: `qa`
Commits: integração `7ac03e4` (feat/02 em `qa`, com `6457129` feat e `86cf1d8` test),
suíte QA `e265d19`, relatório `b119617`, **integração do web `c5323e5`** (merge de
`96c85ec`, correção do h1 e feedback de loading, base `eb5165a`), e ajuste de seletor
de papel nesta rodada (commit desta rodada, somente `e2e/`).
Spec de referência: `.scratch/playbook/issues/02-cadastro-papel-posicoes.md`
(checklist já alinhado à decisão "staff não escolhe subpapel").
Responsável: worker QA (`task_4892a1214648`)

## Veredito

**Card 02 sobe para revisão.** O bug de produto da rodada anterior (h1 ausente na
tela de entrada) foi corrigido pelo web e o reteste passa. A suíte roda verde nos
dois projetos (`mobile-chromium` e `desktop-chromium`), com 0 vermelhos. Os 30
`fixme` são dependências de outros cards, não falhas.

## Ambiente

- Podman 5.8.5, máquina `podman-machine-default` (applehv, arm64), iniciada nesta rodada.
- Postgres 17.12 em container `playbook-e2e-pg` (porta 5433, banco `playbook_e2e`), zerado a cada execução pela suíte.
- Node 22, Playwright 1.65.1, Chromium do Playwright. API e web sobem pelo `playwright.config.ts`.
- Comando: `E2E_DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/playbook_e2e npm run test:e2e`.

## Resultado

| Execução | Verdes | Vermelhos | Skipped (`fixme`) | Tempo |
| --- | --- | --- | --- | --- |
| 1 (antes do ajuste de seletor) | 66 | 24 | 30 | 2.9 min |
| 2 (após o ajuste) | 90 | 0 | 30 | 31 s |
| 3 (repetição, banco zerado) | 90 | 0 | 30 | 31 s |

Execução 1: 24 vermelhos por um único motivo, o seletor de papel. O web passou a
renderizar "Jogador" e "Staff" (title case), e a suíte buscava "JOGADOR"/"STAFF".
Corrigido em `e2e/support/pages/auth-page.ts` e `e2e/specs/acessibilidade.spec.ts`
com busca case-insensitive. Não foi mudança de expectativa de produto: o rótulo
não é regra de negócio.

Demais checagens na integração `c5323e5`, após o ajuste:
- Lint (`npm run lint`): sem erros. 1 aviso preexistente em `AuthProvider.tsx`, fora do escopo.
- Tipos da suíte (`npx tsc -p e2e/tsconfig.json`): limpos.
- Unitários: web 108 testes, api 10 testes, verdes.
- Build: verde.

### Casos verdes (novos ou ajustados no card 02)

- **Código do time:** código inválido recusado com alerta acessível "código do time inválido", sem sessão (401).
- **Jogador:** criação com posições (QB, LB) entra `ativo`, posições `pendente`, `units` vazio.
- **Jogador:** "Pular posições por agora" cria jogador `ativo` sem posição.
- **Jogador:** aviso de validação de posições visível no passo de posições.
- **Staff:** cadastro nasce `pendente`, `subRoles` vazio, `positions` vazio; `/staff/pending` 403; `/playbook` bloqueado.
- **Staff:** tela de pendência mostra o estado; não há escolha de subpapel na tela.
- **Contrato (API direta):** staff com `positions` → 400; special teams (`K`) no jogador → 400; posição desconhecida → 400; posição repetida → 400; `staffRole` não concede subpapel.
- **Autorização:** head coach lê a fila; staff pendente aparece sem `requestedSubrole` (contrato `PendingStaff`); staff pendente com sessão vazia de subpapel, posição e unidade; jogador sem Elenco; `/staff/pending` 401 sem sessão e 403 para jogador.
- **Acessibilidade:** teclado até o e-mail (telefone entre nome e e-mail); login e cadastro de jogador só com teclado; grupos de posição rotulados (`Posições de ofensiva`/`defesa`) com `aria-pressed` alternando; erro de código do time como `role="alert"`; **tela de entrada com `h1` "Playbook do Time" e campos rotulados (corrigido)**.
- **Regressão do card 01:** login por e-mail, código errado, Google indisponível (503), erro do Google, sessão, logout, skip link, navegação por teclado, landmarks da tela logada.

### Fixme mantidos (com motivo)

15 casos (×2 projetos): Perfil com posições pendentes e solicitação de alteração (card 04); justificativa
de outro jogador (eventos ainda fora do contrato); playbook por unidade, presença, jogo e game
plan (outros cards); coordenadores por unidade (card 06).

## Checagens do spec (decisão vigente: staff não escolhe subpapel)

- Checklist `.scratch/playbook/issues/02-cadastro-papel-posicoes.md` (na `qa`): já diz "staff não escolhe subpapel no cadastro e nasce `pendente`" (linhas 22 e 59). O texto antigo "Staff escolhe subpapel" não existe mais. Divergência anterior resolvida.
- Suíte e contrato `PendingStaff` seguem a decisão. Nenhum teste espera subpapel de staff.
- **Resquício fora do escopo QA:** `docs/design/prototype/index.html:2012` ainda tem a opção "Staff (escolhe subpapel e fica Pendente até Head Coach aprovar)", que contradiz o texto da linha 2033 do mesmo protótipo ("O cadastro não escolhe subpapel"). Ação para UX/coordenador: alinhar a opção do select.

## Lacunas do card (não bloqueiam a suíte, registradas)

- **Aviso de posição pendente após o cadastro** (story 10): a Home e o Perfil não mostram o estado das posições. O spec empurra isso para o card 04; o teste está em `fixme`.
- **Playbook sem gate por posição aprovada:** a tela `/playbook` mostra conteúdo estático para o jogador, mesmo sem posição aprovada. O spec diz que jogador sem posição aprovada não vê conteúdo específico. Conteúdo por unidade é fora de escopo do card 02, então é observação.
- **Cadastro com Google** (caminho 2 da matriz): sem credenciais externas o callback não roda. Cobertura fica no card 03. A suíte cobre o botão, o 503 e o erro de retorno.

## Observações não bloqueantes

- `staffRole` é removido em silêncio pelo ajv do Fastify (`removeAdditional`), e o cadastro responde 200 sem subpapel. Atende ao contrato ("não aceita"), mas o contrato não diz se deve ser 400. Vale decidir.
- `AuthScreen` ainda lê o parâmetro `forceError` em produção (já apontado no QA-01).
- Caixa dos rótulos de papel mudou de "JOGADOR"/"STAFF" para "Jogador"/"Staff". A suíte agora ignora caixa. Vale confirmar que a grafia nova é a do protótipo.

## Próximo passo

1. Coordenador: revisar o card 02 (veredito: sobe para revisão).
2. UX/coordenador: alinhar a opção "Staff (escolhe subpapel…)" em `docs/design/prototype/index.html:2012`.
3. Card 04: aviso de posição pendente e perfil (os `fixme` correspondentes).
