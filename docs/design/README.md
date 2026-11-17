# Sistema de Design — Playbook do Time

Especificação visual, tokens, arquitetura de componentes, acessibilidade e handoff para o frontend do **Playbook do Time** (web app PWA mobile-first para gestão de playbook, eventos, presença, marcação, game plan e status do elenco de um time de futebol americano).

---

## 1. Princípios de Design

1. **Mobile-first de beira de campo**: desenhado primeiro para operação com uma mão no celular (`360px–430px`), sob luz solar direta ou vestiário, com barra de navegação inferior fixa respeitando as áreas seguras do iOS (`env(safe-area-inset-bottom)`). No desktop (`>= 1024px`), expande-se com navegação lateral fixa para o trabalho tático do staff (montagem de game plan, gestão do elenco e revisão do playbook).
2. **Clareza tática imediata**: hierarquia tipográfica forte, números tabulares para down/distância, prazos e contagens consolidadas, e distinção inequívoca entre **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`), **presença** (treino) e **marcação / disponibilidade** (jogo).
3. **Autorização e privacidade refletidas na interface**: o jogador nunca vê a aba **Elenco** na navegação principal, nunca vê a **justificativa** de ausência de outros jogadores (vê apenas "Ausente"), e nunca vê controles de edição de jogadas, eventos, game plan ou status do elenco. Membros do staff com cadastro **pendente** veem um estado dedicado de bloqueio informativo até aprovação por um head coach.
4. **Acessibilidade inegociável (WCAG 2.1 AA)**: contraste mínimo de `4.5:1` para texto normal e `3:1` para elementos gráficos e texto grande; alvos de toque mínimos de `44×44px`; foco visível de alto contraste em todos os elementos interativos; nenhum estado transmitido apenas por cor (sempre cor + variante + rótulo textual).
5. **Vocabulário estrito do domínio**: toda a interface utiliza exclusivamente os termos definidos em `GLOSSARY.md` (**jogada**, **playbook**, **unidade**, **posição**, **atribuição**, **formação**, **situação**, **game plan**, **time**, **elenco**, **jogador**, **staff**, **papel**, **subpapel**, **coordenador de special teams**, **pendente**, **status do elenco**, **lesionado**, **reformado**, **evento**, **presença**, **marcação**, **disponibilidade**, **justificativa**).

---

## 2. Tokens de Design (CSS Custom Properties)

Os tokens abaixo são a fonte única de estilo em `docs/design/prototype/styles.css` e devem ser copiados diretamente pelo frontend em `apps/web`.

### 2.1. Cores e Contraste (WCAG AA — Vega Light Padrão & Vega Dark Alternativo)

Extraídos diretamente das 3 coleções de variáveis da sessão autenticada do Figma ([`FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md): `Tailwind` → `Style: Vega` → `Mode: Light & Dark`) e sincronizados com a biblioteca React P0 em [`apps/web/src/components/ui/`](../../apps/web/src/components/ui/README.md). O modo **Vega Light (`[data-theme="light"]`)** é o padrão de abertura (sem estética genérica de IA ou quadro tático neon), com **Vega Dark (`[data-theme="dark"]`)** como alternativo.

| Token Semântico (`Mode`) | Alias de Domínio | Valor em `Vega Light` (Padrão) | Valor em `Vega Dark` (Alternativo) | Uso Semântico & Contraste WCAG AA |
| :--- | :--- | :--- | :--- | :--- |
| `--background` / `--canvas` | `--color-bg-canvas` | `#FFFFFF` / `#FAFAFA` | `#0A0A0A` | Superfície de fundo principal da aplicação |
| `--card` | `--color-bg-surface` | `#FFFFFF` | `#171717` (`neutral-900`) | Cartões de evento, jogada, elenco e painéis |
| `--foreground` / `--card-foreground` | `--color-text-primary` | `#0A0A0A` (`neutral-950`) | `#FAFAFA` (`neutral-50`) | Títulos, nomes de jogadas e dados principais (`> 17:1` AAA) |
| `--primary` / `--primary-foreground` | `--color-brand-primary` | `#171717` / `#FAFAFA` | `#E5E5E5` / `#171717` | Ação primária do estilo Vega (`Button variant="default"`) |
| `--secondary` / `--secondary-foreground` | `--color-bg-elevated` | `#F5F5F5` / `#171717` | `#262626` / `#FAFAFA` | Controles secundários, chips e superfícies de apoio |
| `--muted` / `--muted-foreground` | `--color-text-muted` | `#F5F5F5` / `#525252` | `#262626` / `#A3A3A3` | Metadados, legendas e carimbos (`7.5:1` Light / `6.9:1` Dark AA) |
| `--border` | `--color-border-subtle` | `#E5E5E5` (`neutral-200`) | `#262626` (`neutral-800`) | Divisores de seção e bordas de cartão (`1px`) |
| `--input` / `--bg-input-30` | `--color-border-strong` | `#D4D4D4` / `#FFFFFF` | `#404040` / `#1D1D1D` | Bordas e fundo de `<Input>`, `<Select>` e `<Textarea>` |
| `--ring` / `--ring-focus` | `--color-focus-ring` | `#171717` / `rgba(23,23,23,0.16)` | `#D4D4D4` / `rgba(212,212,212,0.24)` | Anel de foco de `3px` (`effect: focus/button` e `focus/input`) |
| `--success` / `--color-status-available` | Status `disponivel` / `Vou` | `#15803D` sobre `#ECFDF5` | `#05DF72` sobre `#002C22` | Resposta **Vou**, presença **Confirmado** e status `disponivel` |
| `--warning` / `--color-status-unavailable` | Status `indisponivel` / Prazo | `#B45309` sobre `#FFFBEB` | `#FFD230` sobre `#461901` | Status `indisponivel`, pendência de resposta e fila de aprovação |
| `--destructive` / `--color-status-injured` | Status `lesionado` / `Não vou` | `#DC2626` sobre `#FEF2F2` | `#FF6467` sobre `#3B0A0C` | Erro (`aria-invalid="true"`), recusa **Não vou** e status `lesionado` |
| `--color-status-retired` | Status `reformado` | `#525252` sobre `#F5F5F5` | `#A3A3A3` sobre `#262626` | Status `reformado` e ausência consolidada |
| `--info` / `--color-unit-offense` | Unidade `Ofensiva` | `#0369A1` sobre `#F0F9FF` | `#74D4FF` sobre `#052F4A` | Emblema da unidade **Ofensiva** e banner PWA |
| `--color-unit-defense` | Unidade `Defesa` | `#B91C1C` sobre `#FEF2F2` | `#FF6467` sobre `#3B0A0C` | Emblema da unidade **Defesa** |
| `--color-unit-st` | Unidade `Special teams` | `#6D28D9` sobre `#F5F3FF` | `#C4B5FD` sobre `#2E1065` | Emblema da unidade **Special teams** |
| `--color-accent-new` | Selo `NOVO` (`!play_read`) | `#92400E` sobre `#FEF3C7` | `#FFD230` sobre `#461901` | Selo de **Novidade** em jogada não estudada |

> **Paridade com o Figma Reference (`shadcncraft v3` — Estilo `Vega`) e Biblioteca React P0 (`apps/web/src/components/ui/`)**: Em `docs/design/prototype/styles.css`, todos os tokens das 3 coleções (`Tailwind` → `Style: Vega` → `Mode: Light & Dark`) são exportados dentro da região `/* shadcncraft:tokens:start */ ... /* shadcncraft:tokens:end */` e consumidos pelos seletores `[data-slot]` e classes `.ui-*`. Veja [`FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md) e [`FIGMA-REFERENCE.md`](./FIGMA-REFERENCE.md).

> **Regra de independência de cor**: nenhum status do elenco, unidade, presença ou marcação usa apenas cor. Todo emblema combina:
> 1. Variante visual distinta (borda sólida, tracejada, dupla ou pontilhada) com rótulo textual;
> 2. Rótulo textual explícito em português;
> 3. Borda com estilo diferenciado (sólida para confirmado/disponível, tracejada para pendente/sem resposta, dupla/acentuada para lesionado/erro).

### 2.2. Tipografia

- `--font-sans`: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- `--font-mono`: `'JetBrains Mono', 'SFMono-Regular', Consolas, monospace` (usada em códigos de verificação, versão de jogada `v3`, situação de down e distância `3rd & 7`, contadores e prazos)
- `font-variant-numeric: tabular-nums` aplicado a todas as tabelas, contadores de presença/marcação e cronômetros de prazo.

| Token | Tamanho (`rem` / `px`) | Altura de linha | Peso | Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| `--text-xs` | `0.75rem` (`12px`) | `1.125rem` (`18px`) | `600` | Emblemas de unidade, selo de novidade, versão |
| `--text-sm` | `0.875rem` (`14px`) | `1.25rem` (`20px`) | `400 / 500` | Metadados, formação, situação, notas secundárias |
| `--text-base` | `1rem` (`16px`) | `1.5rem` (`24px`) | `400 / 500` | Corpo de atribuição, justificativa, campos de formulário (evita auto-zoom no iOS) |
| `--text-lg` | `1.125rem` (`18px`) | `1.625rem` (`26px`) | `600` | Títulos de cartão (nome da jogada, evento, jogador) |
| `--text-xl` | `1.375rem` (`22px`) | `1.75rem` (`28px`) | `700` | Títulos de seção e cabeçalho de tela mobile |
| `--text-2xl` | `1.75rem` (`28px`) | `2.125rem` (`34px`) | `700` | Cabeçalho de página no desktop e placar de consolidado |

> **Prevenção de zoom acidental no iOS Safari**: todos os elementos `<input>`, `<select>` e `<textarea>` têm `font-size: 1rem` (`16px`) mínimo no mobile.

### 2.3. Espaçamento (Escala base `4px`)

| Token | Valor | Uso principal |
| :--- | :--- | :--- |
| `--space-1` | `0.25rem` (`4px`) | Espaço interno de emblemas |
| `--space-2` | `0.5rem` (`8px`) | Gap entre chips de filtro e tags de posição |
| `--space-3` | `0.75rem` (`12px`) | Padding interno compacto de células e itens de lista |
| `--space-4` | `1rem` (`16px`) | Padding padrão de cartão e margem lateral mobile |
| `--space-5` | `1.25rem` (`20px`) | Separação entre grupos de campos de formulário |
| `--space-6` | `1.5rem` (`24px`) | Gap entre seções da tela e padding lateral em tablet |
| `--space-8` | `2rem` (`32px`) | Padding de container desktop e separação de blocos |
| `--space-12` | `3rem` (`48px`) | Espaçamento de estados vazios e blocos de destaque |

### 2.4. Raio de Borda, Sombra e Movimento

- **Raio de borda e Raios Concêntricos (`R_externo = R_interno + padding`)**:
  - `--radius-sm`: `6px` (emblemas de unidade, posição e botões internos de seletor segmentado)
  - `--radius-md` / `--component-button-radius` / `--component-input-radius`: `8px` (botões, inputs, selects e gatilhos de aba `[data-slot="tabs-trigger"]`)
  - `--radius-lg`: `10px` (cartões compactos, linhas de atribuição e prancheta do diagrama)
  - `--radius-xl` / `--component-card-radius`: `14px` (cartões de jogada, evento, jogador e modais)
  - `--radius-4xl` / `--component-badge-radius`: `26px` (emblemas base e status do elenco)
  - `--radius-full`: `9999px` (avatares e indicadores circulares)
  - *Regra de raios concêntricos*: containers com padding curto (`<= 12px`) usam `R_externo = R_interno + padding` (ex.: `[data-slot="tabs-list"]` com `padding: 4px` e `border-radius: 12px` envolvendo `[data-slot="tabs-trigger"]` com `border-radius: 8px`).
- **Sombras (Effect Styles do Figma Vega)**:
  - `--shadow-surface` (`--shadow-sm`): `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (Light) / `0 1px 3px 0 rgba(0, 0, 0, 0.4)` (Dark)
  - `--shadow-control`: `0 1px 2px 0 rgba(0, 0, 0, 0.04)` (Light) / `0 1px 2px 0 rgba(0, 0, 0, 0.35)` (Dark)
  - `--shadow-tabs-active`: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
  - `--shadow-popover` (`--shadow-md`): `0 4px 12px -2px rgba(0, 0, 0, 0.08)` (Light) / `0 8px 20px -4px rgba(0, 0, 0, 0.55)` (Dark)
  - `--shadow-dialog` (`--shadow-lg`): `0 20px 25px -5px rgba(0, 0, 0, 0.12)` (Light) / `0 24px 48px -12px rgba(0, 0, 0, 0.75)` (Dark)
- **Movimento e Transições Específicas**:
  - `--ease-standard`: `cubic-bezier(0.2, 0, 0, 1)`
  - `--duration-fast`: `150ms` (foco, hover, troca de aba/chip)
  - `--duration-normal`: `220ms` (abertura de modal/painel)
  - Proibição de `transition: all`: transições declaram apenas propriedades explícitas (`background-color`, `border-color`, `color`, `box-shadow`).
  - Respeito obrigatório a `@media (prefers-reduced-motion: reduce)` zerando animações e transições para `0.01ms`.

---

## 3. Grade Responsiva, Breakpoints e Áreas Seguras

### 3.1. Breakpoints Mobile-First

| Breakpoint | Faixa | Navegação Principal | Grade de Conteúdo |
| :--- | :--- | :--- | :--- |
| **Mobile (Base)** | `320px – 767px` | Barra inferior fixa (`height: calc(64px + env(safe-area-inset-bottom))`) | 1 coluna fluida, margem lateral `16px`, gap `12px` |
| **Tablet** | `768px – 1023px` | Barra inferior fixa ou rail compacto | 8 colunas, margem `24px`, cartões em 2 colunas |
| **Desktop** | `>= 1024px` | Navegação lateral esquerda fixa (`width: 264px`) | 12 colunas (`max-width: 1200px`), gap `24px`, mestre-detalhe para Playbook e Game Plan |

### 3.2. Áreas Seguras do iOS (PWA `standalone`)

No modo instalado na tela inicial (`display: standalone`), o layout aplica:
- Topo: `padding-top: max(var(--space-4), env(safe-area-inset-top))` no cabeçalho fixo.
- Rodapé mobile: `padding-bottom: env(safe-area-inset-bottom)` na barra de navegação inferior, com `padding-bottom: calc(80px + env(safe-area-inset-bottom))` no `<main>` para que nenhum botão de ação fique encoberto pela barra.
- Laterais em paisagem: `padding-left: max(var(--space-4), env(safe-area-inset-left))` e `padding-right: max(var(--space-4), env(safe-area-inset-right))`.

### 3.3. Itens de Navegação por Papel

- **Visão de Jogador (5 destinos)**:
  1. **Home** (próximos eventos, pendências de resposta, novidades do playbook)
  2. **Evento** (detalhe do treino, resposta de presença com justificativa)
  3. **Playbook** (jogadas visíveis por unidade, busca, filtros, selo de novidade)
  4. **Jogo** (marcação de disponibilidade e leitura do game plan)
  5. **Perfil** (posições, unidades, status do elenco em leitura, notificações, sair)
  *(A aba **Elenco** não existe no DOM para o jogador).*
- **Visão de Staff Ativo (6 destinos)**:
  1. **Home** (resumo operacional, aprovações de staff pendentes para head coach, eventos próximos)
  2. **Evento** (consolidado de confirmados, ausentes com justificativa, sem resposta e registro de presença real pós-treino)
  3. **Playbook** (criação/edição de jogadas conforme subpapel, controle de visibilidade por unidade, histórico de versões, arquivamento)
  4. **Jogo** (disponibilidade consolidada cruzada com status do elenco + montagem e ordenação do game plan com notas)
  5. **Elenco** *(exclusivo staff)* (lista completa do elenco, filtros por unidade/posição/status, edição de status do elenco, observação, data prevista de retorno para lesionado, pré-cadastro de jogador e fila de aprovação de staff para head coach)
  6. **Perfil** (subpapéis atribuídos, notificações, contato e sessão)

---

## 4. Alvos de Toque, Contraste e Acessibilidade

1. **Alvo de toque mínimo (`44×44px`)**:
   - Todo botão (`[data-slot="button"]`, inclusive `sm` e `icon`), aba (`[data-slot="tabs-trigger"]`), item de navegação, chip de filtro, seletor de "Vou / Não vou", botão de ordenação do game plan (`↑` / `↓`) e item acionável possui `min-height: 44px` e `min-width: 44px` (`--touch-min: 44px`).
2. **Anel de foco visível (`:focus-visible`)**:
   - `outline: none; border-color: var(--ring); box-shadow: 0 0 0 3px var(--ring-focus);` em todos os elementos interativos (Figma Effect `focus/button` e `focus/input`). Nunca usar `outline: none` sem anel de foco de alto contraste.
3. **Estados obrigatórios em todos os componentes interativos**:
   - **Padrão (`default`)**: pronto para interação.
   - **Hover (`:hover:not(:disabled)`)** e **Ativo/Selecionado (`[aria-pressed="true"]` / `[aria-selected="true"]` / `[aria-current="page"]`)**: feedback visual inequívoco sem deslocar o layout.
   - **Foco (`:focus-visible`)**: borda `--ring` (`#171717` Light / `#D4D4D4` Dark) + halo de `3px` `--ring-focus`.
   - **Desabilitado (`disabled` / `aria-disabled="true"`)**: opacidade `0.48–0.5`, cursor `not-allowed`, rótulo explicativo do motivo (ex.: "Prazo encerrado — somente o staff pode alterar" ou "Somente leitura para seu subpapel").
   - **Carregando (`aria-busy="true"`)**: `<Spinner data-slot="spinner">` inline + texto acessível (`"Salvando resposta..."`), preservando as dimensões do botão e bloqueando duplo envio.
   - **Erro (`aria-invalid="true"`)**: borda `--destructive` (`#DC2626` Light / `#FF6467` Dark) + halo `3px var(--destructive-focus)`, ícone de alerta e mensagem vinculada por `aria-describedby` em `role="alert"`.
4. **Leitores de tela (VoiceOver iOS / TalkBack Android / NVDA)**:
   - Landmarks semânticos: `<header>`, `<nav aria-label="Navegação principal">`, `<main id="conteudo-principal">`, `<section aria-labelledby="...">`.
   - Link `"Pular para o conteúdo principal"` visível no primeiro `Tab`.
   - Regiões dinâmicas com `aria-live="polite"` para filtros de busca, contadores consolidados e confirmação de estudo de jogada.

---

## 5. Especificações Detalhadas no Diretório `docs/design/`

### Telas (`docs/design/screens/`)
- [`screens/home.md`](./screens/home.md) — Home (convite de instalação PWA, pendências de presença/marcação, novidades do playbook, atalhos de staff).
- [`screens/evento.md`](./screens/evento.md) — Evento (treino: resposta Vou/Não vou com justificativa, prazo de resposta, consolidado do staff e registro de presença real pós-treino).
- [`screens/playbook.md`](./screens/playbook.md) — Playbook (lista por unidade, busca, filtros de formação e situação, selo de novidade, atribuição por posição, imagem opcional, histórico de versões e visibilidade por unidade).
- [`screens/jogo.md`](./screens/jogo.md) — Jogo (marcação de disponibilidade com justificativa, consolidado cruzado com status do elenco e game plan ordenado por referência com notas do confronto).
- [`screens/elenco.md`](./screens/elenco.md) — Elenco (exclusivo staff: filtros por unidade, posição e status do elenco, edição de status/observação/data prevista de retorno, registro de jogador ainda não cadastrado e gestão de staff pendente/subpapéis pelo head coach).
- [`screens/perfil.md`](./screens/perfil.md) — Perfil (unidades e posições do jogador, status do elenco em leitura, subpapéis do staff, preferências de notificação Web Push/e-mail, contato com o staff, sair e apagar conta).

### Fluxos (`docs/design/flows/`)
- [`flows/cadastro-e-papel.md`](./flows/cadastro-e-papel.md) — Cadastro com código do time, verificação por código de e-mail ou Google OAuth, e escolha de papel (jogador com unidades/posições vs. staff com subpapel).
- [`flows/resposta-evento-justificativa.md`](./flows/resposta-evento-justificativa.md) — Resposta a evento (presença em treino ou marcação em jogo) com justificativa obrigatória na recusa (lista + complemento livre) e bloqueio após o prazo.
- [`flows/consulta-jogada.md`](./flows/consulta-jogada.md) — Consulta de jogada pelo jogador, busca/filtros, inspeção das atribuições de todas as posições, abertura de imagem e marcação de "Estudei esta jogada" (`play_read`).
- [`flows/montagem-game-plan.md`](./flows/montagem-game-plan.md) — Seleção de jogadas do playbook por referência, ordenação da sequência de chamadas e escrita de nota por jogada para o confronto.
- [`flows/aprovacao-staff.md`](./flows/aprovacao-staff.md) — Estado pendente do recém-cadastrado como staff, notificação ao head coach, aprovação/recusa, concessão cumulativa de coordenador de special teams e remoção do papel de staff.
- [`flows/instalacao-pwa.md`](./flows/instalacao-pwa.md) — Convite não intrusivo (exibido uma única vez na Home) para adicionar à tela inicial no iOS/Android, ativação de Web Push por gesto do usuário e fallback automático por e-mail.

### Gate de Qualidade, Referência Figma, Inventário, Biblioteca de Componentes & Questões em Aberto (`docs/design/`)
- [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) — **Design Polish Gate** estruturado em duas partes desacopladas: **(Parte A) Gate Genérico de Acabamento**, reutilizável em projetos com qualquer template Figma (tipografia, `tabular-nums`/`text-wrap`, superfícies e raios concêntricos, alinhamento óptico, ícones `currentColor`/peso, hit areas `44×44px`, estados de interação, motion restraint/`prefers-reduced-motion`, transições específicas sem `transition: all`, imagens, evidências mínimas, severidade `S0`/`S1`/`S2` e veredito `Approve`/`Needs changes`/`Block`); e **(Parte B) Adaptador SnapIn / Figma Vega**, que parametriza o gate especificamente para o **Playbook do Time** sem transformar o Vega em regra universal e sem instalar dependências.
- [`FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md) — Inventário técnico completo extraído da sessão autenticada do Figma (`window.figma` + `&view=variables` + inspeção do `Dev Mode` em `node-id=7050-2702`), cobrindo as 25 páginas, 25 `COMPONENT_SET`s, 1.159 variáveis locais (`Tailwind`, `Style`, `Mode`), estilos locais, separação em 4 camadas (`Primitives`, `Components`, `Patterns`, `Screens`), evidência auditável (`[E1-FIGMA-LIVE]`, `[E1-REGISTRY-TSX]`, `[E2-REGISTRY-META]`, `[E3-RECONSTRUCAO-DOMINIO]`), mapeamento Figma → React e ordem de implementação `P0`/`P1`/`P2`.
- [`COMPONENT-LIBRARY-PLAN.md`](./COMPONENT-LIBRARY-PLAN.md) — Plano arquitetural completo da biblioteca reutilizável em 3 camadas (`Primitives`, `Composed Components` e `Domain Patterns`), prioridades `P0`/`P1`/`P2`, API TypeScript sugerida, anatomia `data-slot`, matriz de estados, acessibilidade, itens fora do escopo e política de dependências/licenças para `apps/web/src/components/`.
- [`FIGMA-REFERENCE.md`](./FIGMA-REFERENCE.md) — Análise do arquivo público **shadcn UI Kit – shadcncraft – Free Starter Kit (`node-id=7050-2702`)**, cadeia de variáveis v3 (`Tailwind` → `Style` → `Mode`), anatomia `data-slot` 1:1, o que foi adotado, o que foi rejeitado, diagnóstico de login do Figma e comparação visual antes/depois.
- [`OPEN-QUESTIONS.md`](./OPEN-QUESTIONS.md) — Decisões de produto não cobertas pelo spec registradas formalmente para validação antes ou durante a implementação.

---

## 6. Checklist de Handoff (UX Designer → Frontend)

### 6.0. Pré-Requisito Obrigatório do UX Designer: Aplicar o Design Polish Gate ([`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md))

Antes de entregar qualquer protótipo ou especificação de tela para implementação em `apps/web`, o **UX Designer** deve executar o [`DESIGN-POLISH-GATE.md`](./DESIGN-POLISH-GATE.md) combinando a **Parte A (Gate Genérico independente de template)** com a **Parte B (Adaptador SnapIn / Figma Vega)** e registrar veredito **`Approve`**:

- [x] **Evidências mínimas (`EV-01` a `EV-05`)**: validado nos modos suportados pelo Adaptador (`Vega Light` padrão e `Vega Dark` alternativo), nos viewports `1440×1024` (Desktop) e `390×844` (Mobile com safe-area iOS) com zero overflow horizontal (`scrollWidth <= clientWidth`), nos 4 contextos de papel/subpapel (`jogador`, `head_coach`, `coordenador_ofensivo`, `staff_pendente`), nos 4 estados de tela (`default`, `loading`, `empty`, `error`) e com rastreabilidade Figma (`[E1]`/`[E2]`/`[E3]`).
- [x] **Tipografia, `tabular-nums` e `text-wrap`**: escala do Adaptador aplicada sem fontes mágicas, `font-size >= 16px` em `<input>`, `<select>` e `<textarea>` no mobile, `font-variant-numeric: tabular-nums` em contadores/prazos/situação/versão, `text-wrap: balance` em títulos e `text-wrap: pretty` em descrições, atribuições e notas.
- [x] **Superfícies, raios concêntricos e alinhamento óptico**: camadas de superfície distintas em Light e Dark, raios aninhados concêntricos (`R_externo = R_interno + padding`, ex.: `tabs-list` `12px` com `tabs-trigger` `8px`), e ícones/emblemas alinhados ao centro óptico da primeira linha de texto.
- [x] **Ícones `currentColor`, hit areas `>= 44×44px` e estados de interação**: SVGs com `stroke="currentColor"` e peso consistente (`stroke-width: 2`), todos os alvos interativos `>= 44×44px` (`--touch-min: 44px`), ciclo completo `default / hover / active / focus-visible / disabled / loading / error`, e independência estrita de cor (cor + borda + glifo + texto do `GLOSSARY.md`).
- [x] **Motion restraint, transições específicas e imagens**: durações curtas (`150ms`/`220ms`), `@media (prefers-reduced-motion: reduce)` ativo, zero ocorrências de `transition: all`, diagramas/imagens com proporção reservada (sem CLS), contorno interno sutil e zoom via `<dialog>` nativo acessível.
- [x] **Veredito do Gate**: **`Approve`** (`S0 = 0`, `S1 = 0`, `S2 <= 2`), sem introduzir Tailwind, Motion ou dependências externas.

### 6.1. Como abrir o protótipo navegável

O protótipo em `docs/design/prototype/` é HTML + CSS puro, sem etapa de build e sem dependências externas. Para abrir diretamente no navegador:

```sh
# Opção 1: abrir o arquivo diretamente no navegador padrão (macOS)
open docs/design/prototype/index.html

# Opção 2: servir localmente via Python (qualquer SO)
python3 -m http.server 4173 --directory docs/design/prototype
# Acesse http://localhost:4173
```

No topo do protótipo há uma **Barra de Simulação de Handoff** que permite alternar instantaneamente:
- **Modo de Cor (`Mode`)**: `☀ Vega Light` (padrão) e `☾ Vega Dark` (alternativo).
- **Papel / Subpapel**: `Jogador (Ofensiva — WR/KR)`, `Staff — Head Coach`, `Staff — Coordenador Ofensivo`, `Staff — Pendente`.
- **Estado da Tela**: `Padrão / Sucesso`, `Carregando (Skeleton / Spinner)`, `Vazio (Empty State)`, `Erro (Falha / Validação)`.
- **Viewport**: `Responsivo (1440 Desktop / 390 Mobile)` e `Frame Mobile (390×844 Safe Area)`.
- **Tela Ativa**: `Home`, `Evento`, `Playbook`, `Jogo`, `Elenco (Staff)`, `Perfil` e `Componentes Figma & P0` (além dos modais `<Dialog>` nativos de Cadastro/Login, Exclusão de Conta e Zoom da Imagem da Jogada).

### 6.2. Componentes Reutilizáveis e Anatomia `data-slot` (`apps/web/src/components/ui/` + Padrões de Domínio)

Todos os componentes seguem a convenção `data-slot="<component>"`, `data-variant="<variant>"`, `data-size` e `data-state` implementada na biblioteca React P0 ([`apps/web/src/components/ui/FIGMA-REACT-MATRIX.md`](../../apps/web/src/components/ui/FIGMA-REACT-MATRIX.md)) e no inventário do Figma ([`FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md)):

| Componente | `data-slot` | Telas onde aparece | Props / Variantes principais | Estados obrigatórios |
| :--- | :--- | :--- | :--- | :--- |
| `<AppShell>` | `app-shell`, `sidebar`, `bottom-nav` | Todas as 6 telas | `role: 'jogador' \| 'staff'`, `approvalStatus: 'ativo' \| 'pendente'`. Esconde a aba **Elenco** quando `role === 'jogador'`. | Responsivo: bottom bar (`< 1024px`) com safe-area iOS e sidebar (`>= 1024px`). |
| `<SectionHeading>` | `section-heading`, `tagline`, `section-heading-title`, `section-heading-body` | Todas as 6 telas | Adaptado de `@shadcncraft/section-heading` com suporte a ações laterais (`section-heading-actions`). | Hierarquia semântica `<h2>`/`<h3>` e contraste AA. |
| `<UnitBadge>` | `badge` (`data-variant="offense \| defense \| st"`) | Home, Playbook, Jogo, Elenco, Perfil | `unit: 'ofensiva' \| 'defesa' \| 'special_teams'` | Cor semântica + texto em caixa alta (`OFENSIVA`, `DEFESA`, `SPECIAL TEAMS`). |
| `<RosterStatusBadge>` | `badge` (`data-variant="available \| unavailable \| injured \| retired"`) | Jogo, Elenco, Perfil | `status: 'disponivel' \| 'indisponivel' \| 'lesionado' \| 'reformado'`, `returnDate?: string` | Texto + variante + borda distinta (nunca apenas cor). |
| `<AvatarStack>` | `avatar-stack`, `avatar-stack-overflow` | Home, Evento, Jogo | Adaptado de `@shadcncraft/avatar-stack`: pilha compacta de iniciais dos confirmados com contador `+N`. | Anel `ring-2 ring-background` e rótulo acessível com total de confirmados. |
| `<EventResponseCard>` | `card`, `card-header`, `card-title`, `card-content` | Home, Evento, Jogo | `type: 'treino' \| 'jogo'`, `deadline: string`, `isPastDeadline: boolean`, `currentResponse?: 'vou' \| 'nao_vou'` | `default`, `focus-visible`, `loading` (salvando), `disabled` (prazo vencido), `error` (recusa sem justificativa). |
| `<JustificationSheet>` | `field`, `field-label`, `field-error` | Evento, Jogo | Lista de motivos rápidos + `<textarea>` complementar obrigatório quando "Outro" ou opcional para detalhar. | Validação de campo obrigatório (`aria-invalid="true"` + halo destrutivo), `loading` no envio, `error` de rede. |
| `<PlayCard>` | `card`, `badge` | Home, Playbook, Jogo (Game Plan) | `name`, `unit`, `formation`, `situation`, `version`, `isNew: boolean`, `hasImage: boolean`, `gamePlanNote?: string` | Selo `NOVO` (`!isRead`), foco de teclado, estado `arquivada` para staff. |
| `<ImageZoomDialog>` | `image-zoom-dialog` | Playbook, Jogo | Adaptado de `@shadcncraft/image-zoom` com `<dialog>` nativo (`100dvw × 100dvh`, `backdrop-blur-md`) sem dependências externas. | Abertura por botão `"Ampliar imagem"`, fechamento por `Esc`/botão `44×44px` e respeito a `prefers-reduced-motion`. |
| `<AttendanceSummaryPanel>` | `card`, `tabs` | Evento, Jogo (somente staff) | Três abas/colunas: `Confirmados`, `Ausentes (com justificativa)`, `Sem resposta`. | No Jogo, cruza com `<RosterStatusBadge>` alertando caso um jogador `lesionado` ou `reformado` esteja listado. |
| `<PwaInstallBanner>` | `banner` (`role="banner"`) | Home, Perfil | Adaptado de `@shadcncraft/banner-10`: detecta standalone vs. browser tab; instruções iOS Safari ("Compartilhar → Adicionar à Tela de Início"). | Dispensável uma vez (`localStorage` / preferência), botão de ativar Web Push por gesto (`44px`). |

### 6.3. Checklist de Implementação por Tela para o Frontend (`apps/web`)

- [ ] **1. Home (`screens/home.md`)**
  - [ ] Renderizar `<PwaInstallBanner>` apenas uma vez se não instalado na tela inicial (história 74).
  - [ ] Listar próximos eventos com destaque para os que exigem resposta dentro do prazo (história 45).
  - [ ] Listar jogadas com selo de novidade (`play_read` desatualizado) visíveis para as unidades do jogador (histórias 36, 67).
  - [ ] Para `head_coach`: exibir card de alerta com contagem de cadastros de staff **pendentes** (histórias 9, 76).
  - [ ] Implementar estados `loading` (skeleton dos cards), `empty` (sem eventos agendados e playbook em dia) e `error` (botão "Tentar novamente").

- [ ] **2. Evento (`screens/evento.md`)**
  - [ ] Exibir cabeçalho do treino (data no fuso `America/Sao_Paulo`, local, prazo de resposta e estado `ativo` | `cancelado`).
  - [ ] Permitir resposta **Vou** / **Não vou** enquanto o prazo não venceu; exigir **justificativa** (lista rápida + texto livre) ao selecionar **Não vou** (histórias 46–50).
  - [ ] Bloquear alteração pelo jogador após o prazo vencido com mensagem clara e atalho de contato com o staff (história 78).
  - [ ] **Exclusivo Staff**: painel consolidado com `Confirmados`, `Ausentes com justificativa` e `Sem resposta`, exibindo a justificativa completa e a taxa de comparecimento (histórias 52, 53, 56).
  - [ ] **Exclusivo Jogador**: exibir lista de participantes mostrando apenas `Confirmado` ou `Ausente`, **sem jamais renderizar a justificativa** (história 54) e mostrando como o próprio jogador foi contabilizado na presença real pós-treino (história 57).
  - [ ] **Exclusivo Staff**: modo de chamada pós-treino para registrar a **presença real** separada da resposta prévia (história 55) e ações de criar, remarcar, ajustar prazo ou cancelar evento (histórias 41, 43, 44).

- [ ] **3. Playbook (`screens/playbook.md`)**
  - [ ] Agrupar jogadas por **unidade** (`Ofensiva`, `Defesa`, `Special teams`) respeitando a visibilidade do usuário e a regra de que `Special teams` é aberta a todo o time (histórias 27, 34; ADR-0006).
  - [ ] Implementar busca por nome e filtros combináveis por **formação** e **situação** (down e distância) e filtro rápido "Apenas novidades" (histórias 36, 38, 39).
  - [ ] No detalhe da jogada: listar **todas as atribuições** por posição (destacando as posições do jogador logado, mas exibindo todas — história 35), exibir imagem anexada ampliável (história 40) e botão `"Marcar como estudada"` que remove o selo de novidade (história 37).
  - [ ] **Exclusivo Staff (conforme subpapel)**: criar e editar jogada (nome, unidade, formação, situação, atribuições por posição, upload de imagem), configurar visibilidade para unidades adicionais (default: unidade dona), arquivar jogada e consultar histórico de versões (`play_revision`) (histórias 21–33).
  - [ ] Respeitar matriz de edição: `head_coach` edita todas; `coordenador_ofensivo` só ofensiva; `coordenador_defensivo` só defesa; `coordenador_special_teams` só special teams; unidades liberadas para leitura de outro coordenador ficam em modo somente leitura (história 32).

- [ ] **4. Jogo (`screens/jogo.md`)**
  - [ ] Exibir dados do confronto (adversário, data/hora, local, prazo de marcação) e seletor de **marcação** de disponibilidade (`Disponível — Vou` / `Indisponível — Não vou` com justificativa obrigatória) (histórias 58, 59).
  - [ ] Exibir a aba/seção **Game plan** do confronto com a lista ordenada de jogadas referenciadas do playbook e a nota tática daquele adversário; tocar na jogada abre todas as atribuições atualizadas (histórias 65, 66; ADR-0004).
  - [ ] **Exclusivo Staff**: visão de disponibilidade consolidada cruzada com o **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`), destacando conflitos (ex.: jogador lesionado ou sem marcação) (histórias 60, 61).
  - [ ] **Exclusivo Staff**: construtor de **game plan** permitindo adicionar jogadas do playbook por referência, reordenar chamadas (`↑` / `↓`), editar a nota por jogada e remover item do game plan sem afetar o playbook (histórias 62–65).

- [ ] **5. Elenco (`screens/elenco.md`) — Oculto para Jogador na navegação principal**
  - [ ] Na rota `/elenco` para Staff: filtros por **unidade**, **posição** e **status do elenco** + busca por nome (história 18), além da taxa de comparecimento acumulada por jogador (história 56).
  - [ ] Modal/gaveta de edição de jogador pelo Staff: alterar **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`), registrar **observação** (ex.: suspensão ou motivo pontual) e informar **data prevista de retorno** quando `lesionado` (histórias 15–17, 19).
  - [ ] Ação `"Registrar jogador no elenco"` para pré-cadastrar quem ainda não criou conta no app (história 77).
  - [ ] **Exclusivo Head Coach**: fila de cadastros de staff **pendentes** com botões `Aprovar` e `Recusar`, concessão cumulativa do subpapel de **coordenador de special teams** e remoção do papel de staff (histórias 9, 10, 75, 76).
  - [ ] Nota: a consulta somente leitura do elenco pelos jogadores (histórias 13 e 14: ver companheiros com posições, unidades e status do elenco, sem observações internas nem justificativas) fica acessível a partir de um botão secundário `"Ver companheiros de unidade"` dentro do Perfil/Jogo, mantendo a aba **Elenco** da barra de navegação exclusiva do staff conforme exigido pelo spec ("A aba Elenco não aparece para jogador").

- [ ] **6. Perfil (`screens/perfil.md`)**
  - [ ] Exibir dados da conta (nome, e-mail verificado, papel e subpapéis quando staff).
  - [ ] Para Jogador: exibir seu próprio **status do elenco** atual em modo leitura (inclusive data prevista de retorno se lesionado — história 20) e seletor editável de **unidades** (`Ofensiva`, `Defesa`, `Ambas`) e **posições** múltiplas (histórias 4, 5, 6).
  - [ ] Controles de **notificações**: chave de inscrição Web Push por dispositivo, alerta de instalação na tela inicial se necessário e preferências granulares por tipo de aviso + fallback de e-mail (histórias 72, 73, 74).
  - [ ] Canal `"Falar com o staff"` para quando o jogador não consegue responder a um evento (história 78).
  - [ ] Ações de sessão e privacidade: `"Sair da conta"` (história 11) e `"Apagar minha conta"` com confirmação explícita (história 79).
