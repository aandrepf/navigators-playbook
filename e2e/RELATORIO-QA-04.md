# Relatório QA-04 — QA final após correção 570d434 (time legado)

Data: 2026-11-16. Branch `qa`, HEAD `57c15d5` + commit deste relatório.

## Integração

- Branch de integração atual: `feat/02-cadastro-papel-posicoes` (local em `d02877f`).
- `d02877f` (que contém `570d434` e o merge com a correção de seed/cadastro) já é
  ancestral de `qa` via `6c7e190`. Nada novo a incorporar: merge sem alteração.
- Atenção: `origin/feat/02-cadastro-papel-posicoes` está em `1df22e3`, atrás do
  local. Quem integra precisa dar push de `d02877f` antes de considerar a branch remota.
- Única mudança desta rodada em código de teste: `e2e/specs/times.spec.ts`
  (caso do legado `NAVIGATORS`, agora esperando 409 conforme a regra pedida).

## Resultados

| Verificação | Resultado |
| --- | --- |
| `npm test` (api + web) | API **31/31** verdes (4 arquivos); web **115/115** verdes (27 arquivos) |
| `npm run build` | verde (`tsc -b` + `vite build`) |
| `npm run lint` (oxlint) | 0 erros; 1 aviso pré-existente `AuthProvider.tsx:55` (`set-state-in-effect`) |
| `npx tsc -p e2e/tsconfig.json --noEmit` | verde |
| Playwright completo, execução 1 (Postgres 17 em Podman, banco zerado) | **108 verdes, 2 vermelhos, 30 fixme/skipped** |
| Playwright completo, execução 2 (Postgres 17 novo em Podman, banco zerado) | **108 verdes, 2 vermelhos, 30 fixme/skipped** (idêntico, sem flaky) |

Infra: container `playbook-e2e-pg-final` (postgres:17, porta 55440), recriado sem
volume antes de cada execução. Portas da suíte: web 5273 e API 3100, porque a
5173 já estava ocupada por outro processo local (PID 17414). Os containers
`navigators-playbook-*` e os demais não foram tocados.

Os 30 skipped são `test.fixme` declarados (cadastro, autorização, playbook,
presença/jogo e game plan), 15 casos × 2 projetos, a mesma lista do QA-02/QA-03.

## Vermelhos (2 × 1 teste, mobile e desktop)

`times.spec.ts` › "registro do time legado NAVIGATORS é preservado e indisponível:
cadastro responde 409". Esperado `409`, recebido `400`.

Causa: divergência de contrato, não de execução.

- Regra pedida para este QA: legado preservado e indisponível → cadastro `409`.
- `docs/api/openapi.yaml` e `docs/api/README.md` (atualizados pela `570d434`):
  código legado (ex. `NAVIGATORS`) é **desconhecido** para o catálogo → `400`;
  `409` é só para código do catálogo desabilitado.
- Implementação (`apps/api/src/auth/routes.ts`): `isKnownTeamCode` falha antes de
  olhar o banco → `400 código do time inválido`.

Reprodução mínima: com `NAVIGATORS` na tabela `team` (`enabled=false`),
`POST /auth/email/verify` com `teamCode: "NAVIGATORS"` responde `400`.

Não alterei o teste para `400` nem o contrato: a escolha é de produto. Duas saídas:

1. Manter 409 (regra pedida): ajustar `apps/api` (checar código no banco antes do
   catálogo) e `docs/api` para dizer 409 para legado. Depois a suíte fica verde.
2. Manter 400 (contrato atual): trocar o caso do teste para `400` e registrar a
   decisão no contrato. Depois a suíte fica verde.

## Verificações que passaram (regras do QA-03)

- `NAVS-2026` habilitado aceita cadastro, com normalização de caixa e espaços.
- `NAVS-2026` continua aceitando cadastro com o legado presente no banco.
- Os seis códigos desabilitados do catálogo respondem 409 e não abrem sessão.
- Código desconhecido responde 400.
- Registro do legado é preservado (nome e `enabled=false`) após o caso.

## Veredito

**Não pronta para merge.** Testes unitários, build, lint, tsc e o E2E completo
passam, com 108 verdes e 30 fixme declarados, nas duas execuções com banco zerado. O
único vermelho é a divergência 409 × 400 no legado `NAVIGATORS`. Ela só fecha quando
produto decidir qual código vale e o contrato e o teste forem alinhados. Quando
isso estiver resolvido, a suíte deve estar 110 verdes e 30 fixme.
