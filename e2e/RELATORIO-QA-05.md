# Relatório QA-05 — QA final após commit da API d591d9c

Data: 2026-11-16. Branch `qa`, merge `7c23a1f` (incorpora `feat/02-cadastro-papel-posicoes` em `2f05e62`).

## Integração

- Branch de integração atual: `feat/02-cadastro-papel-posicoes`, local em `2f05e62`
  (`d591d9c` fix(api) 409/400 + `2f05e62` merge/ajuste de docs).
- Merge `--no-ff` em `qa` sem conflito: `7c23a1f`. Nenhum arquivo de produto alterado
  fora do merge; nenhuma alteração de teste nesta rodada.
- Pendência de integração: `origin/feat/02-cadastro-papel-posicoes` continua em `1df22e3`,
  atrás do local `2f05e62`. Precisa de push antes do merge para `main`.

## Contrato do cadastro (decisão já aplicada em `d591d9c`)

- Time do catálogo desabilitado (`DEVILS`, `BLDS`, `RNGD`, `WARS`, `MUTTS`, `CRSD`) → `409`.
- Time legado preservado `NAVIGATORS` (existe no banco, desabilitado) → `409`.
- Código desconhecido → `400`.
- `NAVS-2026` habilitado → aceita cadastro.

Os testes em `e2e/specs/times.spec.ts` cobrem esses quatro casos. O caso `NAVIGATORS`
que estava vermelho no QA-04 (esperava 409, recebia 400) agora passa nos dois projetos.

## Resultados

| Verificação | Resultado |
| --- | --- |
| `npm test` (api + web) | API **31/31** verdes; web **115/115** verdes (27 arquivos). Exit 0. |
| `npm run build` | verde. Exit 0. |
| `npm run lint` (oxlint) | 0 erros; 1 aviso pré-existente `AuthProvider.tsx:55` (`set-state-in-effect`). Exit 0. |
| `npx tsc -p e2e/tsconfig.json --noEmit` | verde. Exit 0. |
| Playwright completo, execução 1 (Postgres 17 em Podman, volume novo, banco zerado) | **110 passed, 0 failed, 30 skipped**. Exit 0. |
| Playwright completo, execução 2 (Postgres 17 novo em Podman, volume novo, banco zerado) | **110 passed, 0 failed, 30 skipped**. Exit 0. Idêntico à execução 1. |

Infra: `podman machine start` foi necessário antes da primeira execução. Containers
`playbook-e2e-pg-qa-final-1` (porta 55441) e `-2` (porta 55442), ambos sem volume,
recriados a cada rodada e removidos ao final. Portas da suíte: web 5273, API 3100.
Nenhum container ou processo pré-existente foi tocado.

Os 30 skipped são `test.fixme` declarados em `e2e/specs/` (16 declarações × 2 projetos),
a mesma lista dos QA-02, QA-03 e QA-04. Não são falhas nem flaky.

## Decisão

**Pronto para merge do ponto de vista de QA**, com duas condições operacionais:

1. Dar push de `2f05e62` em `origin/feat/02-cadastro-papel-posicoes` (remoto está em `1df22e3`).
2. Aceitar os 30 `fixme` já declarados como dívida conhecida; eles não cobrem o fluxo novo
   desta rodada, e as regras de jogada, presença e game plan seguem sem teste automatizado
   ativo.
