# Tela 5: Elenco — Exclusiva do Staff (`docs/design/screens/elenco.md`)

## 1. Objetivo

Oferecer ao **staff** o controle completo e atualizado do **elenco** do time: filtrar jogadores por **unidade**, **posição** e **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`), alterar o status do elenco de qualquer jogador com **observação** e **data prevista de retorno** (quando `lesionado`), acompanhar a taxa de comparecimento em treinos, pré-cadastrar jogadores que ainda não criaram conta no app e — exclusivamente para o **head coach** — aprovar ou recusar cadastros de staff **pendentes**, conceder cumulativamente o subpapel de **coordenador de special teams** e remover o papel de staff.

> **Regra de navegação do spec**: A aba **Elenco** não aparece na barra de navegação para o papel **jogador**. Para atender às histórias `13` e `14` (onde o jogador consulta os companheiros do elenco com posições, unidades e status do elenco sem dados sensíveis), o jogador acessa uma gaveta somente leitura `"Ver companheiros do time"` a partir da tela de **Perfil** ou **Jogo**, enquanto a rota e a aba principal **Elenco** permanecem exclusivas do **staff**.

Histórias do spec atendidas: `8`, `9`, `10`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `56`, `71`, `75`, `76`, `77`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`)
1. **Cabeçalho e Resumo Rápido do Elenco**:
   - Contadores numéricos por **status do elenco**: `38 Disponíveis • 3 Lesionados • 2 Indisponíveis • 2 Reformados`.
   - Botão primário `"+ Registrar jogador no elenco"` (pré-cadastro pelo staff antes de o jogador entrar no app — história 77).
2. **Bloco Prioritário — Cadastros de Staff Pendentes e Gestão de Subpapéis (Exclusivo Head Coach)**:
   - Sempre que houver solicitações com estado `pendente` (ADR-0005), exibe cartão destacado no topo:
     - Nome, e-mail verificado, subpapel solicitado (ex.: `Coordenador Defensivo`) e data da solicitação.
     - Botões de `44px` de altura: `✓ Aprovar acesso staff` e `✕ Recusar solicitação` (histórias 9, 76).
   - Seção expansível `"Membros do Staff Ativos"`:
     - Lista cada membro do staff com seu subpapel atual, botão/toggle `"+ Conceder Coordenador de Special Teams (aditivo)"` (história 10) e ação secundária `"Remover papel de staff"` com confirmação (história 75).
3. **Barra de Busca e Filtros Combináveis do Elenco (História 18)**:
   - Busca textual por nome do jogador.
   - Filtro por **Unidade**: `Todas`, `Ofensiva`, `Defesa`, `Special teams`.
   - Filtro por **Posição**: `Todas`, `QB`, `RB`, `WR`, `TE`, `OL`, `DL`, `LB`, `CB`, `S`, `K/P/LS`.
   - Filtro por **Status do elenco**: `Todos`, `Disponível`, `Indisponível`, `Lesionado`, `Reformado`.
4. **Lista de Cartões de Jogador do Elenco**:
   - Cada cartão exibe:
     - Nome do jogador (e selo `"Pré-cadastrado — aguardando entrar no app"` se ainda não concluiu cadastro — história 77).
     - Emblemas de **Unidade(s)** e todas as suas **Posições** (`WR / KR`).
     - Emblema de **Status do elenco** com ícone + cor + texto:
       - `✓ Disponível`
       - `! Indisponível` (exibe a **observação** registrada pelo staff, ex.: `"Suspenso por 1 jogo"` ou `"Viagem a trabalho até dia 20"` — história 16)
       - `+ Lesionado` (exibe a **data prevista de retorno**, ex.: `"Retorno previsto: 05/12/2026"`, e a observação — história 17)
       - `— Reformado`
     - **Taxa de comparecimento** acumulada nos treinos (`92% de presença — 11/12 treinos` — história 56).
     - Botão `"Alterar status do elenco"` (`min-height: 44px`).
5. **Gaveta/Modal de Edição de Status do Elenco**:
   - Seletor de **Status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`).
   - Campo de **Data prevista de retorno** (`type="date"`, exibido quando o status é `lesionado`, opcional conforme glossário/história 17).
   - Campo de **Observação** (`<textarea>`, para explicar indisponibilidade pontual, suspensão ou detalhes do afastamento — história 16).
   - Nota informativa: `"Alterar o status do elenco atualiza o cadastro geral do jogador e é distinto da marcação de disponibilidade de um jogo específico."` (história 19).

### Desktop (`>= 1024px`)
- Barra de filtros superior em linha única + tabela densa de alta legibilidade (`tabular-nums`) com colunas para `Jogador`, `Unidades`, `Posições`, `Status do elenco`, `Observação & Retorno previsto`, `Taxa de comparecimento` e `Ações rápidas`, mantendo o painel de aprovação e gestão de staff do head coach à direita.

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Skeleton para os 4 contadores de status do elenco, barra de filtros e 6 linhas da lista de jogadores (`aria-busy="true"`). |
| **Vazio (`empty`)** | 1) Nenhum jogador corresponde à combinação de filtros (`Unidade + Posição + Status`): `"Nenhum jogador encontrado para os filtros aplicados"` + botão `"Limpar filtros"`.<br>2) Fila de aprovação de staff vazia (para head coach): `"Nenhum cadastro de staff pendente no momento."` |
| **Erro (`error`)** | Falha ao atualizar o status do elenco ou aprovar staff: mantém o modal aberto com alerta `role="alert"` (`"Não foi possível salvar a alteração de status do elenco."`) e botão `"Tentar novamente"`. |
| **Sucesso (`default`)** | Atualização imediata do cartão do jogador e dos contadores superiores (`"Status do elenco de Lucas Mendes atualizado para Lesionado (retorno previsto: 05/12)"`) anunciada em `aria-live="polite"`. |

---

## 4. Variação por Papel e Subpapel

- **Staff — Head Coach**:
  - Acesso completo à gestão do elenco (filtros, edição de status do elenco, observação, data prevista de retorno, pré-cadastro de jogador).
  - Acesso exclusivo à fila de **aprovação ou recusa de cadastros de staff pendentes** (histórias 9, 76), concessão do subpapel aditivo de **coordenador de special teams** (história 10) e **remoção do papel de staff** (história 75).
- **Staff — Coordenadores (`Ofensivo`, `Defensivo`, `Special teams`) e Staff Ativo**:
  - Acesso completo aos filtros do elenco, alteração de status do elenco, registro de observação, data prevista de retorno, taxa de comparecimento e registro de jogador ainda não cadastrado.
  - Visualizam a lista de membros do staff em modo leitura (os botões de aprovar/recusar staff e alterar subpapéis são exclusivos do head coach).
- **Jogador**:
  - **Não vê a aba Elenco na navegação principal.**
  - Quando consulta a lista de companheiros do time pelo atalho somente leitura no Perfil/Jogo (histórias 13, 14), vê apenas `Nome`, `Unidades`, `Posições` e `Status do elenco` (`Disponível`, `Indisponível`, `Lesionado`, `Reformado`), sem controles de edição e sem o painel de administração de staff.

---

## 5. O que NÃO aparece para Jogador

1. **A aba Elenco na barra inferior (mobile) ou na navegação lateral (desktop)** (regra expressa na seção "Telas do MVP" do spec: *"A aba Elenco não aparece para jogador"*).
2. **Controles de alteração de status do elenco, edição de observação e edição de data prevista de retorno** (histórias 15, 16, 17).
3. **Formulário para registrar jogador pré-cadastrado no elenco** (história 77).
4. **Fila de cadastros de staff pendentes, concessão de subpapel de coordenador de special teams e revogação de papel de staff** (histórias 9, 10, 75, 76).
5. **Relatório administrativo de taxa de comparecimento de todos os jogadores** para cobrança de padrão de ausência (história 56).
