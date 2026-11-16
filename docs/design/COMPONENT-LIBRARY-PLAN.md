# Plano de Arquitetura da Biblioteca de Componentes — Playbook do Time (`docs/design/COMPONENT-LIBRARY-PLAN.md`)

Planejamento técnico revisável para implementação da biblioteca de componentes reutilizáveis do **Playbook do Time** em `apps/web/src/components/`, derivada do arquivo público do Figma **shadcn UI Kit – shadcncraft – Free Starter Kit (Community)** e adaptada às regras de domínio (`GLOSSARY.md`), mobile-first de campo, contraste WCAG 2.1 AA e alvos de toque de `44×44px`.

---

## 1. Fonte de Referência Figma, Acesso/Login e Licenciamento

- **Link público analisado**: `https://www.figma.com/design/bl5eJw33wjuSWJwGZ3KUnl/shadcn-UI-Kit-%E2%80%93-shadcncraft-%E2%80%93-Free-Starter-Kit--Community-?node-id=7050-2702&p=f&t=Eg5DGlusJnGSI2Wq-0`
- **File Key / Node**: `bl5eJw33wjuSWJwGZ3KUnl` / `node-id=7050-2702` (versão **v3**, estilo base **Vega**, atualizado em `2026-11-15`).
- **Diagnóstico de Acesso e Login**:
  - **Sem login no navegador**: o canvas em `node-id=7050-2702` tem `link_access: "view"`, `has_file_link_password: false` e `viewer_export_restricted: false`. É possível visualizar os quadros de apresentação dos **7 componentes + 8 blocos gratuitos**, os **8 estilos shadcn** e a alternância **Light / Dark mode**, além de acessar publicamente os JSONs do registro gratuito (`https://shadcncraft.com/r/radix-vega/<item>.json`).
  - **Exige login / conta Figma**: inspecionar o painel **Local Variables** (`Tailwind` → `Style` → `Mode`), propriedades de variantes editáveis e **Dev Mode (`?mode=dev`)** exige login em conta Figma e duplicação para os rascunhos (*"Open in Figma"*). A API REST (`api.figma.com/v1/files/...`) exige `X-Figma-Token` autenticado (`403 Invalid token` sem credencial).
- **Licenciamento e Impacto no Projeto**:
  - O **Free Starter Kit** é distribuído sob licença **Figma Community** e seus 22 itens de registro (`@shadcncraft/badge`, `avatar-stack`, `section-heading`, `page-heading`, `tagline`, `featured-icon`, `profile-card`, `image-zoom`, `banner-10`, `contact-11`, `use-mobile`, etc.) são abertos e sem chave de licença.
  - Os pacotes `Base Figma` ($119), `Pro Figma` ($299) e `Pro Figma + React` ($499) exigem licença paga por assento (`SHADCNCRAFT_LICENSE_KEY`).
  - **Decisão arquitetural**: **Não contrataremos nem dependeremos de pacotes Pro ou do CLI externo**. Construiremos uma biblioteca interna enxuta em `apps/web/src/components/` seguindo a mesma anatomia `data-slot` 1:1 e os mesmos tokens semânticos (`/* shadcncraft:tokens:start */`) já validados em `docs/design/prototype/styles.css`.

---

## 2. Separação Arquitetural em 3 Camadas (`apps/web/src/components/`)

Para evitar acoplamento entre regras de negócio do futebol americano e controles visuais básicos, a biblioteca divide-se estritamente em três camadas:

```text
apps/web/src/
├── styles/
│   └── tokens.css                    # Cadeia de tokens (Tailwind Primitives -> Style Vega -> Mode Light/Dark)
└── components/
    ├── ui/
    │   ├── primitives/               # Camada 1: Primitivas atômicas sem estado de domínio
    │   │   ├── button.tsx            # [data-slot="button"]
    │   │   ├── badge.tsx             # [data-slot="badge"]
    │   │   ├── input.tsx             # [data-slot="input"]
    │   │   ├── select.tsx            # [data-slot="select"]
    │   │   ├── textarea.tsx          # [data-slot="textarea"]
    │   │   ├── switch.tsx            # [data-slot="switch"]
    │   │   ├── skeleton.tsx          # [data-slot="skeleton"]
    │   │   └── icon.tsx              # [data-slot="icon"] (SVGs Lucide inline)
    │   └── composed/                 # Camada 2: Componentes estruturais multi-slot (padrão shadcn/shadcncraft)
    │       ├── card.tsx              # [data-slot="card | card-header | card-title | card-description | card-content | card-footer"]
    │       ├── field.tsx             # [data-slot="field | field-label | field-description | field-error"]
    │       ├── section-heading.tsx   # [data-slot="section-heading | tagline | section-heading-title | section-heading-body | section-heading-actions"]
    │       ├── tabs.tsx              # [data-slot="tabs | tabs-list | tabs-trigger | tabs-content"]
    │       ├── dialog.tsx            # [data-slot="dialog | image-zoom-dialog"] (<dialog> HTML5 nativo acessível)
    │       ├── banner.tsx            # [data-slot="banner"] (adaptado de @shadcncraft/banner-10)
    │       ├── avatar-stack.tsx      # [data-slot="avatar-stack | avatar-stack-overflow"]
    │       ├── featured-icon.tsx     # [data-slot="featured-icon"]
    │       ├── profile-card.tsx      # [data-slot="profile-card"]
    │       └── state-panels.tsx      # [data-slot="empty-state | error-alert"]
    └── domain/                       # Camada 3: Padrões do Domínio Playbook do Time (vocabulário GLOSSARY.md)
        ├── app-shell.tsx             # Barra inferior mobile (<1024px + safe-area) + Sidebar desktop (>=1024px); oculta Elenco p/ jogador
        ├── unit-badge.tsx            # Emblema de Unidade: Ofensiva, Defesa, Special teams
        ├── roster-status-badge.tsx   # Emblema de Status do elenco: disponivel, indisponivel, lesionado, reformado
        ├── event-response-card.tsx   # Cartão de Presença (treino) e Marcação de Disponibilidade (jogo) c/ prazo
        ├── justification-sheet.tsx   # Formulário de Justificativa obrigatória na recusa (lista + texto livre)
        ├── attendance-summary.tsx    # Painel consolidado Staff (Confirmados, Ausentes c/ justificativa, Sem resposta + Presença real)
        ├── play-card.tsx             # Cartão de Jogada (Unidade, Formação, Situação, Selo de Novidade, Versão)
        ├── play-detail-view.tsx      # Detalhe da Jogada (Todas as Atribuições por Posição, Imagem c/ Zoom, Marcar como estudada, Visibilidade e Revisões)
        ├── game-plan-list.tsx        # Lista ordenada do Game Plan por referência (↑/↓ + Nota do confronto)
        ├── roster-management.tsx     # Filtros de Elenco (Unidade, Posição, Status) + Editor de Status/Observação/Retorno
        ├── staff-approval-queue.tsx  # Fila Head Coach para aprovar/recusar Staff Pendente e conceder Coordenador de Special Teams
        ├── position-selector.tsx     # Seletor de Unidades e múltiplas Posições do Jogador
        ├── pwa-install-banner.tsx    # Convite único de instalação na tela inicial + gesto Web Push (ADR-0002)
        └── staff-contact-card.tsx    # Canal "Falar com o staff" (História 78)
```

---

## 3. Inventário do Figma (`shadcncraft`) e Mapeamento para o Domínio

| Origem no Figma / Registry | Tipo / Tier no Kit | Variantes e Estados no Figma | Destino no Playbook do Time | Camada | Prioridade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Button` (shadcn oficial no kit) | Primitive (`Base`) | `variant`: `default`, `secondary`, `outline`, `ghost`, `destructive`; `size`: `sm`, `default`, `lg`, `icon`; `state`: `default`, `hover`, `focus`, `disabled` | `<Button>` (adaptado para `min-height: 44px` e variante adicional `success` + estado `loading` via `aria-busy`) | 1. Primitive | **P0** |
| `@shadcncraft/badge` (`node 2814-11330`) | Component (`Free`) | `variant`: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`, `success`, `warning`; estados `focus-visible`, `aria-invalid` | `<Badge>` (base) + `<UnitBadge>` (`offense`, `defense`, `st`) + `<RosterStatusBadge>` (`available`, `unavailable`, `injured`, `retired`) + selo `new` | 1. Primitive & 3. Domain | **P0** |
| `Input` / `Select` / `Textarea` (shadcn oficial) | Primitive (`Base`) | `state`: `default`, `focus`, `disabled`, `aria-invalid` (com `bg-input-30` em dark mode) | `<Input>`, `<Select>`, `<Textarea>` com `font-size: 16px` obrigatório (prevenção de auto-zoom no iOS Safari) e `min-height: 44px` | 1. Primitive | **P0** |
| `Switch` / `Checkbox` (shadcn oficial) | Primitive (`Base`) | `checked`: `true`, `false`; `disabled`; `focus-visible` (`bg-input-80`) | `<Switch>` e `<Checkbox>` (preferências de notificação Web Push/e-mail e liberação de visibilidade por unidade) | 1. Primitive | **P1** |
| `Skeleton` (shadcn oficial) | Primitive (`Base`) | Pulsante por dimensão (`sm`, `lg`, `card`) | `<Skeleton>` para estado `loading` de todas as 6 telas | 1. Primitive | **P0** |
| `Card` (shadcn oficial) | Component (`Base`) | Sub-slots: `card`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer` | `<Card>` e subcomponentes com variantes `default`, `highlight`, `warning`, `destructive` | 2. Component | **P0** |
| `Field` (`contact-11` free block) | Component (`Free`) | Sub-slots: `field`, `field-label`, `field-description`, `field-error` | `<Field>` envolvendo inputs com associação automática `htmlFor`, `aria-describedby` e `aria-invalid` | 2. Component | **P0** |
| `@shadcncraft/section-heading` + `@shadcncraft/tagline` (`node 17897-105935`) | Component (`Free`) | `alignment`: `left`, `center`; `size`: `sm`, `lg`; slots `section-heading`, `tagline`, `section-heading-title`, `section-heading-body`, `section-heading-actions` | `<SectionHeading>` padronizando os cabeçalhos das 6 telas e blocos internos | 2. Component | **P1** |
| `Tabs` (shadcn oficial) | Component (`Base`) | `tabs`, `tabs-list`, `tabs-trigger`, `tabs-content` (`component/tabs/list/height-horizontal`) | `<Tabs>` (filtro de unidades no Playbook, abas `Confirmados / Ausentes / Sem resposta` no Evento e `Disponibilidade / Game Plan` no Jogo) | 2. Component | **P0** |
| `@shadcncraft/banner-10` (`node 17859-94327`) | Block (`Free`) | `<aside role="banner">` com ícone de alerta, texto, CTA e botão de fechar | `<Banner>` (base) e `<PwaInstallBanner>` (convite único de instalação PWA na Home — História 74) | 2. Component & 3. Domain | **P0** |
| `@shadcncraft/avatar-stack` (`node 52380-8289`) | Component (`Free`) | `orientation`: `horizontal`, `vertical`; `max`; `avatarSize`; `mask`; slot `avatar-stack-overflow` (`+N`) | `<AvatarStack>` (resumo visual compacto dos jogadores confirmados em cartões de Treino e Jogo) | 2. Component | **P1** |
| `@shadcncraft/image-zoom` | Component (`Free`) | Modal `<dialog>` `h-dvh w-dvw` com `backdrop-blur-md` e `motion-reduce:transition-none` | `<ImageZoomDialog>` para abrir e ampliar a imagem anexada da jogada no Playbook (História 40) sem biblioteca externa | 2. Component & 3. Domain | **P1** |
| `@shadcncraft/featured-icon` (`node 17897-100009`) | Component (`Free`) | `size`: `sm`, `md`, `lg`; moldura quadrada/arredondada com `bg-muted` e borda | `<FeaturedIcon>` usado em estados vazios (`EmptyState`), cabeçalhos de aviso e modal de cadastro | 2. Component | **P2** |
| `@shadcncraft/profile-card` (`node 17897-105981`) | Component (`Free`) | `variant`: `default`, `horizontal`, `vertical`; avatar + nome + subtítulo | `<ProfileCard>` no rodapé da Sidebar desktop e no cartão de identidade da tela **Perfil** | 2. Component | **P1** |
| `@shadcncraft/contact-11` (`node 17859-93196`) | Block (`Free`) | `SectionHeading` + formulário empilhado (`Field` + `Input` + `Textarea` + `Button`) | `<StaffContactCard>` para o canal `"Falar com o staff"` quando o jogador não consegue responder (História 78) | 3. Domain | **P1** |
| `needs-attention-1` (conceito visual no kit) | Pattern (`Pro` — recriado internamente) | Fila de aprovações pendentes para gestores com emblema de categoria e ações inline de aprovar/recusar | `<StaffApprovalQueueCard>` exclusivo para **Head Coach** aprovar/recusar cadastros de staff **pendentes** (Histórias 9, 76) | 3. Domain | **P0** |
| `people-directory-1` / `teams-table-1` (conceito visual) | Pattern (`Pro` — recriado internamente) | Diretório/tabela de membros com filtros de status, função e ações por linha | `<RosterFilterBar>` + `<RosterPlayerCard>` na tela **Elenco** (exclusiva Staff — Histórias 15–18) | 3. Domain | **P0** |

---

## 4. Especificação Detalhada por Camada (`data-slot`, Props, Estados, Acessibilidade e Tokens)

### 4.1. Camada 1 — Primitives (`apps/web/src/components/ui/primitives/`)

#### 1. `<Button>` (**P0**)
- **Anatomia `data-slot`**: `<button data-slot="button" data-variant={variant} data-size={size}>`
- **API / Props sugerida**:
  ```ts
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'secondary' | 'success' | 'destructive' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean; // reflete em aria-busy="true" e bloqueia clique duplo
    fullWidth?: boolean;
  }
  ```
- **Estados obrigatórios**:
  - `default`: fundo e borda conforme `data-variant`, sombra `--shadow-xs`.
  - `hover`: elevação sutil de contraste (`:hover:not(:disabled)`).
  - `focus-visible`: `border-color: var(--ring); box-shadow: 0 0 0 3px var(--custom-focus)`.
  - `active / aria-pressed="true"`: usado nos seletores de presença/marcação (`Vou` em `#059669` sólido; `Não vou` em `#E11D48` sólido).
  - `disabled / aria-disabled="true"`: `opacity: 0.48; cursor: not-allowed; pointer-events: none`.
  - `loading (aria-busy="true")`: renderiza spinner CSS antes do rótulo sem desmontar o texto acessível.
- **Acessibilidade**: `min-height: 44px` e `min-width: 44px` em todos os tamanhos interativos; quando `size="icon"`, exige `aria-label` explícito (ex.: `"Subir Flood Right Z-Post na ordem do game plan"`).
- **Tokens consumidos**: `--primary`, `--primary-foreground`, `--card`, `--secondary`, `--input`, `--ring`, `--custom-focus`, `--color-status-available`, `--color-status-injured`, `--component-button-radius`.

#### 2. `<Badge>` (**P0**)
- **Anatomia `data-slot`**: `<span data-slot="badge" data-variant={variant}>`
- **API / Props sugerida**:
  ```ts
  export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
      | 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
      | 'offense' | 'defense' | 'st' | 'new'
      | 'available' | 'unavailable' | 'injured' | 'retired';
  }
  ```
- **Acessibilidade e Regra de Domínio**: nunca transmite estado apenas por cor. As variantes de domínio são encapsuladas em `<UnitBadge>` e `<RosterStatusBadge>` para injetar automaticamente o glifo/ícone (`✓`, `!`, `+`, `—`, `★`) e o estilo de borda (`solid`, `dashed`, `double`, `dotted`).
- **Tokens consumidos**: `--component-badge-radius` (`--radius-4xl`), `--color-unit-*`, `--color-status-*`, `--color-accent-new-*`.

#### 3. `<Input>`, `<Select>`, `<Textarea>` (**P0**) e `<Switch>` (**P1**)
- **Anatomia `data-slot`**: `data-slot="input"`, `data-slot="select"`, `data-slot="textarea"`, `data-slot="switch"`.
- **Estados obrigatórios**:
  - `default`: fundo `--bg-input-30`, borda `1px solid var(--input)` (contraste mínimo `3.1:1`).
  - `focus-visible`: `border-color: var(--ring); box-shadow: 0 0 0 3px var(--custom-focus)`.
  - `error (aria-invalid="true")`: `border-color: var(--destructive); box-shadow: 0 0 0 3px var(--custom-destructive-focus)`.
  - `disabled`: `opacity: 0.5; cursor: not-allowed`.
- **Acessibilidade**: `min-height: 44px` e `font-size: 1rem` (`16px`) em mobile para impedir zoom forçado no iOS Safari.

---

### 4.2. Camada 2 — Composed Components (`apps/web/src/components/ui/composed/`)

#### 1. `<Card>` e Subcomponentes (**P0**)
- **Anatomia `data-slot`**:
  - `<div data-slot="card" data-variant="default | highlight | warning | destructive">`
  - `<div data-slot="card-header">`
  - `<h3 data-slot="card-title">`
  - `<p data-slot="card-description">`
  - `<div data-slot="card-content">`
  - `<div data-slot="card-footer">`
- **Tokens consumidos**: `--card`, `--card-foreground`, `--border`, `--component-card-radius`, `--component-card-padding`, `--shadow-xs`.

#### 2. `<Field>` (**P0**)
- **Anatomia `data-slot`**:
  - `<div data-slot="field">`
  - `<label data-slot="field-label" htmlFor={id}>`
  - `<p data-slot="field-description" id={`${id}-desc`}>`
  - `<div data-slot="field-error" id={`${id}-err`} role="alert">`
- **API / Props sugerida**:
  ```ts
  export interface FieldProps {
    id: string;
    label: string;
    description?: string;
    error?: string;
    required?: boolean;
    children: React.ReactElement; // clona injetando id, aria-invalid={!!error} e aria-describedby
  }
  ```

#### 3. `<SectionHeading>` e `<Tagline>` (**P1**)
- **Origem**: `@shadcncraft/section-heading` + `@shadcncraft/tagline`.
- **Anatomia `data-slot`**: `data-slot="section-heading"`, `data-slot="tagline"`, `data-slot="section-heading-title"`, `data-slot="section-heading-body"`, `data-slot="section-heading-actions"`.

#### 4. `<Tabs>` (**P0**)
- **Anatomia `data-slot`**: `data-slot="tabs"`, `data-slot="tabs-list"` (`role="tablist"`), `data-slot="tabs-trigger"` (`role="tab"`, `aria-selected`, `aria-pressed`), `data-slot="tabs-content"` (`role="tabpanel"`).
- **Acessibilidade**: navegação por setas horizontais (`ArrowLeft` / `ArrowRight`) e alvo de toque mínimo de `44px` no mobile.

#### 5. `<AvatarStack>` (**P1**), `<Banner>` (**P0**), `<Dialog>` / `<ImageZoomDialog>` (**P1**)
- **`<AvatarStack>`**: `data-slot="avatar-stack"` + `data-slot="avatar-stack-overflow"`. Props: `items: Array<{ id: string; initials: string; name: string }>`, `max?: number` (default `3`), `totalCount: number`. Exige `aria-label={`${totalCount} jogadores confirmados`}`.
- **`<Banner>`**: `<aside data-slot="banner" role="banner" aria-label={title}>` com botão de dispensa de `44×44px`.
- **`<ImageZoomDialog>`**: `<dialog data-slot="image-zoom-dialog">` usando a API nativa `HTMLDialogElement.showModal()` e `.close()`, com suporte nativo à tecla `Escape`, trap de foco e respeito a `prefers-reduced-motion: reduce`.

---

### 4.3. Camada 3 — Domain Patterns & Screen Compositions (`apps/web/src/components/domain/`)

Todos os componentes desta camada usam estritamente o vocabulário de `GLOSSARY.md`:

| Componente Composto | Prioridade | Telas onde é usado | Props e Regras de Domínio / Autorização |
| :--- | :--- | :--- | :--- |
| `<AppShell>` | **P0** | Todas as 6 telas | Props: `userRole: 'jogador' \| 'staff'`, `subRoles: StaffSubRole[]`, `approvalStatus: 'ativo' \| 'pendente' \| 'recusado'`. **Regra crítica**: quando `userRole === 'jogador'`, o item de navegação **Elenco** não é renderizado no DOM nem na barra inferior mobile nem na sidebar desktop (Seam 2). Se `approvalStatus === 'pendente'`, renderiza apenas o estado bloqueante `<PendingStaffScreen>`. |
| `<UnitBadge>` | **P0** | Home, Playbook, Jogo, Elenco, Perfil | Props: `unit: 'ofensiva' \| 'defesa' \| 'special_teams'`. Renderiza `<Badge data-variant="offense \| defense \| st">` com texto em caixa alta. |
| `<RosterStatusBadge>` | **P0** | Home, Jogo, Elenco, Perfil | Props: `status: 'disponivel' \| 'indisponivel' \| 'lesionado' \| 'reformado'`, `returnDate?: string`. Renderiza ícone (`✓`, `!`, `+`, `—`) + rótulo do `GLOSSARY.md` + borda distinta. |
| `<EventResponseCard>` | **P0** | Home, Evento, Jogo | Props: `eventType: 'treino' \| 'jogo'`, `deadlineIso: string`, `isPastDeadline: boolean`, `currentResponse?: 'vou' \| 'nao_vou'`, `realAttendance?: 'presente' \| 'ausente'`. Para `treino` usa o termo **Presença**; para `jogo` usa o termo **Marcação** de **Disponibilidade**. Após o prazo (`isPastDeadline`), desabilita os botões (`disabled`) e exibe atalho para `<StaffContactCard>`. |
| `<JustificationSheet>` | **P0** | Evento, Jogo | Abre automaticamente ao selecionar `Não vou`. Exige escolha de motivo rápido (`<Select>`) + `<Textarea>` de complemento livre. Exibe aviso de sigilo (`"Visível apenas para o staff"`). |
| `<AttendanceSummaryPanel>` | **P0** | Evento, Jogo | Para `staff`: exibe as 3 abas consolidadas (`Confirmados`, `Ausentes com justificativa`, `Sem resposta`), a **justificativa** completa, a **taxa de comparecimento** (`%`) e, em treinos, o seletor pós-evento de **presença real**. Em jogos, cruza com `<RosterStatusBadge>` alertando sobre jogadores `lesionado` ou `reformado`. Para `jogador`: renderiza apenas `Confirmado` ou `Ausente`, **sem jamais exibir justificativa** (História 54). |
| `<PlayCard>` & `<PlayDetailView>` | **P0** | Home, Playbook, Jogo | Exibe nome da **jogada**, **unidade**, **formação**, **situação** (down e distância), versão (`v3`) e **selo de novidade** (`!isRead`). No detalhe, lista **todas as atribuições** por **posição** (destacando as posições do jogador logado), abre a imagem anexada via `<ImageZoomDialog>` e permite clicar em `"Marcar que estudei esta jogada"` (`play_read`). Para `staff` com subpapel autorizado na unidade, habilita edição, upload de imagem, arquivamento, controle de **visibilidade por unidade** (default: unidade dona; `Special teams` sempre aberta a todo o time — ADR-0006) e consulta do **histórico de versões** (`play_revision`). |
| `<GamePlanList>` | **P1** | Jogo | Lista ordenada (`#01`, `#02`...) de itens referenciando jogadas do playbook (`game_plan_item` — ADR-0004) com a **nota** daquele confronto. Para `staff`, exibe botões acessíveis `↑`/`↓` (`44×44px`), editor de nota e seletor `"+ Adicionar jogada do playbook"`. |
| `<RosterManagementView>` | **P1** | Elenco (exclusivo Staff) | Barra de filtros combináveis (`Unidade`, `Posição`, `Status do elenco`, busca por nome), botão `"+ Registrar jogador no elenco"` (pré-cadastro — História 77) e formulário para alterar `status do elenco`, `observação` e `data prevista de retorno` (quando `lesionado`). |
| `<StaffApprovalQueueCard>` | **P0** | Home, Elenco (exclusivo Head Coach) | Lista cadastros de staff no estado **pendente** com botões `✓ Aprovar` e `✕ Recusar` (Histórias 9, 76), além da seção de staff ativo com toggle para conceder cumulativamente o subpapel de **coordenador de special teams** (História 10) e botão `"Remover papel de staff"` (História 75). |
| `<PwaInstallBanner>` | **P0** | Home, Perfil | Convite único na Home (dispensável sem insistir) explicando a instalação na tela inicial no iOS/Android, botão de gesto explícito para ativar Web Push (VAPID) e informação sobre e-mail como rede de segurança (ADR-0002, Histórias 73, 74). |

---

## 5. Itens do Figma Explicitamente Fora do Escopo (Rejeitados)

Para proteger o foco do MVP (`.scratch/playbook/spec.md`) e evitar sobreconstrução (`lean-build`), os seguintes itens presentes no arquivo Figma ou no catálogo shadcncraft estão **fora do escopo e não devem ser implementados**:

1. **Blocos e componentes de Marketing / Landing Page**: `marquee`, `star-rating`, `testimonials-11`, `newsletter-signup-5`, `benefits-13`, `footer-4`, `faqs-4`, `hero-*`, `cta-*`, `pricing-card-*`, `pricing-table-*`, `blog-listing-*`.
2. **Navegação superior de marketing (`top-navigation-5` e `mobile-navigation-menu` tipo hambúrguer)**: o app utiliza barra inferior fixa no celular e barra lateral esquerda no desktop.
3. **Componentes de E-commerce e Finanças**: `cart-item-*`, `product-card-*`, `banking-dashboard-*`, `spending-balance-*`, `transactions-*` (pagamentos e mensalidades estão explicitamente fora do escopo na linha 202 do spec).
4. **Componentes de Chat / IA e Upload Drag-and-Drop Complexo**: `messaging`, `reasoning-part-*`, `tool-part-*`, `questionnaire-part-*`. (O anexo de imagem da jogada pelo coach na história 22 usa um `<input type="file" accept="image/*">` simples dentro do formulário da jogada).
5. **Editor visual de desenho de rotas em canvas**: fora do escopo do MVP conforme ADR-0003 (*"Jogada estruturada agora, editor de desenho depois"*).

---

## 6. Avaliação de Dependências e Licenças para `apps/web`

### 6.1. Recomendação Padrão: Biblioteca Interna Sem Dependências Externas (`0 deps`)

- `apps/web/package.json` atualmente depende apenas de `react` (`^19.3.1`) e `react-dom` (`^19.3.1`).
- **Por que implementar internamente em `apps/web/src/components/ui/` sem instalar bibliotecas de terceiros**:
  1. **Paridade imediata com `docs/design/prototype/styles.css`**: todos os tokens semânticos (`/* shadcncraft:tokens:start */`) e seletores `[data-slot="..."]` já estão prontos e testados em Light e Dark mode.
  2. **Acessibilidade nativa superior no mobile**: `<dialog>` nativo resolve modais e zoom de imagem com suporte nativo do iOS/Android; `<select>` nativo aciona o seletor de roda/folha nativa do celular com alvo de toque perfeito sob sol; `<button aria-pressed>` e `role="tablist"` cobrem todas as interações exigidas pelo Seam 2 (testes com React Testing Library + MSW).
  3. **Zero fricção de licenciamento ou compatibilidade com React 19**: não exige licença comercial do shadcncraft nem adiciona dependências transitivas.

### 6.2. Avaliação Condicional de `lucide-react` e `@radix-ui/*`

| Pacote Avaliado | Licença | Veredito | Justificativa Técnica |
| :--- | :--- | :--- | :--- |
| `lucide-react` | ISC (Open Source) | **Opcional (Permitido se desejado pelo frontend)** | É a biblioteca de ícones oficial do estilo **Vega** no Figma shadcncraft. Como o Playbook do Time usa cerca de 12–15 ícones fixos (Home, Evento, Playbook, Jogo, Elenco, Perfil, Busca, Zoom, Check, Alerta, Cadeado, Setas `↑`/`↓`), o frontend pode copiar os `<svg data-slot="icon">` diretamente do protótipo (`0 KB` de dependência) ou instalar `lucide-react` caso prefira importar `<Home />`, `<BookOpen />`, etc. |
| `@radix-ui/react-*` / `shadcn` CLI | MIT (Open Source) | **Não recomendado no MVP** | Os componentes complexos do Radix (DropdownMenu posicionado via Popper, Popover flutuante, Tooltip de hover) são voltados a mouse em desktop. No celular em campo, `<dialog>` nativo, `<select>` nativo e gavetas inline têm melhor ergonomia e são mais simples de testar em `jsdom` + Vitest. |
| `@shadcncraft/*` (Pro Registry) | Comercial por assento | **Rejeitado** | Exige chave de licença paga para itens Pro e instala blocos de marketing/SaaS desnecessários para o domínio do Playbook do Time. |
| `react-medium-image-zoom` | MIT | **Rejeitado** | Usado internamente pelo `@shadcncraft/image-zoom`, mas substituído com vantagem por `<dialog data-slot="image-zoom-dialog">` nativo de 20 linhas. |
