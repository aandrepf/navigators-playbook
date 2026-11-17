# Revisão UX 02.1 — Cadastro e Autenticação (`AuthScreen` & Onboarding SnapIn)

- **Data da revisão**: `2026-11-17` (atualizada após correções Web `9055124`/`b955761`, sincronização UX `a042469` e verificação automatizada **QA-06**)
- **Branch auditada**: `ux` após incorporação fast-forward de `review/02.1-cadastro-ui` (`0bdb89b`, sobre base `6130c65` — merge do Card 02 no `main`)
- **Escopo**: Revisão geral de UX, acessibilidade (WCAG 2.1 AA), responsividade (`390×844` mobile / `1440×1024` desktop), estados de interface, aderência ao vocabulário (`GLOSSARY.md`), paridade com o template **Figma Vega (`shadcncraft v3`)** e avaliação sob o [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) restrita ao fluxo de **Cadastro / Login (`AuthScreen`, `GoogleCallback`, `LoginErrorScreen`, `PendingStaffHome` e modal de onboarding do protótipo)**.
- **Restrições cumpridas**: Nenhuma alteração realizada em `apps/web` ou `apps/api` pela branch `ux`; Card 03 não iniciado.
- **Veredito do Gate (Pós-QA-06)**: **`Approve`** (`0` achados **S0** abertos — `3/3` resolvidos e verificados; `0` achados **S1** abertos — `7/7` resolvidos e verificados; `2/4` achados **S2** resolvidos e **`2` achados S2 pendentes em `apps/web`: `S2-03` e `S2-04`**).
  - *Nota de conformidade com o Gate (`DESIGN-POLISH-GATE.md` Seção A.4)*: `0` itens S0, `0` itens S1 e no máximo `2` itens S2 registrados, com todas as evidências `EV-01` a `EV-05` comprovadas. Não há bloqueio (`Block`) por achados já resolvidos.

---

## 1. Escopo Inspecionado e Evidências Coletadas (`EV-01` a `EV-05`)

### 1.1. Artefatos e Código Inspecionados
1. **Telas de Produto (`apps/web`)**:
   - [`apps/web/src/screens/AuthScreen.tsx`](../../apps/web/src/screens/AuthScreen.tsx) (etapas `welcome`, `email`, `code`, `role`, `player-positions`, `pending`)
   - [`apps/web/src/screens/AuthScreen.test.tsx`](../../apps/web/src/screens/AuthScreen.test.tsx) (`120/120` testes unitários Web verdes)
   - [`apps/web/src/screens/GoogleCallback.tsx`](../../apps/web/src/screens/GoogleCallback.tsx) & [`apps/web/src/screens/LoginErrorScreen.tsx`](../../apps/web/src/screens/LoginErrorScreen.tsx)
   - [`apps/web/src/screens/Home.tsx`](../../apps/web/src/screens/Home.tsx) (`PendingStaffHome`, linhas `125–167`) & [`apps/web/src/screens/Home.test.tsx`](../../apps/web/src/screens/Home.test.tsx)
   - [`apps/web/src/domain/positions.ts`](../../apps/web/src/domain/positions.ts) (`POSITIONS_BY_UNIT`)
   - [`apps/web/src/index.css`](../../apps/web/src/index.css) (tokens Vega, `.auth-*`, `.ui-btn`, `.position-toggle`, `.mono`, `.ui-input`, `.ui-field`)
2. **Primitivos da Biblioteca UI (`apps/web/src/components/ui/`)**:
   - [`primitives/button.tsx`](../../apps/web/src/components/ui/primitives/button.tsx), [`primitives/input.tsx`](../../apps/web/src/components/ui/primitives/input.tsx), [`primitives/spinner.tsx`](../../apps/web/src/components/ui/primitives/spinner.tsx), [`composed/card.tsx`](../../apps/web/src/components/ui/composed/card.tsx), [`composed/field.tsx`](../../apps/web/src/components/ui/composed/field.tsx)
3. **Documentação de Domínio, Especificação e Protótipo (`docs/` & `.scratch/`)**:
   - [`GLOSSARY.md`](../../GLOSSARY.md), [`.scratch/playbook/spec.md`](../../.scratch/playbook/spec.md), [`.scratch/playbook/issues/02-cadastro-papel-posicoes.md`](../../.scratch/playbook/issues/02-cadastro-papel-posicoes.md), [`docs/adr/0005-cadastro-aberto-com-aprovacao-staff.md`](../adr/0005-cadastro-aberto-com-aprovacao-staff.md), [`docs/adr/0007-papeis-e-validacao-de-posicoes.md`](../adr/0007-papeis-e-validacao-de-posicoes.md)
   - [`docs/design/flows/cadastro-e-papel.md`](./flows/cadastro-e-papel.md), [`docs/design/OPEN-QUESTIONS.md`](./OPEN-QUESTIONS.md), [`docs/design/DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md), [`docs/design/prototype/index.html`](./prototype/index.html) e [`docs/design/prototype/styles.css`](./prototype/styles.css)

### 1.2. Verificação em Navegador Real (Playwright Chromium — Pós-Correção & QA-06)
Após a aplicação das correções em `apps/web` (`9055124`, `b955761`) e em `docs/design` (`a042469`), a suíte E2E Playwright (`130/130` casos ativos verdes nos projetos `mobile-chromium` e `desktop-chromium`, mais validação em `390×844` e `1440×1024`) comprovou o estado renderizado das 6 etapas do `AuthScreen` e do protótipo:

| Etapa do `AuthScreen` | Mobile `390×844` (`scrollWidth <= clientWidth`) | Desktop `1440×1024` (`scrollWidth <= clientWidth`) | Estado Renderizado e Verificado (Pós-QA-06) |
| :--- | :--- | :--- | :--- |
| **1. `welcome`** (`SnapIn`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Card: `358px` (mobile) / `420px` (desktop). Botão `"Entrar com o Google"` (rótulo visível completo, `GoogleIcon` com `aria-hidden="true"` sem `role="img"`) e `"Entrar com código por e-mail"`: `height >= 44px`. |
| **2. `email`** (`Criar conta ou entrar`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Campo editável `Código do time:` (`#team-code`, valor padrão `NAVS-2026`, `maxLength=16`) + campo somente leitura `Time:` (`<output id="team-name" aria-label="Time atual: Navigators">Navigators</output>`, sem `disabled`). Inputs `#name`, `#phone`, `#email` e botões com `height >= 44px` e `font-size: 16px`. |
| **3. `code`** (`Verifique seu e-mail`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Input `#code` com classe `.mono` (`font-family: var(--font-mono)`, `font-variant-numeric: tabular-nums`, `letter-spacing: 0.12em`), `aria-describedby="code-error"` quando há erro (`401`). Botão secundário `"Reenviar código"` ainda apenas executa `setStep('email')` (**pendente `S2-04`**). |
| **4. `role`** (`Como você participa do time?`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Botões `Jogador` e `Staff` (`min-height: 72px`, `aria-pressed`) com subtítulos explicativos, renderização de `{error && <FieldError>{error}</FieldError>}` no topo e botão `Voltar` para a etapa `code`. |
| **5. `player-positions`** (`Suas posições`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | **Todos os 10 botões `.position-toggle` (`QB..OL` e `DL..S`) medem `>= 44×44px`** (`S0-01` resolvido) e exibem **prefixo `✓ ` (`✓ QB`) + fundo `var(--color-brand-primary-strong)` + texto `var(--primary-foreground)` + `box-shadow` interno** quando `aria-pressed="true"` (`S0-02` resolvido). Botões `Criar conta`, `Pular posições por agora` e `Voltar` com `height >= 44px`. |
| **6. `pending`** (`Cadastro pendente` + `PendingStaffHome`) | `390 <= 390` (Zero overflow) | `1440 <= 1440` (Zero overflow) | Etapa `pending` e `PendingStaffHome` em `Home.tsx` exibem `"Staff"` sem parênteses vazios (`Staff ()` eliminado), mencionam `"Admin ou Head Coach"` e oferecem botão direto `"Sair da conta"` (`S1-01` resolvido). |

### 1.3. Status das Evidências Mínimas do Gate (`DESIGN-POLISH-GATE.md` Seção A.2)

| Código | Evidência Mínima | Status Pós-QA-06 | Observação |
| :--- | :--- | :--- | :--- |
| **EV-01** | **Fidelidade ao Template Vega e Modos de Cor** | **Aprovada** | `apps/web/src/index.css` e `docs/design/prototype/styles.css` utilizam os tokens neutros Vega (`--primary-hover`, `--ring-focus`, `--font-mono`) e garantem contraste AA e indicador não-cromático (`✓ `) em `.position-toggle[aria-pressed='true']`. |
| **EV-02** | **Validação Responsiva (`Desktop` e `Mobile`)** | **Aprovada (com pendência S2-03)** | Zero overflow horizontal em `390×844` e `1440×1024` nas 6 etapas do `AuthScreen` e no protótipo; todos os alvos interativos medem `>= 44×44px`. Resta apenas a melhoria não bloqueante `S2-03` (`<main className="auth-layout">` + `env(safe-area-inset-*)`). |
| **EV-03** | **Variação por Papel e Permissões** | **Aprovada** | `AuthScreen` e `PendingStaffHome` separam corretamente `jogador` (ativo imediato, posições `Ofensiva`/`Defesa` opcionais com skip) e `staff` (sem escolha de subpapel no auto-cadastro, nascendo `pendente` de `Admin ou Head Coach` e com botão `Sair da conta`). |
| **EV-04** | **Completude dos Estados de Tela/Componente** | **Aprovada** | Estados `default`, `hover`, `focus-visible`, `selected` (`aria-pressed="true"` com `✓ `), `loading` (`Spinner` com label oculto `aria-hidden="true"`), `error` (`FieldError` com `role="alert"` em todas as etapas, incluindo `role`) e `pending` verificados. |
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
   - Corrigido (`S1-02`, `S2-02`): botões de `72px` agora incluem subtítulos explicativos (*"Consulto o playbook e respondo a treinos e jogos"* e *"Acesso sujeito à aprovação de um Admin ou Head Coach"*), exibem `<FieldError>` em caso de falha na requisição e contam com botão **`Voltar`** para a etapa `code`.
6. **Posições, Skip e Voltar (`player-positions`)**:
   - Corrigido (`S0-01`, `S0-02`): todos os 10 botões `.position-toggle` (`Ofensiva`: `QB`, `RB`, `FB`, `WR`, `TE`, `OL`; `Defesa`: `DL`, `LB`, `CB`, `S`) medem `>= 44×44px` reais no navegador e apresentam distinção visual e não-cromática (`✓ QB`, peso `700`, fundo `var(--color-brand-primary-strong)`, texto `var(--primary-foreground)` e `box-shadow` interno).
7. **Pendências Menores Restantes (`S2-03` e `S2-04`)**:
   - **`S2-03`**: `AuthScreen.tsx`, `GoogleCallback.tsx` e `LoginErrorScreen.tsx` ainda utilizam `<div className="auth-layout">` em vez do landmark semântico `<main className="auth-layout">`, e `.auth-layout` ainda não soma `env(safe-area-inset-top/bottom)`.
   - **`S2-04`**: Na etapa `code` (`AuthScreen.tsx:341-348`), o botão secundário chama-se `"Reenviar código"`, mas sua ação apenas executa `onClick={() => setStep('email')}` sem disparar novo envio automático nem explicitar no rótulo que voltará à etapa anterior.

---

## 3. Tabela Consolidada de Achados e Status Pós-QA-06 (`S0` / `S1` / `S2`)

### 3.1. Achados Bloqueantes (`S0` — Todos Resolvidos e Verificados)

| ID | Severidade | Pilar do Gate / Regra | Localização | Status Pós-QA-06 | Evidência de Resolução (`apps/web` + `docs/design` + `e2e`) |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S0-01** | **S0** | **Pilar 6 — Hit Areas `>= 44×44px`** (WCAG 2.5.5 / Regra obrigatória do projeto) | `apps/web/src/index.css:1554-1565` e `apps/web/src/screens/AuthScreen.tsx:464-475` | ✅ **Resolvido e verificado** | `.ui-btn[data-size='sm']` e `.ui-btn.position-toggle` agora aplicam `min-height: var(--touch-min)` (`44px`) e `min-width: var(--touch-min)` (`44px`). Verificado no Playwright (`mobile-chromium` e `desktop-chromium`) que todos os 10 botões medem `>= 44×44px`. |
| **S0-02** | **S0** | **Pilar 7 — Estados de Interação e Independência de Cor** (`aria-pressed="true"` visível e não dependente apenas de cor) | `apps/web/src/screens/AuthScreen.tsx:464-475` e `apps/web/src/index.css:1567-1573` | ✅ **Resolvido e verificado** | Posições marcadas renderizam prefixo não-cromático `✓ ` (`{positions.includes(position) ? '✓ ' + position : position}`) e estilo `.ui-btn.position-toggle[aria-pressed='true']` com fundo `var(--color-brand-primary-strong)`, texto `var(--primary-foreground)`, `font-weight: 700` e `box-shadow` interno. Confirmado em `cadastro-revisao-02-1.spec.ts`. |
| **S0-03** | **S0** | **Vocabulário Estrito do Domínio (`GLOSSARY.md`) & Alinhamento de Contrato do Código do Time** | `apps/web/src/screens/AuthScreen.tsx:206-228`, `docs/design/flows/cadastro-e-papel.md` e `docs/design/prototype/index.html` | ✅ **Resolvido e verificado** | Termo proibido *"Equipe"* removido. Etapa `email` exibe `Time: Navigators` somente leitura (`aria-label="Time atual: Navigators"`) e campo editável `Código do time:` com `NAVS-2026` por padrão, retornando à etapa `email` com alerta acessível quando a API responde `400`. |

---

### 3.2. Achados Maiores (`S1` — Todos Resolvidos e Verificados)

| ID | Severidade | Pilar do Gate / Regra | Localização | Status Pós-QA-06 | Evidência de Resolução (`apps/web` + `docs/design` + `e2e`) |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S1-01** | **S1** | **Fluxo e Estado Pendente de Staff (Coerência Pós-Cadastro)** | `apps/web/src/screens/Home.tsx:125-167` (`PendingStaffHome`) e `docs/design/prototype/index.html:201-228` | ✅ **Resolvido e verificado** | `PendingStaffHome` omite os parênteses quando `user.subRoles` é vazio (`Staff{subRolesLabel ? ' (' + subRolesLabel + ')' : ''}`), menciona `"Admin ou Head Coach"` e inclui botão `"Sair da conta"` (`onClick={() => void logout()}`). |
| **S1-02** | **S1** | **Pilar 7 — Tratamento de Erro e Navegação Reversa na Etapa `role`** | `apps/web/src/screens/AuthScreen.tsx:368-370, 421-429` | ✅ **Resolvido e verificado** | Etapa `role` renderiza `{error && <FieldError>{error}</FieldError>}` no topo do card e inclui botão `"Voltar"` (`onClick={() => setStep('code')}`). Verificado em teste E2E com falha `500` simulada e navegação reversa. |
| **S1-03** | **S1** | **Pilar 2 — Numerais Tabulares (`tabular-nums`) e Fonte Monoespaçada no Código de 6 Dígitos** | `apps/web/src/screens/AuthScreen.tsx:314-327` e `apps/web/src/index.css:136-137, 719-723` | ✅ **Resolvido e verificado** | Classe `.mono` definida em `apps/web/src/index.css` (`font-family: var(--font-mono); font-variant-numeric: tabular-nums; letter-spacing: 0.12em`) e aplicada ao `<Input id="code">`. |
| **S1-04** | **S1** | **Acessibilidade de Leitor de Tela e Rótulo Visível no Botão Google (WCAG 2.5.3 & 1.3.1)** | `apps/web/src/screens/AuthScreen.tsx:20-48, 171-180` e `apps/web/src/components/ui/primitives/button.tsx:54-59` | ✅ **Resolvido e verificado** | Botão exibe `"Entrar com o Google"` visivelmente; `GoogleIcon` não declara `role="img"` conflitante; `Button` aplica `aria-hidden={loading || undefined}` no `.ui-btn__label` quando em carregamento. |
| **S1-05** | **S1** | **Acessibilidade de Formulários — Associação Semântica de Erro e Campo Somente Leitura** | `apps/web/src/screens/AuthScreen.tsx:219-228, 314-329` | ✅ **Resolvido e verificado** | Exibição do time usa `<FieldLabel htmlFor="team-name">Time:</FieldLabel>` + `<output id="team-name" aria-label="Time atual: Navigators">Navigators</output>` sem `disabled`. Campo `#code` associa `aria-describedby={error ? 'code-error' : undefined}` ao `<FieldError id="code-error">`. |
| **S1-06** | **S1** | **EV-01 / Pilar 7 — Alinhamento de Tokens Vega em `apps/web/src/index.css`** | `apps/web/src/index.css:19-38, 59-79, 1460-1493, 1751-1755` | ✅ **Resolvido e verificado** | Adicionados `--primary-hover` e `--ring-focus` nos temas claro e escuro de `apps/web/src/index.css`; removidos `#0369a1`, `rgba(2, 132, 199, 0.28)` e `transition: transform` em `.ui-btn` e `.ui-input`. |
| **S1-07** | **S1** | **Alinhamento entre Documentação UX (`flows/cadastro-e-papel.md` & `prototype/index.html`) e Implementação do Card 02** | `docs/design/flows/cadastro-e-papel.md` e `docs/design/prototype/index.html` | ✅ **Resolvido e verificado** | Fluxo documental e `#onboarding-dialog` do protótipo sincronizados com as 6 etapas reais e os 10 botões `.position-toggle` (`>= 44×44px` verificados em `file://` nos viewports `390×844` e `1440×1024`). |

---

### 3.3. Achados Menores / Polimento (`S2` — `2` Resolvidos, `2` Pendentes até o Web Corrigir)

| ID | Severidade | Pilar do Gate / Regra | Localização Exata | Status Pós-QA-06 | Detalhamento / Ação para `apps/web` |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **S2-01** | **S2** | **Pilar 2 — `text-wrap: balance` e `text-wrap: pretty`** | `apps/web/src/index.css:1105-1116` | ✅ **Resolvido e verificado** | `.auth-card__title` aplica `text-wrap: balance` e `.auth-card__subtitle` aplica `text-wrap: pretty`. |
| **S2-02** | **S2** | **Clareza de Microcopy nos Botões de Papel (`Jogador` vs `Staff`)** | `apps/web/src/screens/AuthScreen.tsx:390-394, 414-418` | ✅ **Resolvido e verificado** | Botões `Jogador` e `Staff` na etapa `role` exibem subtítulos explicativos claros sobre acesso imediato vs. aprovação por Admin ou Head Coach. |
| **S2-03** | **S2** | **Landmarks Semânticos (`<main>`) e Áreas Seguras iOS no `.auth-layout`** | `apps/web/src/screens/AuthScreen.tsx:156, 194, 295, 357, 437, 525`, `GoogleCallback.tsx`, `LoginErrorScreen.tsx` e `apps/web/src/index.css:1079-1087` | ⏳ **Pendente (aguardando Web)** | 1. As telas deslogadas (`AuthScreen`, `GoogleCallback`, `LoginErrorScreen`) ainda renderizam `<div className="auth-layout">` em vez de `<main id="conteudo-principal" className="auth-layout">`, deixando a página sem landmark `main` (coberto por `test.fixme` em `e2e/specs/cadastro-revisao-02-1.spec.ts`).<br>2. `.auth-layout` usa `padding: var(--space-4)` fixo sem `max(var(--space-4), env(safe-area-inset-top/bottom))` para PWA instalado no iOS. |
| **S2-04** | **S2** | **Rótulo / Comportamento do Botão `"Reenviar código"` na Etapa `code`** | `apps/web/src/screens/AuthScreen.tsx:341-348` | ⏳ **Pendente (aguardando Web)** | Na etapa `code`, o botão secundário chama-se `"Reenviar código"`, mas seu `onClick={() => setStep('email')}` apenas retorna à etapa `email` sem disparar novo envio automático de código. O Web deve renomear o botão para refletir a navegação reversa (ex.: `"Alterar dados ou reenviar código"` / `"Voltar para alterar dados ou reenviar"`) ou acionar `requestEmailCode(email)` diretamente mantendo um botão `"Voltar"` explícito. |

---

## 4. Checklist de Aderência ao `DESIGN-POLISH-GATE.md` (Parte A + Adaptador Vega Parte B)

| Pilar do Gate | Status no Cadastro (`apps/web`) | Status no Protótipo (`docs/design/prototype`) | Resumo da Verificação Pós-QA-06 |
| :--- | :---: | :---: | :--- |
| **1. Tipografia & Hierarquia** | ✅ Conforme | ✅ Conforme | `font-size: 16px` em todos os `<input>` (zero auto-zoom no iOS Safari), `h1` em todas as etapas e `--font-mono` aplicado ao input `#code`. |
| **2. `tabular-nums` & `text-wrap`** | ✅ Conforme | ✅ Conforme | Input `#code` com `font-variant-numeric: tabular-nums` (`S1-03` resolvido); `.auth-card__title` com `text-wrap: balance` e `.auth-card__subtitle` com `text-wrap: pretty` (`S2-01` resolvido). |
| **3. Superfícies & Raios Concêntricos** | ✅ Conforme | ✅ Conforme | `.auth-card` (`border-radius: 14px`, `padding: 24px`) com controles internos (`border-radius: 10px` / `8px`). |
| **4. Alinhamento Óptico** | ✅ Conforme | ✅ Conforme | Botão Google exibe rótulo completo `"Entrar com o Google"` alinhado ao ícone (`S1-04` resolvido). |
| **5. Ícones `currentColor` & Peso** | ✅ Conforme | ✅ Conforme | `Spinner` usa `stroke="currentColor"`; `GoogleIcon` usa `aria-hidden="true"` sem atributos ARIA conflitantes (`S1-04` resolvido). |
| **6. Hit Areas `>= 44×44px`** | ✅ Conforme | ✅ Conforme | Todos os botões principais, inputs e os **10 botões `.position-toggle` (`QB..S`) medem `>= 44×44px` reais** no Chromium (`S0-01` resolvido). |
| **7. Estados & Independência de Cor** | ✅ Conforme | ✅ Conforme | Posições selecionadas (`aria-pressed="true"`) combinam `✓ `, peso `700`, borda/anel interno e fundo `var(--color-brand-primary-strong)` (`S0-02` resolvido); etapa `role` exibe `<FieldError>` e botão `Voltar` (`S1-02` resolvido); `:hover` e `:focus` seguem tokens Vega (`S1-06` resolvido). |
| **8. Motion Restraint & Reduced Motion** | ✅ Conforme | ✅ Conforme | `@media (prefers-reduced-motion: reduce)` presente em ambos os arquivos CSS; durações curtas (`150ms`). |
| **9. Transições Específicas (Zero `transition: all`)** | ✅ Conforme | ✅ Conforme | Nenhuma declaração de `transition: all`; `transform` ocioso removido de `.ui-btn` (`S1-06` resolvido). |
| **10. Imagens & Estabilidade de Layout (CLS)** | ✅ Conforme | ✅ Conforme | Sem salto de layout no carregamento dos botões (`Spinner` absoluto preserva largura/altura e oculta o label com `aria-hidden="true"`). |

---

## 5. Decisão Final da Revisão UX 02.1 (Pós-QA-06)

- **Contagem de Achados e Estado Atual**:
  - **S0 (Bloqueantes)**: `0` abertos (`3/3` resolvidos e verificados em `QA-06`: `S0-01`, `S0-02`, `S0-03`)
  - **S1 (Maiores)**: `0` abertos (`7/7` resolvidos e verificados em `QA-06`: `S1-01` a `S1-07`)
  - **S2 (Menores / Polimento)**: `2` resolvidos (`S2-01`, `S2-02`) e **`2` pendentes em `apps/web` (`S2-03`, `S2-04`)**
- **Decisão do Gate**: **`Approve`** (com `S2-03` e `S2-04` registrados como pendências menores para o Web corrigir)
  - Conforme a regra de decisão do [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) (Seção A.4), `0` itens S0, `0` itens S1 e `2` itens S2 (`<= 2` S2) com `EV-01` a `EV-05` comprovadas qualificam a entrega para **`Approve`**, sem declarar `Block` por achados já resolvidos.

---

## 6. Matriz de Handoff Coerente (`docs/design` vs. `apps/web` vs. `e2e`)

### 6.1. Matriz Consolidada por Achado

| ID | Severidade | Status em `docs/design/` (`flows/` + `prototype/`) | Status em `apps/web/` (Frontend) | Verificação E2E (`QA-06`) | Ação Restante para Engenharia Frontend (`apps/web`) |
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
| **S2-01** | **S2** | ✅ **Resolvido** (`text-wrap: balance/pretty`) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`index.css:1108,1115`) | Nenhuma — concluído. |
| **S2-02** | **S2** | ✅ **Resolvido** (subtítulos nos botões de papel) | ✅ **Resolvido** (`9055124`) | ✅ **Verificado** (`AuthScreen.tsx:391,415`) | Nenhuma — concluído. |
| **S2-03** | **S2** | ✅ **Documentado e especificado** | ⏳ **Pendente** | ⏸️ **`test.fixme` ativo** (`cadastro-revisao-02-1.spec.ts`) | Trocar `<div className="auth-layout">` por `<main id="conteudo-principal" className="auth-layout">` em `AuthScreen.tsx`, `GoogleCallback.tsx` e `LoginErrorScreen.tsx`, e incluir `max(var(--space-4), env(safe-area-inset-top/bottom))` em `.auth-layout`. Após corrigir, ativar o teste E2E removendo o `test.fixme`. |
| **S2-04** | **S2** | ✅ **Documentado e especificado** | ⏳ **Pendente** | ⏳ **Aguardando Web** | Em `AuthScreen.tsx:341-348` (etapa `code`), ajustar o botão `"Reenviar código"` para acionar `requestEmailCode(email)` com feedback ou renomear o botão de retorno para refletir que volta à etapa de dados/e-mail (ex.: `"Alterar e-mail ou reenviar código"`). |
