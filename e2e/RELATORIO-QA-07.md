# Relatório QA-07 — QA final 02.1 do cadastro (após correções finais)

Data: 2026-11-17. Branch `qa`. Incorporação de `review/02.1-cadastro-ui` em `5b36a3a`
(merge `4afec6e`, `--no-ff`). A branch trouxe as correções finais do web (`98eeaea` S2-03
landmark `main` e skip link; `94d4c2b` S2-04 reenvio real de código), os testes de `4d17eb8`
e `7e8c7b4`, e a aprovação de UX `af13d68`/`5b36a3a`.

**Veredito: Approve.** Nenhum S0 e nenhum S1 abertos; S2 abertos: 0 (S2-03 e S2-04 foram
corrigidos e verificados). Uma pendência de registro não bloqueia o gate: o
`docs/design/REVIEW-02.1-CADASTRO-UI.md` ainda diz que S2-03 e S2-04 estão pendentes (ver seção 4).

## 1. Conflitos da incorporação

Três arquivos em conflito, resolvidos assim:

- `e2e/specs/cadastro.spec.ts`: mantida a versão da `qa` (mais estrita: `Equipe` ausente,
  `Código do time` editável). Equivalente à da branch em cobertura.
- `e2e/specs/cadastro-revisao-02-1.spec.ts`: adotada a versão da branch (inclui reenvio,
  Voltar da etapa do código e landmark `main` sem `fixme`). Superset da versão da `qa`.
- `e2e/support/pages/auth-page.ts`: merge automático, sem conflito semântico.

## 2. Resultados

| Verificação | Resultado |
| --- | --- |
| `npm test` (api 31/31, web 122/122) | verde, exit 0 |
| `npm run build` (api tsc + web tsc -b + vite) | verde, exit 0 |
| `npm run lint` (oxlint) | 0 erros; 1 aviso pré-existente `AuthProvider.tsx:55` |
| `tsc -p e2e/tsconfig.json --noEmit` | verde, exit 0 |
| Playwright, Postgres 17 em Podman, `playbook_e2e` zerado antes de cada execução | ver abaixo |

| Execução | Verdes | Vermelhos | `fixme` (skipped) |
| --- | --- | --- | --- |
| 1 (primeira tentativa, com spec antigo de reenvio) | 136 | 2 | 30 |
| 1 (após correção de seletor do teste de reenvio) | 138 | 0 | 30 |
| 2 (banco zerado de novo) | 138 | 0 | 30 |

Projetos: `mobile-chromium` (Pixel 7) e `desktop-chromium` (1280×800). Podman rodou só o
Postgres; API e web subiram no host via `webServer`. A tentativa 1 falhou por seletor
ambíguo no teste de reenvio, não por produto (ver seção 3).

## 3. Achado de teste corrigido nesta rodada

- `cadastro-revisao-02-1.spec.ts` (reenvio, S2-04): `getByRole('status')` casava com dois
  elementos (o `Spinner` dos botões `Verificando...`/`Reenviando...` também tem `role="status"`).
  Corrigido para `getByRole('status').filter({ hasText: /novo código enviado/i })`.
  A mensagem de produto (`Novo código enviado para <e-mail>.`) estava correta.

## 4. Achados × evidência automatizada

| ID | Achado | Status | Evidência |
| --- | --- | --- | --- |
| S0-01 | Alvos de posição 36px | Resolvido | 10 botões ≥ 44×44px (ambos projetos) |
| S0-02 | Posição marcada sem indicador | Resolvido | `✓ QB` no nome acessível, `aria-pressed`, fundo distinto |
| S0-03 | "Equipe" e código fixo | Resolvido | `Time atual: Navigators` somente leitura; `Código do time` editável = `NAVS-2026`; código inválido volta à etapa de dados |
| S1-01 | `Staff ()` na Home pendente | Resolvido | teste de staff pendente, `Admin ou Head Coach`, `Sair da conta` |
| S1-02 | Sem Voltar / erro na etapa de papel | Resolvido | teste de Voltar e `alert` com 500 na etapa de papel |
| S1-03 | Código sem numerais tabulares | Resolvido | `font-variant-numeric: tabular-nums` |
| S1-04 | Google com texto truncado | Resolvido | nome acessível `Entrar com o Google` |
| S1-05 | Campo de time `disabled` | Resolvido | campo somente leitura não é `disabled` |
| S1-06 | Hover/focus azul legado | Resolvido | tokens Vega (sem asserção dedicada de cor; ver riscos) |
| S1-07 | Fluxo/protótipo fora de ordem | Resolvido em `docs/design` | verificado por leitura |
| S2-01 | `text-wrap` ausente | Resolvido | `index.css` |
| S2-02 | Microcopy dos botões de papel | Resolvido | subtítulos em Jogador e Staff |
| S2-03 | Sem `<main>` nas telas de entrada | **Resolvido** | teste `landmarks das telas de entrada` ativo e verde; `AuthMain` renderiza `<main id="conteudo-principal">` + skip link |
| S2-03b | Safe-area no `.auth-layout` | **Resolvido** | `index.css:1088-1090` usa `max(..., env(safe-area-inset-*))` dentro de `.auth-layout` (leitura de código) |
| S2-04 | `Reenviar código` só voltava ao e-mail | **Resolvido** | teste de reenvio verde: novo código para o mesmo e-mail, código novo conclui o cadastro; `Voltar` tem teste próprio |

Targets e estado de posição, código `NAVS-2026`/Time Navigators, staff pendente e
autorização por papel: cobertos pelos testes acima e pelos demais specs, todos verdes.

## 5. Design Polish Gate (`docs/design/DESIGN-POLISH-GATE.md`, A.4)

- S0: 0 abertos. S1: 0 abertos. S2: 0 abertos (era 2; ambos corrigidos).
- Evidências EV-01 a EV-05: presentes; EV-02 sustentada pelo Playwright (overflow, alvos).
- Regra de decisão: `Approve` (0 S0, 0 S1, ≤ 2 S2).

**Pendência de registro (para UX, não é S0/S1/S2 de produto):**
`docs/design/REVIEW-02.1-CADASTRO-UI.md` não foi atualizado após `98eeaea`/`94d4c2b`.
Ainda diz que S2-03 e S2-04 estão `⏳ Pendente (aguardando Web)`, que a EV-02 tem
pendência S2-03, e que `e2e` tem `test.fixme` de landmark (já removido). Ação: UX atualiza
seções 1.2, 1.3, 2 (item 7), 3.2 (S2-03/S2-04) e 5 com o estado atual, e registra
`Approve` com 0 S2 abertos.

Não editei `docs/design` (fora do escopo de QA).

## 6. Observação de acessibilidade (não conta na severidade)

O `Spinner` (`role="status"`, `aria-label="Verificando..."`) fica dentro do botão durante o
loading. Ele gera duas regiões `status` ao mesmo tempo (o spinner e a mensagem de sucesso).
Não quebra o fluxo, mas causa ambiguidade para leitor de tela e para o próprio teste. Sugestão
para web: usar `aria-hidden` ou `role="img"` com rótulo no spinner interno do botão, deixando
`role="status"` só para mensagens de resultado. Registrar como S3 de polimento.

## 7. Riscos e limites

- Sem checagem automatizada de contraste nem axe-core (já registrado no README).
- Hover/focus e tokens de cor (S1-06) são verificados por leitura de CSS, não por teste.
- O erro 500 do Staff é simulado por `page.route`, o único mock desta rodada.
- Login Google real segue fora (depende de credenciais externas).
- Os 30 `fixme` (15 × 2) são dependências explícitas (presença, playbook, game plan,
  autorização, perfil de posições pendentes), não falhas do cadastro.

## 8. Commits desta rodada

- `Merge branch 'review/02.1-cadastro-ui' into qa` (`4afec6e`).
- Correção do seletor de reenvio, README e este relatório, em commits Conventional Commits
  (`test(e2e): ...` e `docs(e2e): ...`).
