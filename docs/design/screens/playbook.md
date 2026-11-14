# Tela 3: Playbook (`docs/design/screens/playbook.md`)

## 1. Objetivo

Ser a fonte única e sempre atualizada das **jogadas** estruturadas do time, substituindo os PDFs enviados por WhatsApp. Permite ao **jogador** listar as jogadas visíveis para ele agrupadas por **unidade** (`Ofensiva`, `Defesa`, `Special teams`), identificar imediatamente o que mudou através do **selo de novidade**, buscar por nome, filtrar por **formação** e **situação** (down e distância), inspecionar as **atribuições** de todas as **posições**, abrir a imagem anexada pelo coach e marcar que estudou a jogada. Permite ao **staff** criar, editar, anexar imagem, controlar a visibilidade por unidade, consultar o histórico de versões e arquivar jogadas respeitando rigorosamente os limites do seu **subpapel**.

Histórias do spec atendidas: `21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`, `30`, `31`, `32`, `33`, `34`, `35`, `36`, `37`, `38`, `39`, `40`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`) — Lista Filtravel + Gaveta/Tela de Detalhe da Jogada
1. **Cabeçalho e Barra de Busca**:
   - Título `Playbook`, contador de jogadas com novidade (`3 novas para estudar`) e botão `+ Nova jogada` (visível apenas para staff com permissão de edição).
   - Campo de busca por nome da jogada (`type="search"`, `font-size: 16px`, ícone de lupa e botão de limpar `44×44px`).
2. **Abas de Unidade e Chips de Filtro**:
   - Abas de **Unidade**: `Todas visíveis`, `Ofensiva`, `Defesa`, `Special teams`.
   - Filtros horizontais combináveis:
     - `Formação` (ex.: `Shotgun Trips Right`, `I-Formation`, `Nickel 4-2-5`, `Punt Safe`)
     - `Situação` (ex.: `1st & 10`, `3rd & Long`, `Red Zone`, `Goal Line`, `4th Down`)
     - Toggle rápido: `★ Apenas novidades` (para jogador) e `Mostrar arquivadas` (exclusivo staff).
3. **Lista de Cartões de Jogada (`<PlayCard>`)**:
   - Cada cartão exibe:
     - Nome da jogada (`Flood Right Z-Post`), versão (`v3`) e **Selo de Novidade** (`★ NOVO — atualizado há 2h`) quando `play_read` do jogador é anterior à versão atual.
     - Emblema de **Unidade** (`OFENSIVA`, `DEFESA` ou `SPECIAL TEAMS`).
     - **Formação** e **Situação** em destaque tático (`Shotgun Trips • 3rd & 6-10`).
     - Indicador se possui imagem do desenho anexada (`🖼 Diagrama anexado`) e, para o staff, indicador de visibilidade (`Visível para: Ofensiva` ou `Liberada também para: Defesa`).
4. **Detalhe da Jogada (ao selecionar uma jogada)**:
   - Cabeçalho com nome, unidade dona, versão atual (`v3`), formação e situação.
   - Botão primário para jogador: `"✓ Marcar como estudada"` (quando possui selo de novidade) ou estado confirmado `"✓ Estudada na versão v3"`.
   - **Bloco de Imagem Opcional**: miniatura de alta nitidez do desenho do coach com botão `"Ampliar imagem"` (abre lightbox com zoom por pinça no celular).
   - **Tabela/Lista de Atribuições por Posição**:
     - Lista **todas as posições** da jogada (`QB`, `RB`, `WR-X`, `WR-Z`, `Slot-Y`, `OL` etc.) com a respectiva **atribuição** detalhada (história 35).
     - As posições que o jogador logado ocupa recebem um marcador visual `"SUA POSIÇÃO"` para leitura rápida sem esconder as demais.
   - **Bloco Exclusivo Staff no Detalhe**:
     - Controle de **Visibilidade por Unidade** (histórias 24, 25, 26, 27; ADR-0006): mostra que a jogada nasce visível apenas para a unidade dona, permite liberar leitura para outra unidade via checkbox (`Liberar para Defesa`) e informa que `Special teams` é sempre visível para todo o time.
     - **Histórico de Versões (`play_revision`)**: lista cronológica (`v3 — Hoje 10:15 por Coordenador Ofensivo`, `v2 — 08/11`, `v1 — 01/11`) permitindo consultar o que foi publicado antes (história 23).
     - Ações de edição (`Editar jogada`, `Anexar/Trocar imagem`, `Arquivar jogada`).

### Desktop (`>= 1024px`) — Layout Mestre-Detalhe (Split View)
- **Coluna Esquerda (5 colunas)**: Busca, filtros por unidade/formação/situação e lista rolável de jogadas.
- **Coluna Direita (7 colunas)**: Detalhe completo da jogada selecionada (imagem ampliada + atribuições por posição + controle de visibilidade e histórico de versões para staff).

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Exibe barra de filtros desabilitada e 4 cartões skeleton de jogada + painel de detalhe com placeholders de atribuição (`aria-busy="true"`). |
| **Vazio (`empty`)** | 1) Quando busca/filtro não encontra resultados: `"Nenhuma jogada encontrada para os filtros selecionados"` + botão `"Limpar filtros"`.<br>2) Quando a unidade ainda não tem jogadas publicadas: `"Nenhuma jogada ativa publicada nesta unidade."` (com botão `"+ Criar primeira jogada"` se o staff tiver permissão de edição na unidade). |
| **Erro (`error`)** | Falha ao carregar jogadas ou ao salvar edição/marcar estudo: alerta `role="alert"` com descrição clara (`"Não foi possível marcar a jogada como estudada. Verifique sua conexão."`) e botão `"Tentar novamente"`. No formulário de criação de jogada, valida campos obrigatórios (nome, unidade, formação, situação e pelo menos uma atribuição por posição). |
| **Sucesso (`default`)** | Ao tocar em `"Marcar como estudada"`: o selo `★ NOVO` desaparece imediatamente da jogada e o contador de novidades na Home/Playbook é decrementado com anúncio em `aria-live="polite"`. |
| **Modo Somente Leitura para Coordenador de Outra Unidade (`disabled`)** | Quando um coordenador ofensivo visualiza uma jogada da defesa que foi liberada para estudo (ou uma jogada de special teams sem que ele acumule o subpapel de coordenador de special teams), os botões `Editar jogada`, `Alterar visibilidade` e `Arquivar` ficam ocultos/desabilitados com o selo `"Somente leitura — Unidade de outro coordenador"` (histórias 31, 32). |

---

## 4. Variação por Papel e Subpapel (Matriz de Autorização na UI)

| Papel / Subpapel | Jogadas que Vê | Jogadas que Edita / Cria / Arquiva |
| :--- | :--- | :--- |
| **Jogador** | Jogadas ativas da(s) sua(s) unidade(s) + jogadas liberadas para sua unidade + todas as jogadas ativas de **Special teams**. | **Nenhuma** (somente leitura e marcação de estudo `play_read`). |
| **Staff — Head Coach** | Todas as jogadas de todas as unidades (ativas e arquivadas). | **Todas as unidades** (`Ofensiva`, `Defesa`, `Special teams`). |
| **Staff — Coordenador Ofensivo** | Todas da `Ofensiva` + `Special teams` + jogadas da `Defesa` liberadas para `Ofensiva`. | Apenas **`Ofensiva`** (e `Special teams` somente se acumular o subpapel de **coordenador de special teams**). |
| **Staff — Coordenador Defensivo** | Todas da `Defesa` + `Special teams` + jogadas da `Ofensiva` liberadas para `Defesa`. | Apenas **`Defesa`** (e `Special teams` somente se acumular o subpapel de **coordenador de special teams**). |
| **Staff — Coordenador de Special Teams** *(subpapel aditivo)* | As do seu subpapel principal + todas de `Special teams`. | Sua unidade principal (se houver) + **`Special teams`**. |
| **Staff sem subpapel de unidade** | Jogadas liberadas conforme permissão de leitura do staff. | **Nenhuma** (somente leitura do playbook). |

---

## 5. O que NÃO aparece para Jogador

1. **Jogadas de unidades às quais o jogador não pertence** e que não foram explicitamente liberadas pelo staff (ex.: jogador exclusivamente da Ofensiva não vê o playbook da Defesa, a menos que uma jogada específica tenha sido compartilhada — ADR-0006).
2. **Jogadas arquivadas** (`status = 'arquivada'`) e filtro `"Mostrar arquivadas"` (história 28).
3. **Botões de criação, edição, upload de imagem, arquivamento e configuração de visibilidade por unidade** (histórias 21–28).
4. **Painel de administração de revisões para restauração/edição** (o jogador vê sempre a versão ativa publicada com o selo de novidade quando aplicável).
