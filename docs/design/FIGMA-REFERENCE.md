# Referência Figma — shadcncraft Free Starter Kit (`docs/design/FIGMA-REFERENCE.md`)

Análise técnica e guia de adaptação do arquivo público do Figma **shadcn UI Kit – shadcncraft – Free Starter Kit (Community)** para o domínio mobile-first do **Playbook do Time** (`Navigators FA`).

- **URL de referência**: `https://www.figma.com/design/bl5eJw33wjuSWJwGZ3KUnl/shadcn-UI-Kit-%E2%80%93-shadcncraft-%E2%80%93-Free-Starter-Kit--Community-?node-id=7050-2702&p=f&t=Eg5DGlusJnGSI2Wq-0`
- **File Key**: `bl5eJw33wjuSWJwGZ3KUnl`
- **Node focado**: `7050-2702` (`7050:2702` — Página de apresentação / Getting Started & Overview da arquitetura v3 do Free Starter Kit)
- **Última atualização verificada nos metadados do arquivo**: `2026-11-15T11:01:57.145Z` (versão de Novembro/2026, arquitetura **shadcncraft v3**)

---

## 1. Diagnóstico de Acesso e Limitações (O que é público vs. O que exige login)

1. **Acesso público sem login no navegador (`link_access: "view"`)**:
   - Os metadados públicos do arquivo (`/api/files/bl5eJw33wjuSWJwGZ3KUnl`) confirmam `link_access: "view"`, `has_file_link_password: false` e `viewer_export_restricted: false`.
   - Qualquer pessoa com um navegador moderno consegue abrir a URL pública e o embed (`/embed?embed_host=share&url=...`) para visualizar o canvas (WebGL / HTMLInCanvas), navegar até o `node-id=7050-2702` e visualizar os quadros de apresentação dos **7 componentes + 8 blocos gratuitos**, os **8 estilos shadcn** e a alternância **Light / Dark mode**.
   - Adicionalmente, o catálogo gratuito correspondente no registro React (`https://shadcncraft.com/r/radix-vega/<item>.json`) e a documentação de variáveis v3 (`https://shadcncraft.com/docs/figma/variables`) são 100% públicos sem autenticação nem chave de licença.

2. **O que EXIGE login no Figma (ou autenticação adicional)**:
   - **Inspeção do painel `Local Variables` (coleções `Tailwind`, `Style` e `Mode`), árvore de camadas editável, painel de propriedades de variantes e Dev Mode (`?mode=dev`)**: exige estar autenticado em uma conta Figma e duplicar o arquivo da comunidade para os próprios rascunhos (*"Open in Figma"* / *"Duplicate to your drafts"*). Visitantes anônimos no navegador veem o canvas em modo somente leitura limitada, sem acesso ao painel de variáveis nem ao Dev Mode.
   - **API REST oficial do Figma (`GET https://api.figma.com/v1/files/bl5eJw33wjuSWJwGZ3KUnl/nodes?ids=7050:2702`)**: exige autenticação via Personal Access Token (`X-Figma-Token`) ou OAuth; sem token retorna `HTTP 403 {"status":403,"err":"Invalid token"}`.
   - **Acesso HTTP automatizado sem cabeçalhos de navegador**: requisições diretas sem User-Agent de navegador são bloqueadas pelo WAF/CloudFront do Figma (`HTTP 403 Request blocked`).
   - **Itens fora do Free Starter Kit**: o arquivo gratuito disponibiliza 7 componentes (`badge`, `avatar-stack`, `featured-icon`, `image-zoom`, `page-heading`, `profile-card`, `section-heading`/`tagline` + `marquee`, ` placeholder-logo`, `star-rating`) e 8 blocos (`banner-10`, `benefits-13`, `contact-11`, `faqs-4`, `footer-4`, `newsletter-signup-5`, `testimonials-11`, `top-navigation-5`). Os demais 352 blocos Pro, 58 componentes Pro e a geração automática de código pelo plugin exigem licença comercial (`Base Figma` / `Pro Figma + React`).

---

## 2. Análise da Arquitetura do Kit (`node-id=7050-2702` e Padrões shadcn / shadcncraft v3)

### 2.1. Cadeia de 3 Coleções de Variáveis (`Tailwind` → `Style` → `Mode`)

No shadcncraft v3, nenhum componente usa valores hexadecimais fixos; toda propriedade resolve em uma cadeia de três coleções:
1. **`Tailwind` (Primitivas)**: escala base de espaçamento (`n × 4px`), largura de borda, raio bruto, opacidade e paleta de cores base.
2. **`Style` (8 estilos visuais nativos)**: coleção multi-modo com os 8 estilos oficiais do ecossistema shadcn:
   - **Vega** *(referência principal adotada)*: limpo, neutro e familiar (`Inter` para corpo/títulos, `JetBrains Mono` para código/dados tabulares, ícones `Lucide`, escala de espaçamento 1:1 com Tailwind).
   - **Nova** e **Mira**: estilos compactos com redução de padding/margem (`pro/space/4` resolve para `12px` em vez de `16px`).
   - **Maia** e **Luma**: arredondados (`rounded-4xl` em badges) e espaçamento generoso.
   - **Lyra**: cantos retos/quadrados voltado a interfaces totalmente monoespaçadas.
   - **Sera**: editorial com serifas (`Playfair Display`) e espaçamento expandido.
   - **Rhea**: variação compacta do Luma.
3. **`Mode` (`Light` e `Dark`)**: coleção semântica aplicada diretamente às camadas dos componentes:
   - Superfícies e texto: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `muted`, `muted-foreground`.
   - Ações e destaque: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`.
   - Bordas, inputs e foco: `border`, `input`, `ring`, além dos tokens específicos do shadcncraft para contraste em modo escuro (`bg-input-30`, `bg-input-50`, `bg-input-80`, `custom/focus`, `custom/destructive-focus`) e cores semânticas de estado (`--success`, `--warning`, `--info`).

### 2.2. Anatomia `data-slot` 1:1 entre Figma e DOM

A decisão arquitetural central do kit é nomear cada camada interna no Figma exatamente com o valor do atributo `data-slot` renderizado pelo componente React:
- Cartões: `data-slot="card"`, `data-slot="card-header"`, `data-slot="card-title"`, `data-slot="card-description"`, `data-slot="card-content"`, `data-slot="card-footer"`.
- Cabeçalhos de seção (`@shadcncraft/section-heading`): `data-slot="section-heading"`, `data-slot="tagline"`, `data-slot="section-heading-title"`, `data-slot="section-heading-body"`, `data-slot="section-heading-actions"`.
- Emblemas (`@shadcncraft/badge`): `data-slot="badge"` com `data-variant="default | secondary | destructive | outline | ghost | success | warning"`.
- Pilha de avatares (`@shadcncraft/avatar-stack`): `data-slot="avatar-stack"` e `data-slot="avatar-stack-overflow"` (`+N`).
- Campos de formulário (`Field`): `data-slot="field"`, `data-slot="field-label"`, `data-slot="field-description"`, `data-slot="field-error"`.

### 2.3. Estados Interativos nos Componentes do Kit

Extraído diretamente da implementação de referência do kit (`radix-vega`):
- **Foco visível (`:focus-visible`)**: combinação de borda ativa + anel translúcido externo (`focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`).
- **Erro / Inválido (`[aria-invalid="true"]`)**: borda destrutiva + halo de alerta (`aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`).
- **Redução de movimento (`prefers-reduced-motion`)**: uso explícito de `motion-reduce:transition-none` (como visto em `@shadcncraft/image-zoom`).

---

## 3. O que foi Adotado e Adaptado vs. O que foi Rejeitado

Seguindo a diretriz de **adaptar sem copiar cegamente**, preservando o domínio esportivo mobile-first, contraste WCAG AA e vocabulário do `GLOSSARY.md`:

### 3.1. Adotado com Adaptação ao Playbook do Time

| Elemento do Kit Figma / shadcn | Como foi adaptado para o Playbook do Time | Onde impacta (`docs/design/`) |
| :--- | :--- | :--- |
| **Tokens Semânticos `Mode` (`Light` & `Dark`) + Região Gerenciada (`shadcncraft:tokens`)** | Implementamos as 3 coleções de variáveis do Figma (`1. Tailwind Primitives` → `2. Style: Vega` → `3. Mode: Light & Dark`) dentro do bloco `/* shadcncraft:tokens:start */`. O modo **Light** (padrão de capa do Figma Starter Kit: `--background: #F8FAFC`, `--card: #FFFFFF`, `--primary: #0F172A`, `--border: #E2E8F0`, `--muted-foreground: #475569` com `7.5:1` AA) e o modo **Dark** (`zinc-950` `--background: #09090B`, `--card: #121215`, `--primary: #FAFAFA`, `--border: #27272A`, `--muted-foreground: #A1A1AA` com `7.8:1` AA) podem ser alternados ao vivo pelo seletor `[☀ Light | ☾ Dark]` no topo do protótipo. | `README.md`, `prototype/styles.css`, `prototype/index.html` |
| **Ícones Vetoriais Lucide (`data-slot="icon"`) e Catálogo Interativo do Design System** | Substituímos os emojis de navegação por ícones vetoriais SVG no padrão **Lucide** (`stroke-width: 2`, `16×16px`, padrão do estilo `Vega`) e adicionamos a tela/aba **`Design System (Vega)`** (`data-nav="design-system"`) demonstrando ao vivo todos os swatches semânticos, escala de espaçamento `pro/space/*`, botões, badges, campos e componentes em todos os estados (`default`, `hover`, `focus-visible`, `disabled`, `aria-busy`, `aria-invalid`). | `prototype/index.html`, `prototype/styles.css` |
| **Contraste de Inputs em Dark Mode (`bg-input-30`)** | Aplicamos o padrão `bg-input-30` do shadcncraft (`--input-bg: #0E1626` com borda `--input: #3E5480` de contraste `3.1:1`) para que campos de busca, seleção de posição e texto livre de justificativa se destaquem nitidamente sobre o fundo do `--card` (`#131C2E`). | `README.md`, `prototype/styles.css` |
| **Anatomia `data-slot` e `data-variant` no DOM** | Todos os componentes especificados e o HTML do protótipo passam a expor `data-slot="card"`, `data-slot="card-header"`, `data-slot="badge"`, `data-slot="section-heading"`, `data-slot="avatar-stack"`, `data-slot="banner"`, `data-slot="field"` e `data-variant="..."`, permitindo paridade 1:1 com a implementação React e seletores estáveis nos testes. | `README.md`, `screens/*.md`, `prototype/index.html` |
| **Componente `Badge` (`@shadcncraft/badge`)** | Adotamos as variantes `default`, `secondary`, `destructive`, `outline`, `success` e `warning` (`rounded-full` / `rounded-4xl`), adicionando obrigatoriamente variante visual + estilo de borda distinto para nunca depender só de cor nos status do elenco (`disponivel`, `indisponivel`, `lesionado`, `reformado`), unidades e respostas. | `README.md`, `screens/*.md`, `prototype/index.html` |
| **Componente `AvatarStack` (`@shadcncraft/avatar-stack`)** | Adotado no cabeçalho dos cartões de **Evento** e **Jogo** para exibir compactamente as iniciais dos jogadores confirmados com contador `+N` (`+25`), economizando espaço vertical no celular. | `screens/home.md`, `screens/evento.md`, `screens/jogo.md`, `prototype/index.html` |
| **Componente `ImageZoom` (`@shadcncraft/image-zoom`)** | Adotado para a história `40` (*"Como jogador, quero abrir a imagem da jogada, para ver o desenho do coach"*): modal `<dialog>` nativo ocupando `100dvw × 100dvh` com fundo `bg-background/85 backdrop-blur-md`, botão de fechar de `44×44px` e respeito a `prefers-reduced-motion`. | `screens/playbook.md`, `prototype/index.html`, `prototype/styles.css` |
| **Bloco `Banner10` (`@shadcncraft/banner-10`)** | Adaptado para o `<PwaInstallBanner>` na **Home** (história `74` / ADR-0002): container semântico `<aside role="banner">` com ícone de destaque, instruções de instalação na tela inicial, CTA de gesto para Web Push e botão de dispensa definitiva. | `screens/home.md`, `prototype/index.html` |
| **Bloco `Contact11` + `SectionHeading`** | Adaptado para o canal `"Falar com o staff"` na tela **Perfil** e no bloqueio pós-prazo de **Evento/Jogo** (história `78`), usando a estrutura `SectionHeading` + `Field` + `FieldLabel` + `Textarea`. | `screens/perfil.md`, `screens/evento.md`, `prototype/index.html` |

### 3.2. Rejeitado (e Motivo Técnico / de Produto)

| Elemento do Kit Figma / shadcn | Decisão | Motivo da Rejeição |
| :--- | :--- | :--- |
| **Alturas compactas de botões/controles (`h-8` / `32px` nos estilos `Nova` e `Mira`, ou `h-9` / `36px` no `Vega` padrão)** | **Rejeitado para elementos interativos** | O app é operado no celular em campo de futebol americano. As regras do projeto exigem **alvo de toque mínimo de `44×44px`** (`min-height: 44px`). Somente emblemas puramente informativos (não clicáveis) usam altura compacta (`22px–24px`). |
| **Bloco `TopNavigation5` (barra superior com menu hambúrguer expansível no mobile)** | **Rejeitado** | O spec (`.scratch/playbook/spec.md`) e o perfil UX determinam **barra de navegação inferior fixa no celular** (com `env(safe-area-inset-bottom)`) e **navegação lateral fixa no desktop (`>= 1024px`)**, com ocultação da aba **Elenco** para o papel `jogador`. |
| **Dependência exclusiva de cor nas variantes `success` / `warning` / `destructive` do `Badge` original** | Rejeitado sem variante/borda | No kit original, `variant="success"` muda apenas `bg-green-100 text-green-700`. No Playbook do Time, toda indicação de status do elenco, unidade, presença ou marcação combina **cor + variante + texto explícito + estilo de borda (sólida, tracejada, dupla, pontilhada)**. |
| **Texto secundário de baixo contraste (`muted-foreground` neutro abaixo de `4.5:1`)** | **Rejeitado** | Ajustamos `--muted-foreground` para `#94A3B8` / `#CBD5E1` sobre superfícies escuras (`5.8:1` a `11.8:1`), garantindo conformidade estrita com **WCAG 2.1 AA** sob luz solar intensa. |
| **Componentes e blocos de Marketing / E-commerce (`marquee`, `star-rating`, `benefits-13`, `newsletter-signup-5`, `testimonials-11`, `footer-4`, `pricing`, `cart`)** | **Rejeitado** | Fora do escopo do MVP. Nenhuma funcionalidade fora do spec foi introduzida. |
| **Estilo `Sera` (serifado editorial) e `Lyra` (100% monoespaçado quadrado)** | **Rejeitado** | Prejudicam a leitura rápida de atribuições longas no celular. Mantivemos a base tipográfica do estilo **Vega** (`Inter` para interface/leitura e `JetBrains Mono` exclusivamente para down & distância, versão `v3`, prazos e contadores tabulares). |

---

## 4. Recomendações de Arquitetura e Dependências para o Frontend (`apps/web`)

Atualmente `apps/web/package.json` possui apenas `react` (`^19.3.1`) e `react-dom` (`^19.3.1`), sem Tailwind, sem Radix UI e sem bibliotecas de componentes externas.

Seguindo a regra **"Não instale bibliotecas apenas por moda: proponha dependências somente se houver ganho claro"**:

1. **Zero necessidade de licença paga ou registro `@shadcncraft` Pro**:
   - O frontend **não deve** depender do registro pago do shadcncraft nem instalar dezenas de pacotes `@radix-ui/*` apenas para reproduzir cartões, badges, abas e formulários que o HTML5 nativo + CSS Custom Properties já resolvem com zero custo de bundle e máxima acessibilidade.
2. **Herdar diretamente `docs/design/prototype/styles.css` + convenção `data-slot`**:
   - A folha de estilos do protótipo já contém o bloco `/* shadcncraft:tokens:start */` com todos os tokens semânticos shadcn (`--background`, `--card`, `--primary`, `--muted`, `--destructive`, `--success`, `--warning`, `--border`, `--input`, `--ring`, `--radius`) pareados com os tokens de domínio do Playbook do Time e utilitários prontos para `[data-slot="card"]`, `[data-slot="badge"]`, `[data-slot="avatar-stack"]`, `[data-slot="section-heading"]` e `[data-slot="field"]`.
   - Usar elementos nativos acessíveis (`<dialog>` nativo para o lightbox de zoom da imagem da jogada e modais de confirmação, `<select>`, `<button aria-pressed>`, `<nav>`, `<aside role="banner">`) reduz o risco de incompatibilidades de peerDependencies com **React 19.3** e simplifica os testes de tela com **React Testing Library + MSW (Seam 2)**.
3. **Dependências opcionais (somente se o engenheiro frontend julgar útil)**:
   - **Recomendação padrão**: **0 dependências novas** de UI (copiar os tokens e classes de `docs/design/prototype/styles.css` e criar os 8 componentes reutilizáveis em `apps/web/src/components/ui/` mantendo os atributos `data-slot` e `data-variant`).
   - **Se desejar ícones vetoriais padronizados**: `lucide-react` (biblioteca padrão do estilo `Vega` no shadcncraft, tree-shakeable, substitui os glifos SVG inline caso necessário).
   - **Não instalar**: `react-medium-image-zoom` (usado pelo `@shadcncraft/image-zoom`, pois um `<dialog>` nativo com imagem ampliável resolve a história 40 sem dependências extras), bibliotecas de carrossel (`embla-carousel-react`), nem gerenciadores de estado ou CSS-in-JS pesados.

---

## 5. O Que Mudou na Revisão Visual do Design System e do Protótipo (Comparação Antes vs. Depois no Navegador)

Validamos visualmente no Google Chrome (`1440×1024` desktop e `390×844` mobile) a transformação entre a versão inicial (que apenas adicionava aliases CSS mantendo o tema azul-marinho original) e a nova implementação completa do **Design System Vega (`shadcncraft v3`)**:

1. **Superfícies, Cores e Alternância `Light` / `Dark` (`Collection 3: Mode`)**:
   - **Antes**: Fundo único azul-marinho escuro (`#0B111E` / `#131C2E` / `#263554`) sem modo claro e sem distinção visual da estética shadcn/Vega.
   - **Depois**: Implementação integral dos dois modos (`[data-theme="light"]` como padrão de abertura idêntico à capa do Figma Starter Kit — `--background: #F8FAFC`, `--card: #FFFFFF`, `--primary: #0F172A`, `--border: #E2E8F0`, `--muted-foreground: #475569` `7.5:1` AA — e `[data-theme="dark"]` em escala neutra `zinc-950` `#09090B` / `#121215` / `#27272A` com `--muted-foreground: #A1A1AA` `7.8:1` AA), com seletor interativo `[☀ Light | ☾ Dark]` na barra superior.
2. **Seletores CSS Guiados por `[data-slot]` e `[data-variant]` (`Collection 2: Style Vega`)**:
   - **Antes**: `data-slot` estava presente apenas em alguns elementos, enquanto os estilos dependiam de classes legadas.
   - **Depois**: `docs/design/prototype/styles.css` estiliza diretamente `[data-slot="app-shell"]`, `[data-slot="sidebar"]`, `[data-slot="bottom-nav"]`, `[data-slot="section-heading"]`, `[data-slot="tagline"]`, `[data-slot="card"]`, `[data-slot="card-header"]`, `[data-slot="card-title"]`, `[data-slot="card-description"]`, `[data-slot="badge"]`, `[data-slot="button"]`, `[data-slot="tabs-list"]`, `[data-slot="tabs-trigger"]`, `[data-slot="field"]`, `[data-slot="input"]`, `[data-slot="select"]`, `[data-slot="textarea"]`, `[data-slot="featured-icon"]`, `[data-slot="avatar-stack"]`, `[data-slot="profile-card"]`, `[data-slot="banner"]` e `dialog[data-slot="image-zoom-dialog"]`.
3. **Ícones Vetoriais Lucide (`data-slot="icon"`)**:
   - **Antes**: Emojis (`🏠`, `📋`, `📖`, `🏟️`, `👥`, `⚙️`) na navegação lateral e na barra inferior.
   - **Depois**: Ícones vetoriais SVG **Lucide** (`stroke-width: 2`, `16×16px`), biblioteca oficial padrão do estilo **Vega** no shadcncraft.
4. **Aba / Catálogo Interativo `Design System (Figma Kit)` no Protótipo**:
   - Adicionada a seção `#screen-design-system` acessível pelo botão `"🎨 Design System (Figma Kit)"` na barra superior e na sidebar, exibindo ao vivo os swatches semânticos (`--background`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--ring`), todas as variantes e estados de `Button` (`default`, `outline`, `success`, `destructive`, `aria-busy="true"` loading, `disabled`), `Badge` de domínio (unidades, novidade e status do elenco nunca dependentes só de cor), `Field` / `Input` (incluindo estado `aria-invalid="true"` com halo destrutivo), `FeaturedIcon`, `AvatarStack` e `Tabs`.
