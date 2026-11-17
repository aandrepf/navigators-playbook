# Revisão UX 02.1 — Cadastro e Autenticação (`AuthScreen` & Onboarding SnapIn)

- **Data da revisão**: `2026-11-17` (atualização final após correções Web `9055124`/`b955761`/`98eeaea`/`94d4c2b`, sincronização UX `a042469` e verificação automatizada **QA-07** `e50c1bf`)
- **Branch auditada**: `ux` após incorporação fast-forward de `review/02.1-cadastro-ui` (`5b36a3a`, sobre base `6130c65` — merge do Card 02 no `main`)
- **Escopo**: Revisão geral de UX, acessibilidade (WCAG 2.1 AA), responsividade (`390×844` mobile / `1440×1024` desktop), estados de interface, aderência ao vocabulário (`GLOSSARY.md`), paridade com o template **Figma Vega (`shadcncraft v3`)** e avaliação sob o [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) restrita ao fluxo de **Cadastro / Login (`AuthScreen`, `AuthMain`, `GoogleCallback`, `LoginErrorScreen`, `PendingStaffHome` e modal de onboarding do protótipo)**.
- **Restrições cumpridas**: Nenhuma alteração realizada em `apps/web` ou `apps/api` pela branch `ux`; Card 03 não iniciado.
- **Veredito do Gate (Pós-QA-07)**: **`Approve`** (`0` achados **S0** abertos — `3/3` resolvidos e verificados; `0` achados **S1** abertos — `7/7` resolvidos e verificados; `0` achados **S2** abertos — `4/4` resolvidos e verificados).
  - *Nota de conformidade com o Gate (`DESIGN-POLISH-GATE.md` Seção A.4)*: `0` itens S0, `0` itens S1 e `0` itens S2 abertos (`14/14` achados resolvidos e verificados), com todas as evidências `EV-01` a `EV-05` comprovadas.

---

## 1. Escopo Inspecionado e Evidências Coletadas (`EV-01` a `EV-05`)

### 1.1. Artefatos e Código Inspecionados
1. **Telas de Produto (`apps/web`)**:
   - [`apps/web/src/screens/AuthScreen.tsx`](../../apps/web/src/screens/AuthScreen.tsx) (etapas `welcome`, `email`, `code`, `role`, `player-positions`, `pending`)
   - [`apps/web/src/components/AuthMain.tsx`](../../apps/web/src/components/AuthMain.tsx) (landmark `<main id="conteudo-principal" className="auth-layout">` + skip link `"Pular para o conteúdo principal"`)
   - [`apps/web/src/screens/AuthScreen.test.tsx`](../../apps/web/src/screens/AuthScreen.test.tsx) (`122/122` testes unitários Web verdes)
   - [`apps/web/src/screens/GoogleCallback.tsx`](../../apps/web/src/screens/GoogleCallback.tsx) & [`apps/web/src/screens/LoginErrorScreen.tsx`](../../apps/web/src/screens/LoginErrorScreen.tsx)
   - [`apps/web/src/screens/Home.tsx`](../../apps/web/src/screens/Home.tsx) (`PendingStaffHome`, linhas `125–167`) & [`apps/web/src/screens/Home.test.tsx`](../../apps/web/src/screens/Home.test.tsx)
   - [`apps/web/src/domain/positions.ts`](../../apps/web/src/domain/positions.ts) (`POSITIONS_BY_UNIT`)
   - [`apps/web/src/index.css`](../../apps/web/src/index.css) (tokens Vega, `.auth-*`, `.ui-btn`, `.position-toggle`, `.mono`, `.ui-input`, `.ui-field`)
2. **Primitivos da Biblioteca UI (`apps/web/src/components/ui/`)**:
   - [`primitives/button.tsx`](../../apps/web/src/components/ui/primitives/button.tsx), [`primitives/input.tsx`](../../apps/web/src/components/ui/primitives/input.tsx), [`primitives/spinner.tsx`](../../apps/web/src/components/ui/primitives/spinner.tsx), [`composed/card.tsx`](../../apps/web/src/components/ui/composed/card.tsx), [`composed/field.tsx`](../../apps/web/src/components/ui/composed/field.tsx)
3. **Documentação de Domínio, Especificação e Protótipo (`docs/` & `.scratch/`)**:
   - [`GLOSSARY.md`](../../GLOSSARY.md), [`.scratch/playbook/spec.md`](../../.scratch/playbook/spec.md), [`.scratch/playbook/issues/02-cadastro-papel-posicoes.md`](../../.scratch/playbook/issues/02-cadastro-papel-posicoes.md), [`docs/adr/0005-cadastro-aberto-com-aprovacao-staff.md`](../adr/0005-cadastro-aberto-com-aprovacao-staff.md), [`docs/adr/0007-papeis-e-validacao-de-posicoes.md`](../adr/0007-papeis-e-validacao-de-posicoes.md)
   - [`docs/design/flows/cadastro-e-papel.md`](./flows/cadastro-e-papel.md), [`docs/design/OPEN-QUESTIONS.md`](./OPEN-QUESTIONS.md), [`docs/design/DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md), [`docs/design/prototype/index.html`](./prototype/index.html) e [`docs/design/prototype/styles.css`](./prototype/styles.css)

### 1.2. Verificação em Navegador Real (Playwright Chromium — Pós-Correção & QA-07)
Após a aplicação das correções finais em `apps/web` (`9055124`, `b955761`, `98eeaea`, `94d4c2b`) e em `docs/design` (`a042469`), a suíte E2E Playwright do relatório **QA-07** (`138/138` casos ativos verdes e `0` falhas nos projetos `mobile-chromium` e `desktop-chromium`, em duas execuções consecutivas com banco limpo, além da validação em `390×844` e `1440×1024`) comprovou o estado renderizado das 6 etapas do `AuthScreen`, das telas auxiliares de entrada e do protótipo:

| Etapa do `AuthScreen` | Mobile `390×844` (`scrollWidth <= clientWidth`) | Desktop `1440×1024` (`scrollWidth <= clientWidth`) | Estado Renderizado e Verificado (Pós-QA-07) |
| :--- | :--- | :--- | :--- |
| **1. `welcome`** (`SnapIn`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Envolvida por `<AuthMain>` (`<main id="conteudo-principal" className="auth-layout">` + skip link + safe-area insets, `S2-03` resolvido). Card: `358px` (mobile) / `420px` (desktop). Botão `"Entrar com o Google"` (rótulo visível completo, `GoogleIcon` com `aria-hidden="true"` sem `role="img"`) e `"Entrar com código por e-mail"`: `height >= 44px`. |
| **2. `email`** (`Criar conta ou entrar`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Campo editável `Código do time:` (`#team-code`, valor padrão `NAVS-2026`, `maxLength=16`) + campo somente leitura `Time:` (`<output id="team-name" aria-label="Time atual: Navigators">Navigators</output>`, sem `disabled`). Inputs `#name`, `#phone`, `#email` e botões com `height >= 44px` e `font-size: 16px`. |
| **3. `code`** (`Verifique seu e-mail`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Input `#code` com classe `.mono` (`font-family: var(--font-mono)`, `font-variant-numeric: tabular-nums`, `letter-spacing: 0.12em`), `aria-describedby="code-error"` quando há erro (`401`). Botão `"Reenviar código"` aciona `requestEmailCode(email)` para o mesmo e-mail, limpa o código anterior, exibe feedback acessível (`role="status"` `"Novo código enviado para <e-mail>."` ou `role="alert"` em erro) e mantém botão `"Voltar"` dedicado para retornar à etapa `email` (`S2-04` resolvido). |
| **4. `role`** (`Como você participa do time?`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Botões `Jogador` e `Staff` (`min-height: 72px`, `aria-pressed`) com subtítulos explicativos, renderização de `{error && <FieldError>{error}</FieldError>}` no topo e botão `Voltar` para a etapa `code`. |
| **5. `player-positions`** (`Suas posições`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | **Todos os 10 botões `.position-toggle` (`QB..OL` e `DL..S`) medem `>= 44×44px`** (`S0-01` resolvido) e exibem **prefixo `✓ ` (`✓ QB`) + fundo `var(--color-brand-primary-strong)` + texto `var(--primary-foreground)` + `box-shadow` interno** quando `aria-pressed="true"` (`S0-02` resolvido). Botões `Criar conta`, `Pular posições por agora` e `Voltar` com `height >= 44px`. |
| **6. `pending`** (`Cadastro pendente` + `PendingStaffHome`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Etapa `pending` e `PendingStaffHome` em `Home.tsx` exibem `"Staff"` sem parênteses vazios (`Staff ()` eliminado), mencionam `"Admin ou Head Coach"` e oferecem botão direto `"Sair da conta"` (`S1-01` resolvido). |

### 1.3. Status das Evidências Mínimas do Gate (`DESIGN-POLISH-GATE.md` Seção A.2)

| Código | Evidência Mínima | Status Pós-QA-07 | Observação |
| :--- | :--- | :---: | :--- |
| **EV-01** | **Fidelidade ao Template Vega e Modos de Cor** | **Aprovada** | `apps/web/src/index.css` e `docs/design/prototype/styles.css` utilizam os tokens neutros Vega (`--primary-hover`, `--ring-focus`, `--font-mono`) e garantem contraste AA e indicador não-cromático (`✓ `) em `.position-toggle[aria-pressed='true']`. |
| **EV-02** | **Validação Responsiva (`Desktop` e `Mobile`)** | **Aprovada** | Zero overflow horizontal em `390×844` e `1440×1024` nas 6 etapas do `AuthScreen` e no protótipo; todos os alvos interativos medem `>= 44×44px`; landmark `<main id="conteudo-principal">` + skip link (`AuthMain`) e `max(var(--space-4), env(safe-area-inset-*))` ativos em `.auth-layout` (`S2-03` resolvido). |
| **EV-03** | **Variação por Papel e Permissões** | **Aprovada** | `AuthScreen` e `PendingStaffHome` separam corretamente `jogador` (ativo imediato, posições `Ofensiva`/`Defesa` opcionais com skip) e `staff` (sem escolha de subpapel no auto-cadastro, nascendo `pendente` de `Admin ou Head Coach` e com botão `Sair da conta`). |
| **EV-04** | **Completude dos Estados de Tela/Componente** | **Aprovada** | Estados `default`, `hover`, `focus-visible`, `selected` (`aria-pressed="true"` com `✓ `), `loading` (`Spinner` com label oculto `aria-hidden="true"`), `status` de reenvio (`role="status"`), `error` (`FieldError` / `role="alert"` em todas as etapas) e `pending` verificados. |
| **EV-05** | **Rastreabilidade Figma → Componente** | **Aprovada** | `AuthScreen` utiliza `Card`, `CardHeader`, `CardDescription`, `Field`, `FieldLabel`, `FieldHint`, `FieldError`, `Input`, `Button` e `Spinner` mapeados na matriz `FIGMA-REACT-MATRIX.md`. |

---

## 2. Síntese da Verificação por Item do Fluxo de Cadastro

1. **`AuthScreen` e Fluxo Manual (`welcome` → `email` → `code` → `role` → `player-positions` / `pending`)**:
   - Fluxo sincronizado entre `apps/web/src/screens/AuthScreen.tsx`, `docs/design/flows/cadastro-e-papel.md` e `docs/design/prototype/index.html` (`#onboarding-dialog`).
   - Tratamento de erros validado por testes automatizados: código de 6 dígitos inválido (`401`) retorna à etapa `code` preservando os dados preenchidos e vinculando `aria-describedby="code-error"`; código do time inválido/indisponível (`400`/`409`) retorna à etapa `email` com alerta acessível; erro de servidor/rede (`500`) ao confirmar `Staff` ou `Jogador` exibe `<FieldError>` na própria etapa (`role` ou `player-positions`).
2. **Botão Google (`welcome`, `GoogleCallback`, `LoginErrorScreen`)**:
   - Corrigido (`S1-04`): o botão na etapa `welcome` exibe o rótulo completo **`"Entrar com o Google"`**, `GoogleIcon` não possui mais `role="img"` conflitante com `aria-hidden="true"`, e `Button.tsx` aplica `aria-hidden={loading || undefined}` ao `.ui-btn__label` durante o carregamento.
3. **Time `Navigators` Somente Leitura e Campo Editável `Código do time` (`NAVS-2026`)**:
   - Corrigido (`S0-03`, `S1-05`): a etapa `email` exibe `<FieldLabel htmlFor="team-code">Código do time:</FieldLabel>` com `<Input id="team-code" value={teamCode} ... />` (iniciado em `NAVS-2026`, editável) **e** `<FieldLabel htmlFor="team-name">Time:</FieldLabel>` associado a `<output id="team-name" className="auth-readonly-value" aria-label="Time atual: Navigators">Navigators</output>`, eliminando o termo proibido *"Equipe"* (`GLOSSARY.md`) e o estado `disabled` indevido.
4. **Campo Telefone**:
   - `<Input id="phone" type="tel" autoComplete="tel" placeholder="(11) 91234-5678" />` com `min-height: 44px` e `font-size: 16px`, sem menção a WhatsApp. Conforme.
5. **Escolha `Jogador` / `Staff` (`role`)**:
   - Corrigido (`S1-02`, `S2-02`): botões de `72px` incluem subtítulos explicativos (*"Consulto o playbook e respondo a treinos e jogos"* e *"Acesso sujeito à aprovação de um Admin ou Head Coach"*), exibem `<FieldError>` em caso de falha na requisição e contam com botão **`Voltar`** para a etapa `code`.
6. **Posições, Skip e Voltar (`player-positions`)**:
   - Corrigido (`S0-01`, `S0-02`): todos os 10 botões `.position-toggle` (`Ofensiva`: `QB`, `RB`, `FB`, `WR`, `TE`, `OL`; `Defesa`: `DL`, `LB`, `CB`, `S`) medem `>= 44×44px` reais no navegador e apresentam distinção visual e não-cromática (`✓ QB`, peso `700`, fundo `var(--color-brand-primary-strong)`, texto `var(--primary-foreground)` e `box-shadow` interno).
7. **Landmarks Semânticos (`<main>`), Safe-Area iOS e Reenvio Real de Código (`S2-03` e `S2-04` Resolvidos)**:
   - **Corrigido (`S2-03`)**: `AuthMain.tsx` encapsula todas as etapas de `AuthScreen.tsx`, `GoogleCallback.tsx`, `LoginErrorScreen.tsx` e o estado de carregamento inicial de `App.tsx` com `<a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>` e `<main id="conteudo-principal" className="auth-layout" tabIndex={-1}>`. Em `apps/web/src/index.css:1088-1091`, `.auth-layout` aplica `max(var(--space-4), env(safe-area-inset-top/bottom/left/right))`.
   - **Corrigido (`S2-04`)**: Na etapa `code` (`AuthScreen.tsx:353-396`), o botão `"Reenviar código"` executa `handleResendCode()` chamando `requestEmailCode(email)` sem sair da etapa, limpa o input de código, exibe confirmação acessível (`role="status"` `"Novo código enviado para <e-mail>."`) ou erro (`role="alert"`), e coexiste com o botão `"Voltar"` (`variant="ghost"`) que retorna à etapa `email`.

---

## 3. Tabela Consolidada de Achados e Status Pós-QA-07 (`S0` / `S1` / `S2`)

### 3.1. Achados Bloqueantes (`S0` — Todos Resolvidos e Verificados)

| ID | Severidade | Pilar do Gate / Regra | Localização | Status Pós-QA-07 | Evidência de Resolução (`apps/web` + `docs/design` + `e2e`) |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S0-01** | **S0** | **Pilar 6 — Hit Areas `>= 44×44px`** (WCAG 2.5.5 / Regra obrigatória do projeto) | `apps/web/src/index.css:1572-1583` e `apps/web/src/screens/AuthScreen.tsx:498-510` | ✅ **Resolvido e verificado** | `.ui-btn[data-size='sm']` e `.ui-btn.position-toggle` aplicam `min-height: var(--touch-min)` (`44px`) e `min-width: var(--touch-min)` (`44px`). Verificado no Playwright (`mobile-chromium` e `desktop-chromium`) que todos os 10 botões medem `>= 44×44px`. |
| **S0-02** | **S0** | **Pilar 7 — Estados de Interação e Independência de Cor** (`aria-pressed="true"` visível e não dependente apenas de cor) | `apps/web/src/screens/AuthScreen.tsx:498-510` e `apps/web/src/index.css:1585-1591` | ✅ **Resolvido e verificado** | Posições marcadas renderizam prefixo não-cromático `✓ ` (`{positions.includes(position) ? '✓ ' + position : position}`) e estilo `.ui-btn.position-toggle[aria-pressed='true']` com fundo `var(--color-brand-primary-strong)`, texto `var(--primary-foreground)`, `font-weight: 700` e `box-shadow` interno. Confirmado em `cadastro-revisao-02-1.spec.ts`. |
| **S0-03** | **S0** | **Vocabulário Estrito do Domínio (`GLOSSARY.md`) & Alinhamento de Contrato do Código do Time** | `apps/web/src/screens/AuthScreen.tsx:227-249`, `docs/design/flows/cadastro-e-papel.md` e `docs/design/prototype/index.html` | ✅ **Resolvido e verificado** | Termo proibido *"Equipe"* removido. Etapa `email` exibe `Time: Navigators` somente leitura (`aria-label="Time atual: Navigators"`) e campo editável `Código do time:` com `NAVS-2026` por padrão, retornando à etapa `email` com alerta acessível quando a API responde `400`. |

---

### 3.2. Achados Maiores (`S1` — Todos Resolvidos e Verificados)

| ID | Severidade | Pilar do Gate / Regra | Localização | Status Pós-QA-07 | Evidência de Resolução (`apps/web` + `docs/design` + `e2e`) |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S1-01** | **S1** | **Fluxo e Estado Pendente de Staff (Coerência Pós-Cadastro)** | `apps/web/src/screens/Home.tsx:125-167` (`PendingStaffHome`) e `docs/design/prototype/index.html:201-228` | ✅ **Resolvido e verificado** | `PendingStaffHome` omite os parênteses quando `user.subRoles` é vazio (`Staff{subRolesLabel ? ' (' + subRolesLabel + ')' : ''}`), menciona `"Admin ou Head Coach"` e inclui botão `"Sair da conta"` (`onClick={() => void logout()}`). |
| **S1-02** | **S1** | **Pilar 7 — Tratamento de Erro e Navegação Reversa na Etapa `role`** | `apps/web/src/screens/AuthScreen.tsx:416-418, 469-477` | ✅ **Resolvido e verificado** | Etapa `role` renderiza `{error && <FieldError>{error}</FieldError>}` no topo do card e inclui botão `"Voltar"` (`onClick={() => setStep('code')}`). Verificado em teste E2E com falha `500` simulada e navegação reversa. |
| **S1-03** | **S1** | **Pilar 2 — Numerais Tabulares (`tabular-nums`) e Fonte Monoespaçada no Código de 6 Dígitos** | `apps/web/src/screens/AuthScreen.tsx:338-351` e `apps/web/src/index.css:136-137, 719-723` | ✅ **Resolvido e verificado** | Classe `.mono` definida em `apps/web/src/index.css` (`font-family: var(--font-mono); font-variant-numeric: tabular-nums; letter-spacing: 0.12em`) e aplicada ao `<Input id="code">`. |
| **S1-04** | **S1** | **Acessibilidade de Leitor de Tela e Rótulo Visível no Botão Google (WCAG 2.5.3 & 1.3.1)** | `apps/web/src/screens/AuthScreen.tsx:21-49, 192-201` e `apps/web/src/components/ui/primitives/button.tsx:54-59` | ✅ **Resolvido e verificado** | Botão exibe `"Entrar com o Google"` visivelmente; `GoogleIcon` não declara `role="img"` conflitante; `Button` aplica `aria-hidden={loading || undefined}` no `.ui-btn__label` quando em carregamento. |
| **S1-05** | **S1** | **Acessibilidade de Formulários — Associação Semântica de Erro e Campo Somente Leitura** | `apps/web/src/screens/AuthScreen.tsx:240-249, 338-353` | ✅ **Resolvido e verificado** | Exibição do time usa `<FieldLabel htmlFor="team-name">Time:</FieldLabel>` + `<output id="team-name" aria-label="Time atual: Navigators">Navigators</output>` sem `disabled`. Campo `#code` associa `aria-describedby={error ? 'code-error' : undefined}` ao `<FieldError id="code-error">`. |
| **S1-06** | **S1** | **EV-01 / Pilar 7 — Alinhamento de Tokens Vega em `apps/web/src/index.css`** | `apps/web/src/index.css:19-38, 59-79, 1478-1511, 1769-1773` | ✅ **Resolvido e verificado** | Adicionados `--primary-hover` e `--ring-focus` nos temas claro e escuro de `apps/web/src/index.css`; removidos `#0369a1`, `rgba(2, 132, 199, 0.28)` e `transition: transform` em `.ui-btn` e `.ui-input`. |
| **S1-07** | **S1** | **Alinhamento entre Documentação UX (`flows/cadastro-e-papel.md` & `prototype/index.html`) e Implementação do Card 02** | `docs/design/flows/cadastro-e-papel.md` e `docs/design/prototype/index.html` | ✅ **Resolvido e verificado** | Fluxo documental e `#onboarding-dialog` do protótipo sincronizados com as 6 etapas reais e os 10 botões `.position-toggle` (`>= 44×44px` verificados em `file://` nos viewports `390×844` e `1440×1024`). |

---

### 3.3. Achados Menores / Polimento (`S2` — Todos Resolvidos e Verificados)

| ID | Severidade | Pilar do Gate / Regra | Localização Exata | Status Pós-QA-07 | Evidência de Resolução (`apps/web` + `e2e`) |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S2-01** | **S2** | **Pilar 2 — `text-wrap: balance` e `text-wrap: pretty`** | `apps/web/src/index.css:1109-1121` | ✅ **Resolvido e verificado** | `.auth-card__title` aplica `text-wrap: balance` e `.auth-card__subtitle` aplica `text-wrap: pretty`. |
| **S2-02** | **S2** | **Clareza de Microcopy nos Botões de Papel (`Jogador` vs `Staff`)** | `apps/web/src/screens/AuthScreen.tsx:438-442, 462-466` | ✅ **Resolvido e verificado** | Botões `Jogador` e `Staff` na etapa `role` exibem subtítulos explicativos claros sobre acesso imediato vs. aprovação por Admin ou Head Coach. |
| **S2-03** | **S2** | **Landmarks Semânticos (`<main>` + Skip Link) e Áreas Seguras iOS no `.auth-layout`** | `apps/web/src/components/AuthMain.tsx:1-12`, `AuthScreen.tsx`, `GoogleCallback.tsx`, `LoginErrorScreen.tsx`, `App.tsx` e `apps/web/src/index.css:1081-1092` | ✅ **Resolvido e verificado** | Componente `AuthMain` criado em `98eeaea` renderizando `<a href="#conteudo-principal" className="skip-link">` e `<main id="conteudo-principal" className="auth-layout" tabIndex={-1}>` em todas as telas de entrada; `.auth-layout` aplica `max(var(--space-4), env(safe-area-inset-top/bottom/left/right))`. Testes E2E de landmark e skip link ativos e verdes em `e2e/specs/cadastro-revisao-02-1.spec.ts` e `e2e/specs/acessibilidade.spec.ts` (`QA-07`). |
| **S2-04** | **S2** | **Rótulo e Comportamento Real do Botão `"Reenviar código"` na Etapa `code`** | `apps/web/src/screens/AuthScreen.tsx:114-129, 353-396` e `apps/web/src/index.css:1132-1147` | ✅ **Resolvido e verificado** | Implementado em `94d4c2b`: botão `"Reenviar código"` chama `handleResendCode()` (`requestEmailCode(email)`), invalida o código anterior, limpa o campo `#code` e exibe `role="status"` (`"Novo código enviado para <e-mail>."`) ou `role="alert"` em falha, separado do botão `"Voltar"` (`setStep('email')`). Coberto por testes unitários (`AuthScreen.test.tsx`) e E2E (`cadastro-revisao-02-1.spec.ts`, `QA-07`). |

> **Observação de polimento futuro (S3 — não contabilizado na severidade do Gate, ref. `QA-07` Seção 6)**: O componente `Spinner` interno do `Button` durante o estado `loading` utiliza `role="status"`, coexistindo momentaneamente com mensagens de resultado que também usam `role="status"`. Não bloqueia o fluxo nem viola o gate; fica registrado como sugestão opcional de polimento para `primitives/button.tsx` ocultar o `Spinner` com `aria-hidden="true"` quando o próprio botão já anuncia `loadingLabel`.

---

## 4. Checklist de Aderência ao `DESIGN-POLISH-GATE.md` (Parte A + Adaptador Vega Parte B)

| Pilar do Gate | Status no Cadastro (`apps/web`) | Status no Protótipo (`docs/design/prototype`) | Resumo da Verificação Pós-QA-07 |
| :--- | :---: | :---: | :--- |
| **1. Tipografia & Hierarquia** | ✅ Conforme | ✅ Conforme | `font-size: 16px` em todos os `<input>` (zero auto-zoom no iOS Safari), `h1` em todas as etapas e `--font-mono` aplicado ao input `#code`. |
| **2. `tabular-nums` & `text-wrap`** | ✅ Conforme | ✅ Conforme | Input `#code` com `font-variant-numeric: tabular-nums` (`S1-03` resolvido); `.auth-card__title` com `text-wrap: balance` e `.auth-card__subtitle` com `text-wrap: pretty` (`S2-01` resolvido). |
| **3. Superfícies & Raios Concêntricos** | ✅ Conforme | ✅ Conforme | `.auth-card` (`border-radius: 14px`, `padding: 24px`) com controles internos (`border-radius: 10px` / `8px`). |
| **4. Alinhamento Óptico** | ✅ Conforme | ✅ Conforme | Botão Google exibe rótulo completo `"Entrar com o Google"` alinhado ao ícone (`S1-04` resolvido). |
| **5. Ícones `currentColor` & Peso** | ✅ Conforme | ✅ Conforme | `Spinner` usa `stroke="currentColor"`; `GoogleIcon` usa `aria-hidden="true"` sem atributos ARIA conflitantes (`S1-04` resolvido). |
| **6. Hit Areas `>= 44×44px`** | ✅ Conforme | ✅ Conforme | Todos os botões principais, inputs e os **10 botões `.position-toggle` (`QB..S`) medem `>= 44×44px` reais** no Chromium (`S0-01` resolvido). |
| **7. Estados & Independência de Cor** | ✅ Conforme | ✅ Conforme | Posições selecionadas (`aria-pressed="true"`) combinam `✓ `, peso `700`, borda/anel interno e fundo `var(--color-brand-primary-strong)` (`S0-02` resolvido); etapa `role` exibe `<FieldError>` e botão `Voltar` (`S1-02` resolvido); etapa `code` reenvia código com `role="status"` e botão `Voltar` (`S2-04` resolvido); `:hover` e `:focus` seguem tokens Vega (`S1-06` resolvido). |
| **8. Motion Restraint & Reduced Motion** | ✅ Conforme | ✅ Conforme | `@media (prefers-reduced-motion: reduce)` presente em ambos os arquivos CSS; durações curtas (`150ms`). |
| **9. Transições Específicas (Zero `transition: all`)** | ✅ Conforme | ✅ Conforme | Nenhuma declaração de `transition: all`; `transform` ocioso removido de `.ui-btn` (`S1-06` resolvido). |
| **10. Imagens & Estabilidade de Layout (CLS)** | ✅ Conforme | ✅ Conforme | Sem salto de layout no carregamento dos botões (`Spinner` absoluto preserva largura/altura e oculta o label com `aria-hidden="true"`). |

---

## 5. Decisão Final da Revisão UX 02.1 (Pós-QA-07)

- **Contagem de Achados e Estado Atual**:
  - **S0 (Bloqueantes)**: `0` abertos (`3/3` resolvidos e verificados: `S0-01`, `S0-02`, `S0-03`)
  - **S1 (Maiores)**: `0` abertos (`7/7` resolvidos e verificados: `S1-01` a `S1-07`)
  - **S2 (Menores / Polimento)**: `0` abertos (`4/4` resolvidos e verificados em `QA-07`: `S2-01` a `S2-04`)
- **Decisão do Gate**: **`Approve`** (`0` S0, `0` S1 e `0` S2 abertos — `14/14` itens concluídos e verificados)
  - Conforme a regra de decisão do [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) (Seção A.4), `0` itens S0, `0` itens S1 e `0` itens S2 abertos (`<= 2` S2) com `EV-01` a `EV-05` integralmente comprovadas e `138/138` testes E2E verdes no relatório `QA-07` encerram a revisão `02.1` com veredito **`Approve`**.

---

## 6. Matriz de Handoff Coerente (`docs/design` vs. `apps/web` vs. `e2e`)

### 6.1. Matriz Consolidada por Achado

| ID | Severidade | Status em `docs/design/` (`flows/` + `prototype/`) | Status em `apps/web/` (Frontend) | Verificação E2E (`QA-07`) | Ação Restante para Engenharia Frontend (`apps/web`) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **S0-01** | **S0** | ✅ **Resolvido** (`44×44px` no protótipo) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`cadastro-revisao-02-1.spec.ts`) | Nenhuma — concluído. |
| **S0-02** | **S0** | ✅ **Resolvido** (`data-variant="default"` + `✓ `) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`✓ QB` + contraste de fundo) | Nenhuma — concluído. |
| **S0-03** | **S0** | ✅ **Resolvido** (`Time: Navigators` + `Código do time`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`cadastro.spec.ts` + `400` alerta) | Nenhuma — concluído. |
| **S1-01** | **S1** | ✅ **Resolvido** (`.pending-staff-only` sem `()`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`cadastro-revisao-02-1.spec.ts`) | Nenhuma — concluído. |
| **S1-02** | **S1** | ✅ **Resolvido** (`Voltar` + erro na etapa 4) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`Voltar` + erro `500` em `role`) | Nenhuma — concluído. |
| **S1-03** | **S1** | ✅ **Resolvido** (`.mono.tabular` em `#auth-code-input`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`tabular-nums` computado) | Nenhuma — concluído. |
| **S1-04** | **S1** | ✅ **Resolvido** (`Entrar com o Google`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`cadastro-revisao-02-1.spec.ts`) | Nenhuma — concluído. |
| **S1-05** | **S1** | ✅ **Resolvido** (`readonly` + `aria-describedby`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`<output>` + `aria-describedby`) | Nenhuma — concluído. |
| **S1-06** | **S1** | ✅ **Resolvido** (`docs/design/prototype/styles.css`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`--primary-hover` / `--ring-focus`) | Nenhuma — concluído. |
| **S1-07** | **S1** | ✅ **Resolvido** (`flows/cadastro-e-papel.md` + `prototype/index.html`) | ✅ **N/A (Escopo UX)** | ✅ **Verificado** (protótipo inspecionado em `file://`) | Nenhuma — concluído. |
| **S2-01** | **S2** | ✅ **Resolvido** (`text-wrap: balance/pretty`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`index.css:1113,1120`) | Nenhuma — concluído. |
| **S2-02** | **S2** | ✅ **Resolvido** (subtítulos nos botões de papel) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`AuthScreen.tsx:439,463`) | Nenhuma — concluído. |
| **S2-03** | **S2** | ✅ **Resolvido** (documentado e especificado) | ✅ **Resolvido** (`98eeaea` — `AuthMain.tsx` + `safe-area-inset-*`) | ✅ **Verificado** (`cadastro-revisao-02-1.spec.ts` + `acessibilidade.spec.ts`) | Nenhuma — concluído. |
| **S2-04** | **S2** | ✅ **Resolvido** (`Reenviar código` + `Voltar` separados) | ✅ **Resolvido** (`94d4c2b` — `handleResendCode` + `Voltar`) | ✅ **Verificado** (`cadastro-revisao-02-1.spec.ts`, `e50c1bf`) | Nenhuma — concluído. |
