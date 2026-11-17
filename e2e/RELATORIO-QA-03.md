# Relatório QA-03 — regressão pós-revisão do card 02

Data: 2026-11-16. Branch `qa` com `feat/02-cadastro-papel-posicoes` incorporada
(fast-forward até `eba4aca`). Correções avaliadas: `53f1161` (web) e `c0ffd23`
(api, incluindo `f03323f`).

## Resultados

| Verificação | Resultado |
| --- | --- |
| `npm test` (api + web) | API 29/29 verdes (4 arquivos); web 115/115 verdes (27 arquivos) |
| `npm run build` | verde (`tsc -b` + `vite build`) |
| `npm run lint` (oxlint) | 0 erros, 1 aviso: `AuthProvider.tsx:55` `react(set-state-in-effect)` (preexistente, fora do escopo do card 02) |
| `npx tsc -p e2e/tsconfig.json` | verde |
| Playwright completo (Postgres 17 em Podman, `playbook_e2e` zerado) | **106 verdes, 0 vermelhos, 30 fixme/skipped** (15 × 2 projetos), na 1ª e na 2ª execução (sem flaky) |
| `times.spec.ts` | verde: Navigators `NAVS-2026` habilitado, normalização de código, 409 para indisponíveis, 400 para desconhecido |
| `cadastro.spec.ts` | verde nos casos ativos; `Perfil` segue `fixme` (card 04) |

Os 30 `fixme` são os mesmos do QA-02 (dependência de card futuro), não falhas.

## Correções do card 02

- **Alvos de toque (53f1161):** `.position-toggle` tem `min-height/min-width: 44px`
  em `index.css`. Coberto só por teste unitário de classe (`AuthScreen.test.tsx`);
  jsdom não calcula layout, então o tamanho real não foi medido no navegador.
- **AppShell sem status hardcoded (53f1161):** o widget de elenco e o badge do
  TopBar foram removidos. Resta um `Badge "Ativo"` em `AppShell.tsx:89`, mas ele só
  aparece para usuário não pendente (derivado de `isPending`, não é status
  fixo de elenco). Observação, não regressão.
- **Seleção de papel e voltar (53f1161):** `role=group` com `aria-pressed`;
  botão Voltar na etapa de posições. Coberto por `AuthScreen.test.tsx` e pelos
  specs de cadastro, que seguem verdes com os seletores atuais.
- **Seed não destrutivo (c0ffd23):** `seed.test.ts` (PGlite) passa, incluindo
  idempotência.
- **Admin no arranque (c0ffd23):** `server.ts` chama `seedAll`; `seed.test.ts`
  cobre `seedAll` (head coach + admin juntos).

## Regressão encontrada (bloqueia merge)

**Time legado habilitado continua habilitado após o seed.** O novo `seedTeams`
não desabilita times fora do catálogo. Em um banco com `NAVIGATORS`
`enabled = true` (estado anterior ao seed corrigido):

- Após `seedAll`, `SELECT code, enabled FROM team` retorna `NAVIGATORS=true` e
  `NAVS-2026=true`. Reproduzido com PGlite e `seedAll`.
- `apps/api/src/auth/routes.ts:118-123` libera o cadastro quando `team.enabled`
  é verdadeiro, então o código legado passa a aceitar cadastro (sem 409).
- `getEnabledTeamId` usa `ORDER BY created_at LIMIT 1`, então o head coach
  semeado pode cair no time legado.
- Isto contradiz a regra "NAVS-2026 é o único time habilitado" e a mensagem do
  commit `c0ffd23`. O teste `preserva time legado` afirma `enabled: true` e,
  portanto, trava o comportamento errado.

Causa provável: preservação de legado confundida com preservação de
habilitação. A correção esperada: legado preserva nome e vínculos, mas o seed
deve forçar `enabled = false` para códigos fora do catálogo (ou restringir o
cadastro ao código do catálogo habilitado).

Cobertura faltante: nenhum teste E2E nem de API cobre um código legado
habilitado. Quando o produto for corrigido, adicionar um caso em
`times.spec.ts` (esperado 409) e ajustar o teste de `seed.test.ts`.

## Veredito

**Não pronta para merge** até corrigir o time legado habilitado. O resto da
branch passa: testes, build, tsc e E2E completos, sem regressão nos fluxos
de cadastro, times e autorização.

Não houve alteração em `apps/**` nem `docs/**`. Infra local: container
`playbook-e2e-pg` (Postgres 17, porta 55432) criado para esta execução. Os
containers `navigators-playbook-*` (portas 5432 e 3000) não foram tocados; por
isso a suíte rodou com `E2E_API_PORT=3100` e `E2E_WEB_PORT=5273`.
