# Design Polish Gate (`docs/design/DESIGN-POLISH-GATE.md`)

Gate de qualidade visual, ergonomia e acabamento de interface inspirado nos princípios públicos de *make-interfaces-feel-better*, sem copiar dependências ou código de terceiros e sem impor frameworks (como Tailwind ou Motion).

Para que este documento seja **genericamente reutilizável em projetos com qualquer template Figma**, sua estrutura é dividida explicitamente em duas partes desacopladas:

- **Parte A — Gate Genérico (Independente de Template Figma)**: princípios universais de tipografia, numerais tabulares e `text-wrap`, superfícies e raios concêntricos, alinhamento óptico, ícones `currentColor`/peso, áreas de toque `44×44px`, estados de interação, contenção de movimento (`prefers-reduced-motion`), transições específicas, imagens, evidências mínimas de verificação, critérios de severidade (`S0`, `S1`, `S2`) e veredito (`Approve`, `Needs changes`, `Block`).
- **Parte B — Adaptador SnapIn / Playbook do Time (Template Figma Vega)**: parametrização local do gate para este repositório, conectando a referência Figma (`shadcncraft v3` — `Style: Vega`), a cadeia de tokens CSS, a biblioteca UI (`data-slot`), o vocabulário estrito do `GLOSSARY.md` e as restrições locais do projeto.

---

# PARTE A — Gate Genérico de Acabamento de Interface (Independente de Template)

> Esta seção não depende do estilo **Vega** nem de nenhum kit específico. Pode ser copiada ou referenciada integralmente em qualquer produto web/mobile-first que utilize outro arquivo Figma como fonte de verdade, bastando substituir a **Parte B (Adaptador)**.

## A.1. Escopo e Princípios Gerais do Gate

1. **Propósito**: impedir que protótipos ou especificações de tela avancem para o handoff de engenharia com falhas de hierarquia tipográfica, desalinhamento óptico, raios aninhados dissonantes, alvos de toque insuficientes, estados de interação incompletos ou animações intrusivas.
2. **Independência de stack e de template**:
   - Os critérios abaixo avaliam o **resultado renderizado e os fundamentos de CSS/DOM**, independentemente da paleta, tipografia ou geometria do template Figma escolhido pelo projeto.
   - O gate **não exige nem introduz** bibliotecas externas (Tailwind CSS, Motion / Framer Motion, bibliotecas de ícones JS ou pacotes pagos).
   - O template Figma adotado pelo projeto define a identidade visual (cores, fontes, escala de raios e sombras) através do **Adaptador (Parte B)**; o **Gate Genérico (Parte A)** assegura a execução técnica e ergonômica dessa identidade.

---

## A.2. Evidências Mínimas de Verificação (Independentes de Template)

Antes de emitir um veredito para qualquer tela ou protótipo, o UX Designer deve comprovar cinco evidências mínimas:

| Código | Evidência Mínima | Critério Universal de Verificação |
| :--- | :--- | :--- |
| **EV-01** | **Fidelidade ao Template e Modos de Cor** | Todos os valores visuais (cores, fontes, raios, espaçamentos e sombras) vêm de tokens mapeados do template Figma ativo no Adaptador (sem valores mágicos avulsos), validados nos modos de cor suportados pelo projeto com contraste mínimo WCAG 2.1 AA (`>= 4.5:1` para texto normal e `>= 3:1` para componentes gráficos/bordas de controle). |
| **EV-02** | **Validação Responsiva (`Desktop` e `Mobile`)** | A interface é inspecionada nos viewports de referência do projeto (padrão: `1440×1024` no desktop e `390×844` no mobile com áreas seguras `env(safe-area-inset-*)`), apresentando **zero overflow horizontal** (`scrollWidth <= clientWidth`). |
| **EV-03** | **Variação por Papel e Permissões** | Cada perfil de acesso previsto na especificação do produto é testado, garantindo que dados restritos e controles não autorizados não apareçam para papéis sem permissão. |
| **EV-04** | **Completude dos 4 Estados de Tela** | Toda tela especifica e demonstra visualmente os estados: (1) `default` (dados carregados/sucesso), (2) `loading` (skeleton/spinner sem salto de layout), (3) `empty` (estado vazio explicativo com próximo passo) e (4) `error` (alerta claro com ação de tentativa/recuperação). |
| **EV-05** | **Rastreabilidade Figma → Componente** | Cada componente utilizado na tela referencia sua origem no inventário do template Figma do projeto (ou registra explicitamente quando é uma composição de domínio construída sobre primitivos do template). |

---

## A.3. Os 10 Pilares Universais de Acabamento

### 1. Revisão de Tipografia (`Typography & Hierarchy`)
- **Suavização e renderização**: aplicar `-webkit-font-smoothing: antialiased` e `-moz-osx-font-smoothing: grayscale` na raiz do documento; elementos de formulário (`button`, `input`, `select`, `textarea`) devem herdar `font-family: inherit`.
- **Contenção de pesos e tamanhos**: restringir a composição a uma escala clara definida pelos tokens do template, evitando criar hierarquia apenas aumentando o tamanho da fonte; combinar peso (`400`, `500`, `600`), cor primária vs. secundária (`foreground` vs. `muted`) e espaçamento.
- **Tracking óptico**: títulos grandes (`>= 18px`) devem ajustar sutilmente o `letter-spacing` negativo (`-0.015em` a `-0.025em`) para coesão visual; rótulos curtos em caixa alta (`uppercase`) devem abrir o tracking (`+0.04em` a `+0.06em`).
- **Prevenção de auto-zoom em mobile**: em dispositivos iOS Safari, todo `<input>`, `<select>` e `<textarea>` deve ter `font-size >= 16px` (`1rem`), evitando zoom involuntário da página ao focar o campo.

### 2. Numerais Tabulares e Quebra de Texto (`Tabular Numbers & Text-Wrap`)
- **Numerais tabulares (`font-variant-numeric: tabular-nums`)**: obrigatório em tabelas, contadores dinâmicos, placares, cronômetros, porcentagens, códigos de verificação, versões e listas numeradas. Impede que a largura do texto oscile quando os dígitos mudam.
- **Títulos equilibrados (`text-wrap: balance`)**: aplicar em títulos de página, cabeçalhos de seção, títulos de cartão, banners, modais e estados vazios para distribuir as linhas de forma uniforme e evitar palavras isoladas na última linha.
- **Parágrafos sem viúvas (`text-wrap: pretty`)**: aplicar em textos corridos, descrições de cartão, notas, itens de lista e mensagens de ajuda/erro de formulário.

### 3. Superfícies, Bordas e Raios Concêntricos (`Surfaces, Borders & Concentric Radii`)
- **Hierarquia de superfícies**: distinguir claramente o plano de fundo (`canvas`), a superfície de conteúdo (`card` / `surface`), superfícies secundárias (`muted` / `elevated`) e sobreposições (`dialog` / `popover`). No modo escuro, a elevação não pode depender apenas de sombra preta invisível — deve usar degraus sutis de luminância de superfície e bordas de `1px`.
- **Geometria de Raios Concêntricos**: quando um elemento com borda arredondada está aninhado dentro de um container arredondado e separado por um espaçamento interno (`padding`) curto (`<= 12px`), os raios devem compartilhar o mesmo centro óptico:
  $$\text{Raio Externo} = \text{Raio Interno} + \text{Padding}$$
  *(ou equivalentemente $\text{Raio Interno} = \max(0\text{px}, \text{Raio Externo} - \text{Padding})$)*.
  - Nunca usar o mesmo `border-radius` no container pai e no filho imediato quando o padding entre eles for pequeno, pois isso cria espessura visual desigual nos cantos.

### 4. Alinhamento Óptico (`Optical Alignment`)
- **Ícones e badges ao lado de texto multilinhas**: usar `align-items: flex-start` e alinhar o ícone ou emblema ao centro óptico da **primeira linha** de texto, nunca centralizado geometricamente na altura total de um bloco de várias linhas.
- **Equilíbrio interno de botões e pílulas**: quando um botão ou badge combina ícone e texto, calibrar o `gap` e o `line-height` para que o peso visual dos dois lados pareça simétrico.
- **Formas assimétricas**: triângulos (setas de play/avanço), chevrons e glifos de alerta devem ser posicionados pelo seu centro de massa visual, não apenas pela caixa delimitadora do SVG.
- **Elementos sobrepostos (ex.: pilhas de avatares)**: aplicar anel de recorte na cor exata da superfície de fundo (`border: 2px solid var(--surface)`) e contexto de empilhamento isolado (`isolation: isolate`).

### 5. Ícones `currentColor` e Peso Consistente (`Icons: currentColor & Stroke Weight`)
- **Herança automática via `currentColor`**: todo ícone vetorial deve usar `stroke="currentColor"` (ou `fill="currentColor"` conforme a família de ícones do template) sem cores hexadecimais fixas no SVG, garantindo transição perfeita entre estados (`hover`, `active`, `disabled`, `invalid`) e entre modos claro e escuro.
- **Consistência de peso e terminação**: todos os ícones de uma mesma família devem compartilhar a mesma grade (`viewBox`), o mesmo `stroke-width` (ex.: `1.75` ou `2`), `stroke-linecap` e `stroke-linejoin`, com `flex-shrink: 0` para nunca deformarem sob compressão de layout flex/grid.
- **Acessibilidade de ícones**: ícones decorativos ao lado de texto visível devem ter `aria-hidden="true"`; botões compostos apenas por ícone exigem `aria-label` descritivo da ação.

### 6. Áreas de Toque de `44×44px` (`Hit Areas >= 44px`)
- **Piso ergonômico universal**: todo controle interativo (botões, links de navegação, abas, chips de filtro, checkboxes/switches, botões de fechar ou reordenar) deve oferecer área acionável mínima de **`44×44px`** (WCAG 2.5.5 / Apple HIG / Android Material).
- **Desacoplamento entre tamanho visual e área de toque**: se o template Figma definir controles visualmente menores (como botões compactos de `28px–36px`), a adaptação deve preservar ou elevar a área clicável para `>= 44×44px` (via `min-height: 44px` ou área de toque expandida com pseudo-elemento `::after`), mantendo espaçamento mínimo (`gap >= 8px`) entre alvos vizinhos.

### 7. Estados de Interação e Independência de Cor (`Interaction States & Color Independence`)
- **Ciclo completo de estados**: todo componente acionável ou editável deve implementar explicitamente:
  1. `default` (repouso);
  2. `hover` (realce sutil sem deslocar layout);
  3. `active` / `pressed` / `selected` (`[aria-pressed="true"]`, `[aria-selected="true"]`, `[aria-current="page"]`);
  4. `focus-visible` (anel de foco de alto contraste para navegação por teclado; nunca usar `outline: none` sem substituto visível);
  5. `disabled` (`disabled` / `[aria-disabled="true"]` com redução de opacidade, bloqueio de interação e explicação contextual quando aplicável);
  6. `loading` (`[aria-busy="true"]` com indicador visual e preservação das dimensões do controle para evitar salto de layout);
  7. `error` / `invalid` (`[aria-invalid="true"]` com destaque de borda/anel de erro e mensagem associada em `role="alert"`).
- **Independência de cor**: nenhum status semântico, alerta ou categoria crítica pode depender exclusivamente de cor. Deve combinar sempre **cor + forma/borda distinta + ícone/glifo + rótulo textual**.

### 8. Contenção de Movimento e `prefers-reduced-motion` (`Motion Restraint & Reduced Motion`)
- **Movimento utilitário e rápido**: transições servem para orientar mudança de estado, nunca para atrasar a tarefa do usuário. Microinterações devem durar entre `120ms` e `180ms`; aberturas de modais, gavetas ou painéis devem durar entre `180ms` e `250ms` com curva de desaceleração natural (`cubic-bezier(0.2, 0, 0, 1)` ou equivalente do template).
- **Sem animações perpétuas**: exceto indicadores de carregamento ativo (`spinner` e `skeleton`), nenhum elemento da interface deve animar em loop contínuo.
- **Respeito obrigatório a `prefers-reduced-motion`**: a folha de estilos deve incluir `@media (prefers-reduced-motion: reduce)` reduzindo durações de animação/transição para `0.01ms` e desativando rolagem suave.

### 9. Transições Específicas (`Specific CSS Transitions — Never transition: all`)
- **Proibição de `transition: all`**: é estritamente proibido declarar `transition: all`. Essa declaração anima propriedades de layout (`width`, `height`, `padding`, `margin`, `top`, `left`) durante redimensionamentos de tela, trocas de tema ou carregamento de fontes, gerando lentidão e artefatos visuais.
- **Lista explícita de propriedades**: declarar apenas as propriedades que realmente mudam no estado interativo (ex.: `background-color`, `border-color`, `color`, `box-shadow`, `opacity`, `transform`).

### 10. Imagens, Mídia e Estabilidade de Layout (`Images & Layout Stability`)
- **Prevenção de Cumulative Layout Shift (CLS)**: toda imagem, diagrama ou mídia incorporada deve reservar seu espaço antes do carregamento via `aspect-ratio`, `width`/`height` ou `viewBox` explícito, com `max-width: 100%` e `display: block`.
- **Contorno interno sutil**: imagens e diagramas sobre superfícies claras ou escuras devem ter borda ou `outline` interno de `1px` de baixa opacidade (`outline-offset: -1px`) para delimitar o quadro quando a imagem tiver fundo da mesma cor do cartão.
- **Acessibilidade e ampliação**: imagens informativas exigem `alt` / `aria-label` descritivo; quando houver recurso de zoom/ampliação, deve operar em `<dialog>` acessível com fechamento por teclado (`Escape`) e botão de fechar com alvo `>= 44×44px`.

---

## A.4. Critérios Universais de Severidade e Veredito

### Classificação de Severidade

| Nível | Categoria | Critério Universal (Independente de Template) |
| :--- | :--- | :--- |
| **S0** | **Bloqueante (`Blocker`)** | • Violação de regras de visibilidade/autorização por papel ou exposição de dados privados.<br>• Violação do glossário de domínio do projeto.<br>• Falha grave de acessibilidade: contraste `< 4.5:1` em texto, alvo de toque `< 44×44px` em controle interativo, ausência de `:focus-visible`, ou estado transmitido apenas por cor.<br>• Overflow horizontal em mobile ou desktop.<br>• Introdução de dependências externas não autorizadas ou desvio da identidade do template Figma ativo no Adaptador. |
| **S1** | **Maior (`Major`)** | • Uso de `transition: all` em qualquer seletor.<br>• Ausência de `tabular-nums` em dados numéricos dinâmicos/comparativos.<br>• Campos de formulário com `font-size < 16px` no mobile.<br>• Ausência de qualquer um dos 4 estados de tela (`default`, `loading`, `empty`, `error`) ou dos estados de componente.<br>• Ausência de `@media (prefers-reduced-motion: reduce)`.<br>• Ícones com cores fixas em vez de `currentColor`.<br>• Raios aninhados conflitantes (filho com raio maior ou igual ao container pai com padding curto). |
| **S2** | **Menor / Polimento (`Minor`)** | • Falta de `text-wrap: balance` em títulos ou `text-wrap: pretty` em parágrafos gerando linha órfã.<br>• Desalinhamento óptico sutil entre ícone e primeira linha de texto.<br>• Ausência de contorno interno sutil ou proporção explícita em container de imagem.<br>• Inconsistência pontual de `stroke-width` em ícone secundário. |

### Regras de Decisão do Veredito

- **`Approve`**: `0` itens **S0**, `0` itens **S1**, no máximo `2` itens **S2** registrados, e todas as evidências `EV-01` a `EV-05` comprovadas. Liberado para handoff ao frontend.
- **`Needs changes`**: `0` itens **S0**, mas `>= 1` item **S1** ou `>= 3` itens **S2**. O UX Designer corrige os artefatos de design antes do handoff.
- **`Block`**: `>= 1` item **S0** ou ausência de qualquer evidência mínima (`EV-01` a `EV-05`). Handoff bloqueado até correção e nova rodada do gate.

---

## A.5. Como Reutilizar este Gate com Outro Template Figma

Para aplicar este gate em outro projeto ou trocar o template Figma sem alterar a **Parte A**, preencha um bloco **Adaptador (Parte B)** contendo:
1. **Referência Figma do Projeto**: URL, `fileKey`, `node-id`, nome da coleção de variáveis e modos de cor suportados.
2. **Mapeamento de Tokens**: equivalência entre as variáveis do novo template Figma e as propriedades CSS de superfície, tipografia, raios concêntricos, sombras, foco e movimento.
3. **Contrato da Biblioteca UI**: convenção de seletores/slots e matriz Figma → Componentes.
4. **Vocabulário e Regras de Domínio**: glossário obrigatório e restrições de visibilidade por papel.
5. **Restrições Locais do Repositório**: limites de escopo, pastas permitidas e stack do protótipo.

---
---

# PARTE B — Adaptador Específico: SnapIn / Playbook do Time (Template Figma Vega)

> Esta seção instancia o **Gate Genérico (Parte A)** para o projeto **Playbook do Time** na branch `ux`, incorporando o estado atual da integração com o **Figma Vega** e a biblioteca React P0. Não transforma o estilo Vega em regra universal para outros projetos.

## B.1. Referência Figma e Estado Atual da Integração

- **Arquivo Figma de Referência**: **shadcn UI Kit – shadcncraft – Free Starter Kit (Community)** (`v3`)
  - **URL**: `https://www.figma.com/design/bl5eJw33wjuSWJwGZ3KUnl/shadcn-UI-Kit-%E2%80%93-shadcncraft-%E2%80%93-Free-Starter-Kit--Community-?node-id=7050-2702`
  - **File Key / Node Base**: `bl5eJw33wjuSWJwGZ3KUnl` / `node-id=7050-2702`
  - **Inventário autenticado completo**: [`docs/design/FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md) (`25` páginas, `25 COMPONENT_SET`s com `439` variantes, `10 COMPONENT`s isolados e `1.159` variáveis locais extraídas via `window.figma`).
  - **Guia de paridade e decisões de adoção**: [`docs/design/FIGMA-REFERENCE.md`](./FIGMA-REFERENCE.md).
- **Modos de Cor Ativos neste Projeto**:
  - **Padrão**: `Vega Light` (`[data-theme="light"]`, coleção `Mode: Light` `9880:2` resolvida contra `Style: Vega` `9880:6`).
  - **Alternativo**: `Vega Dark` (`[data-theme="dark"]`, coleção `Mode: Dark` `9880:3` resolvida contra `Style: Vega` `9880:6`).

---

## B.2. Parâmetros do Template Figma Vega Aplicados aos 10 Pilares

| Pilar do Gate (Parte A) | Parametrização Local no Adaptador SnapIn / Figma Vega (`docs/design/prototype/styles.css`) |
| :--- | :--- |
| **1. Tipografia** | • `--font-sans` / `--font-heading`: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`<br>• `--font-mono`: `'Geist Mono', 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace` (restrita a versão `v3`, situação `3rd & 7`, ordem do game plan `01`, prazos e código de 6 dígitos)<br>• Escala: `--text-xs` (`12px`), `--text-sm` (`14px`), `--text-base` (`16px` — obrigatório em `<input>`, `<select>`, `<textarea>`), `--text-lg` (`18px`), `--text-xl` (`20px`), `--text-2xl` (`24px`), `--text-3xl` (`30px`). |
| **2. Tabular Numbers & Text-Wrap** | • `font-variant-numeric: tabular-nums` em `.tabular`, `code`, `.mono`, `.gameplan-order-num`, contadores de **Confirmados / Ausentes / Sem resposta**, taxas de comparecimento (`%`) e prazos.<br>• `text-wrap: balance` em `[data-slot="section-heading-title"]`, `[data-slot="card-title"]`, `[data-slot="dialog-title"]`, `.mobile-topbar__title`, `.ui-banner__title` e `[data-slot="empty-state"] h3`.<br>• `text-wrap: pretty` em `[data-slot="section-heading-body"]`, `[data-slot="card-description"]`, `[data-slot="dialog-description"]`, `.ui-banner__description`, `.assignment-item`, `.gameplan-note` e `[data-slot="field-description"]`. |
| **3. Superfícies & Raios Concêntricos** | • **Superfícies Light**: `--canvas: #FAFAFA` → `--card: #FFFFFF` (`--border: #E5E5E5`) → `--muted: #F5F5F5`.<br>• **Superfícies Dark**: `--canvas: #0A0A0A` → `--card: #171717` (`--border: #262626`) → `--secondary: #262626` / `--bg-input-30: #1D1D1D` (`--input: #404040`).<br>• **Raios Vega**: `--component-card-radius: 14px` (`--radius-xl`), `--radius-lg: 10px`, `--component-button-radius: 8px` (`--radius-md`), `--component-input-radius: 8px` (`--radius-md`), `--radius-sm: 6px`, `--component-badge-radius: 26px` (`--radius-4xl`).<br>• **Pares Concêntricos Verificados**: `[data-slot="tabs-list"]` (`padding: 4px`, `border-radius: 12px`) com `[data-slot="tabs-trigger"]` (`border-radius: 8px`); `.theme-mode-switcher` (`padding: 3px`, `border-radius: 9px`) com `.theme-mode-btn` (`border-radius: 6px`). |
| **4. Alinhamento Óptico** | • `[data-slot="banner"]`, `[data-slot="error-alert"]` e `.assignment-item` usam `align-items: flex-start` para alinhar ícone/posição à primeira linha.<br>• `[data-slot="avatar-stack"]` usa `--component-avatar-group-overlap: -8px` e recorte `border: 2px solid var(--card)`. |
| **5. Ícones** | • Variável Figma `icon-library/lucide = true`: seletor `[data-slot="icon"]` com `width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; fill: none; flex-shrink: 0`. |
| **6. Hit Areas `44×44px`** | • Token `--touch-min: 44px` adaptado sobre os controles de `36px` do Figma, aplicado a `[data-slot="button"]` (todos os tamanhos, inclusive `sm` e `icon`), `[data-slot="input"]`, `[data-slot="select"]`, `[data-slot="textarea"]`, `[data-slot="tabs-trigger"]`, `.chip`, `.nav-item-btn`, `.bottom-nav-btn` e `[data-slot="accordion"] summary`. |
| **7. Estados & Independência de Cor** | • Foco: `border-color: var(--ring); box-shadow: 0 0 0 3px var(--ring-focus)` (`rgba(23,23,23,0.16)` no Light / `rgba(212,212,212,0.24)` no Dark).<br>• Erro: `border-color: var(--destructive); box-shadow: 0 0 0 3px var(--destructive-focus)`.<br>• Emblemas de domínio (`[data-slot="badge"]`): combinam cor semântica + borda (`1px solid` em `available`, `1px dashed` em `unavailable`, `2px solid` em `injured`, `1px dotted` em `retired`) + glifo (`✓`, `!`, `+`, `—`, `★`) + texto em português. |
| **8. Motion Restraint** | • `--duration-fast: 150ms`, `--duration-normal: 220ms`, `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`.<br>• Reset global `@media (prefers-reduced-motion: reduce)` ativo em `styles.css`. |
| **9. Transições Específicas** | • Proibição de `transition: all`; transições restritas a `background-color`, `border-color`, `color` e `box-shadow`. |
| **10. Imagens & Diagramas** | • `.play-diagram-box` em `--diagram-surface` (`#F8FAFC` Light / `#121820` Dark) com `--diagram-border`, SVG com `viewBox="0 0 600 220"`, contorno interno sutil e zoom nativo via `<dialog data-slot="image-zoom-dialog">`. |

---

## B.3. Biblioteca UI, Vocabulário e Restrições Locais do Projeto

1. **Paridade com a Biblioteca React P0 (`apps/web/src/components/ui/`)**:
   - O protótipo e as especificações seguem o plano em [`COMPONENT-LIBRARY-PLAN.md`](./COMPONENT-LIBRARY-PLAN.md) nas 3 camadas (`Primitives`, `Composed Components` e `Domain Patterns`), usando os atributos `data-slot`, `data-variant`, `data-size` e `data-state`.
2. **Vocabulário Obrigatório (`GLOSSARY.md`)**:
   - Termos exigidos: **jogada**, **playbook**, **unidade** (`Ofensiva`, `Defesa`, `Special teams`), **posição**, **atribuição**, **formação**, **situação**, **game plan**, **time**, **elenco**, **jogador**, **staff**, **papel**, **subpapel**, **coordenador de special teams**, **pendente**, **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`), **evento**, **presença** (treino), **marcação** (jogo), **disponibilidade** e **justificativa**.
3. **Regras Críticas de Visibilidade por Papel (`spec.md` & ADR-0006)**:
   - Para `jogador`: a aba **Elenco** não existe na navegação principal; a **justificativa** de ausência de outros jogadores nunca é exibida (apenas `"Confirmado"` ou `"Ausente"`); nenhum botão de criação/edição de jogada, evento, game plan ou status do elenco é renderizado.
   - Para `staff_pendente`: apenas a tela informativa de aguardo de aprovação por um `head_coach` é exibida.
   - Jogadas de `Special teams` são sempre visíveis para todo o time.
4. **Restrições de Escopo e Ferramental**:
   - Trabalhar exclusivamente em `docs/design/**` durante a etapa de UX; nunca editar `apps/web` ou `apps/api`.
   - Protótipo 100% estático em `docs/design/prototype/index.html` + `styles.css`, sem build, sem Tailwind, sem Motion e sem dependências externas.

---

## B.4. Auditoria Atual da Branch `ux` sob o Gate + Adaptador Vega

| Critério Avaliado | Evidência em `docs/design/**` | Desvios (`S0` / `S1` / `S2`) |
| :--- | :--- | :--- |
| **EV-01: Modos `Vega Light` & `Vega Dark`** | Cadeia `/* shadcncraft:tokens:start */` em `prototype/styles.css` com alternador ao vivo e contraste AA validado. | `0` |
| **EV-02: Viewports `1440×1024` & `390×844`** | Simulador de viewport no topo do protótipo + safe-area iOS (`env(safe-area-inset-*)`) + zero overflow horizontal. | `0` |
| **EV-03: 4 Contextos de Papel/Subpapel** | Seletor de papel (`jogador`, `head_coach`, `coordenador_ofensivo`, `staff_pendente`) ocultando **Elenco** e **justificativas** para jogador. | `0` |
| **EV-04: 4 Estados de Tela** | Seletor de estado (`default`, `loading`, `empty`, `error`) funcional nas 6 telas do MVP + tela de catálogo Figma/P0. | `0` |
| **EV-05: Rastreabilidade Figma (`[E1]`..`[E3]`)** | Documentada em `FIGMA-COMPONENT-INVENTORY.md`, `FIGMA-REFERENCE.md` e `COMPONENT-LIBRARY-PLAN.md`. | `0` |
| **Pilares 1 a 10 (Parte A + Adaptador Parte B)** | Tipografia `Inter`/`Geist Mono`, `16px` em inputs, `tabular-nums`, `text-wrap: balance`/`pretty`, raios concêntricos (`12px/8px` e `9px/6px`), ícones `currentColor` `stroke-width: 2`, alvos `>= 44×44px`, todos os estados interativos, `@media (prefers-reduced-motion: reduce)`, zero `transition: all` e diagramas com proporção e contorno interno. | `0` |

- **Resumo da Auditoria**: `S0 = 0` | `S1 = 0` | `S2 = 0`
- **Veredito Final**: **`Approve`**
