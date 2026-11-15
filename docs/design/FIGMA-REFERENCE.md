# Referência Figma — shadcncraft Free Starter Kit (`docs/design/FIGMA-REFERENCE.md`)

Análise técnica, arquitetura de tokens e guia de paridade entre o arquivo oficial **shadcn UI Kit – shadcncraft – Free Starter Kit (Community)** (`node-id=7050-2702`), o inventário autenticado ([`FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md)), a biblioteca React P0 implementada em [`apps/web/src/components/ui/`](../../apps/web/src/components/ui/README.md) e o protótipo navegável em [`docs/design/prototype/`](./prototype/index.html).

- **URL de referência**: `https://www.figma.com/design/bl5eJw33wjuSWJwGZ3KUnl/shadcn-UI-Kit-%E2%80%93-shadcncraft-%E2%80%93-Free-Starter-Kit--Community-?node-id=7050-2702&p=f&t=Eg5DGlusJnGSI2Wq-0`
- **File Key**: `bl5eJw33wjuSWJwGZ3KUnl`
- **Node focado**: `7050:2702` (`Start here` — quadros `10354:4189` e `10335:6000` da arquitetura **shadcncraft v3**)
- **Inventário completo extraído da sessão autenticada**: [`docs/design/FIGMA-COMPONENT-INVENTORY.md`](./FIGMA-COMPONENT-INVENTORY.md) (`25` páginas, `25 COMPONENT_SET`s com `439` variantes, `10 COMPONENT`s isolados e `1.159` variáveis locais)
- **Biblioteca React P0 implementada**: [`apps/web/src/components/ui/`](../../apps/web/src/components/ui/FIGMA-REACT-MATRIX.md) (`primitives/` + `composed/`)

---

## 1. Diagnóstico Real de Acesso (Sessão Autenticada vs. Dev Mode vs. API REST)

1. **Design Mode Autenticado + Runtime `window.figma` + Painel `&view=variables` (`100% EXTRAÍDO`)**:
   - Na sessão autenticada do Figma, extraímos diretamente via `window.figma` todas as **1.159 variáveis locais** distribuídas nas 3 coleções (`Tailwind`: `528`, `Style`: `553` com todos os 8 modos incluindo `Vega`, e `Mode`: `78` em `Light` e `Dark`), além das `componentPropertyDefinitions` de todos os `25 COMPONENT_SET`s e `10 COMPONENT`s.
2. **Dev Mode (`&m=dev`) (`BLOQUEADO NO PLANO FIGMA FREE`)**:
   - Requer assinatura **Figma Professional** (*"Upgrade to work in Dev Mode"*). Essa restrição foi integralmente suprida pela extração da árvore de cena (`window.figma`) combinada aos artefatos TSX oficiais gratuitos de `https://shadcncraft.com/r/radix-vega/<item>.json`.
3. **Itens Pro do Catálogo `shadcncraft` (`BLOQUEADOS SEM LICENÇA COMERCIAL`)**:
   - Os quadros da página `Pro` (`10335:4860`) no arquivo gratuito são capturas estáticas de vitrine. Toda a implementação do **Playbook do Time** usa exclusivamente os componentes e tokens abertos do kit + HTML5/CSS nativo, sem qualquer dependência de licença paga.

---

## 2. Arquitetura do Kit (`Tailwind` → `Style: Vega` → `Mode: Light & Dark`)

### 2.1. Cadeia das 3 Coleções de Variáveis (`1.159 variáveis`)

Em `docs/design/prototype/styles.css` (bloco `/* shadcncraft:tokens:start */`), reproduzimos fielmente a resolução em 3 camadas do Figma:

1. **Collection 1 — `Tailwind` (`VariableCollectionId:9880:18406` — 528 variáveis)**:
   - Primitivas de cor (`neutral/50..950`, `emerald`, `green`, `amber`, `red`, `sky`, `violet`), escala de espaçamento base `4px` (`--space-1` a `--space-12`) e raios brutos.
2. **Collection 2 — `Style: Vega` (`VariableCollectionId:9880:18408`, modo `9880:6` — 553 variáveis)**:
   - Tipografia `Inter` (`--font-sans`, `--font-heading`) e `Geist Mono` / `JetBrains Mono` (`--font-mono`) com `font-variant-numeric: tabular-nums`.
   - Biblioteca de ícones `icon-library/lucide = true` (`[data-slot="icon"]`, `16×16px`, `stroke-width: 2`).
   - Raios de componente do modo `Vega`: `--component-button-radius: 8px` (`radius/md`), `--component-input-radius: 8px` (`radius/md`), `--component-card-radius: 14px` (`radius/xl`), `--component-badge-radius: 26px` (`radius/4xl`).
   - Adaptação obrigatória de domínio: `--touch-min: 44px` em todos os controles acionáveis (`Button`, `Input`, `Select`, `TabsTrigger`, `Chip`, itens de navegação).
3. **Collection 3 — `Mode` (`VariableCollectionId:9880:18407` — 78 variáveis)**:
   - **`Vega Light` (`[data-theme="light"]` — PADRÃO)**: superfície limpa e neutra fiel ao Figma (`--background: #FFFFFF`, `--canvas: #FAFAFA`, `--card: #FFFFFF`, `--foreground: #0A0A0A`, `--primary: #171717`, `--secondary: #F5F5F5`, `--muted: #F5F5F5`, `--muted-foreground: #525252` com contraste `7.5:1` AA, `--border: #E5E5E5`, `--input: #D4D4D4`).
   - **`Vega Dark` (`[data-theme="dark"]` — ALTERNATIVO)**: escala neutra `neutral-950/900` fiel ao modo escuro do kit (`--background: #0A0A0A`, `--card: #171717`, `--foreground: #FAFAFA`, `--primary: #E5E5E5`, `--secondary: #262626`, `--muted-foreground: #A3A3A3` com contraste `6.9:1` AA, `--border: #262626`, `--input: #404040`, `--bg-input-30: #1D1D1D`).
   - **Zero layout genérico de IA ou dashboard tático neon**: o protótipo abandona fundos azul-marinho saturados e quadros verde-escuro artificiais em favor da composição editorial e limpa do **Vega**, inclusive no diagrama da jogada (`--diagram-surface: #F8FAFC` no Light e `#121820` no Dark).

### 2.2. Paridade 1:1 entre Figma, Biblioteca React P0 (`apps/web/src/components/ui/`) e Protótipo

O protótipo em `docs/design/prototype/index.html` e `styles.css` consome exatamente a mesma anatomia `data-slot`, `data-variant`, `data-size`, `data-state` e classes `.ui-*` implementadas em `apps/web/src/components/ui/`:

| Origem no Figma (`Node ID`) | Componente em `apps/web/src/components/ui/` | Atributos `data-slot` & Variantes no Protótipo | Estados Demonstrados ao Vivo no Protótipo |
| :--- | :--- | :--- | :--- |
| `2814:11933` / Set `9892:5454` (`308` vars) | `primitives/button.tsx` (`.ui-btn`) | `data-slot="button"`, `data-variant="default \| primary \| secondary \| outline \| ghost \| link \| destructive \| success"`, `data-size="sm \| default \| lg \| icon"` | `default`, `hover` (`data-state="hover"`), `focus` (`data-state="focus"`), `disabled`, `loading` (`aria-busy="true"` + `<Spinner>`), `error` (`aria-invalid="true"`) |
| `9713:3107` / Set `9892:4091` (`20` vars) | `primitives/badge.tsx` (`.ui-badge`) | `data-slot="badge"`, `data-variant="default \| secondary \| outline \| destructive \| ghost \| link \| success \| warning \| offense \| defense \| st \| new \| available \| unavailable \| injured \| retired \| position"` |Variantes base do shadcn + variantes de domínio com independência de cor (borda sólida, tracejada, dupla, pontilhada + glifo + texto) |
| `2819:27270` / Set `9892:11430` (`21` vars) | `primitives/input.tsx` (`.ui-input`) | `data-slot="input"`, `data-state="hover \| focus \| disabled \| error"` | `default`, `hover`, `focus` (`effect: focus/input`), `disabled`, `error` (`aria-invalid="true"`) |
| Base Kit / `9881:54151` (`9892:18616`) | `primitives/select.tsx` (`.ui-select`) & `<textarea data-slot="textarea">` | `data-slot="select"`, `data-slot="textarea"` | `default`, `hover`, `focus`, `disabled`, `error` (`aria-invalid="true"`) |
| `10317:66519` / Comp `10292:63620` | `primitives/spinner.tsx` (`.ui-spinner`) | `data-slot="spinner"`, `role="status"` (`sm`, `default`, `lg`) | Dentro de botões `aria-busy="true"` e no painel global de carregamento |
| `9880:18319` / Sets `9892:3711`, `3738` | `primitives/avatar.tsx` (`.ui-avatar`) + `AvatarStack` | `data-slot="avatar"`, `data-slot="avatar-fallback"`, `data-slot="avatar-stack"`, `data-slot="avatar-stack-overflow"` | Tamanhos `sm`, `default`, `lg`, indicador `.ui-avatar__badge` e pilha com `+25` |
| `9892:14579` / Set `9892:14300` (`9` vars) | `primitives/section-heading.tsx` (`.ui-section-heading`) | `data-slot="section-heading"`, `section-heading-tagline`, `section-heading-title`, `section-heading-body`, `section-heading-actions` | `data-justification="space-between \| left \| center"`, `data-size="large \| small"` |
| `9880:2019` / Set `9883:5748` (`Banner 10`) | `primitives/banner.tsx` (`.ui-banner`) | `data-slot="banner"`, `data-variant="default \| highlight \| warning"` | Banner de instalação PWA + Web Push na Home com ação de dispensar |
| Registry `image-zoom` + Modal | `primitives/dialog.tsx` (`.ui-dialog`) | `data-slot="dialog"`, `dialog-panel`, `dialog-header`, `dialog-title`, `dialog-description`, `dialog-footer`, `dialog-close` | Modais nativos `<dialog>` para Cadastro/Login, Exclusão de Conta, Demo P0 e Zoom da Jogada |
| `2819:20398` / Sets `9892:10458`, `10376`, `10403` | `composed/card.tsx` (`.ui-card`) | `data-slot="card"`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer` | `data-variant="default \| highlight \| warning \| danger"`, `data-size="default \| sm"` |
| `9880:5406` (`Contact 11`) + `component/field/*` | `composed/field.tsx` (`.ui-field`) | `data-slot="field"`, `field-label`, `field-hint`, `field-error` (`role="alert"`) | Normal, `data-disabled="true"` e `data-invalid="true"` (validação ao vivo da justificativa) |

---

## 3. O que foi Adotado e Adaptado vs. O que foi Rejeitado

| Elemento do Kit Figma (`bl5eJw33wjuSWJwGZ3KUnl`) | Decisão | Como foi aplicado no Playbook do Time |
| :--- | :--- | :--- |
| **Estilo `Vega` com `Light` como padrão e `Dark` alternativo** | **Adotado (`P0`)** | `Vega Light` é o tema padrão (`data-theme="light"`), com alternância instantânea para `Vega Dark` (`data-theme="dark"`) na barra superior do protótipo. |
| **Controles `Button`, `Input`, `Select`, `Textarea` (`36px` no Figma)** | **Adaptado (`>= 44×44px`)** | Elevados para `min-height: 44px` e `font-size: 16px` para operação de toque em campo e prevenção de auto-zoom no iOS Safari. |
| **`Badge` (`Set 9892:4091`)** | **Adaptado (Independência de Cor)** | Além das 8 variantes base, inclui as variantes de domínio (`offense`, `defense`, `st`, `new`, `available`, `unavailable`, `injured`, `retired`, `position`) combinando cor + borda distinta + glifo + texto. |
| **`Banner 10` (`Set 9883:5748`) e `Contact 11` (`Set 9883:8297`)** | **Adotados e Adaptados** | Convertidos no `<PwaInstallBanner>` (Home) e no cartão `"Falar com o Staff"` (Perfil/Evento — História 78). |
| **`Top Navigation 5` (`Set 9883:12288`)** | **Rejeitado** | Substituído pelo `<AppShell>` com barra inferior fixa no celular (`< 1024px`, respeitando `safe-area-inset-bottom`) e Sidebar fixa no desktop (`>= 1024px`), ocultando a aba **Elenco** quando `papel === 'jogador'`. |
| **Blocos de Marketing (`Benefits 13`, `FAQ 4` como página, `Footer 4`, `Newsletter Signup 5`, `Testimonial 11`, `Star rating`, `Kbd`)** | **Rejeitados** | Fora do escopo operacional do MVP. |

---

## 4. Validação Responsiva Realizada (`Desktop 1440×1024` e `Mobile 390×844`)

O protótipo refeito (`docs/design/prototype/index.html` + `styles.css`) foi inspecionado e validado em:
1. **Desktop `1440×1024` (`Vega Light` & `Vega Dark`)**:
   - Sidebar esquerda fixa (`264px`, tokens `--sidebar-*`) com `<ProfileCard>` no rodapé;
   - Grids de 2 e 3 colunas e layout mestre-detalhe (`5fr / 7fr`) no Playbook e no Game Plan;
   - Catálogo interativo `Componentes Figma & P0` exibindo todos os swatches, variantes e estados lado a lado;
   - Zero overflow horizontal (`scrollWidth <= clientWidth`).
2. **Mobile `390×844` (`Vega Light` & `Vega Dark`)**:
   - Barra de navegação inferior fixa (`[data-slot="bottom-nav"]`) com `env(safe-area-inset-bottom)` e alvos `>= 44×44px`;
   - Aba **Elenco** estritamente ausente para `jogador` e visível para `staff`;
   - Empilhamento em 1 coluna sem truncamento e sem barra de rolagem horizontal.
