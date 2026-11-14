# Tela 4: Jogo — Disponibilidade e Game Plan (`docs/design/screens/jogo.md`)

## 1. Objetivo

Concentrar em uma única tela a preparação tática e de elenco para um confronto oficial: permitir que o **jogador** registre sua **marcação** de **disponibilidade** para o jogo (exigindo **justificativa** na recusa, sem alterar seu **status do elenco** cadastral) e estude o **game plan** do próximo jogo (lista ordenada de **jogadas** referenciadas do **playbook** com notas específicas daquele adversário). Para o **staff**, permite cruzar a disponibilidade do jogo com o **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`) para evitar escalar quem não está apto, e montar/ordenar o **game plan** por referência (ADR-0004).

Histórias do spec atendidas: `19`, `42`, `43`, `44`, `58`, `59`, `60`, `61`, `62`, `63`, `64`, `65`, `66`, `78`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`) — Cabeçalho do Confronto + Abas Internas (`Disponibilidade` | `Game Plan`)
1. **Cabeçalho do Confronto**:
   - Emblema `JOGO OFICIAL`, adversário (`vs. Tritões FA`), data e kickoff no fuso `America/Sao_Paulo` (`Dom, 24/11 • Kickoff 10:00`), local (`Estádio Municipal`) e **prazo de marcação** (`Responder até Sex, 22/11 às 10:00 — 48h antes`).
   - Indicador claro do próprio jogador: **Status do elenco** (`Disponível`) separado da **Disponibilidade para este jogo** (`Marcação confirmada: Disponível`).
2. **Aba 1 — Minha Marcação & Disponibilidade**:
   - **Cartão de Marcação do Jogador**:
     - Botões de `48px` de altura: `✓ Estou disponível (Vou ao jogo)` e `✕ Indisponível para este jogo (Não vou)`.
     - Se selecionar `Não vou`, exige **justificativa** (escolha em lista rápida + complemento em texto livre), exatamente com o mesmo padrão de transparência e sigilo dos treinos (histórias 58, 59).
     - Nota explícita: `"Sua marcação vale apenas para este confronto e não altera seu status do elenco."` (história 19).
   - **Visão Consolidada (Exclusivo Staff)**:
     - Painel cruzando **Disponibilidade do Jogo** × **Status do Elenco** (histórias 60, 61):
       - `Aptos e Confirmados`: marcação `Vou` + status do elenco `disponivel`.
       - `Alerta de Conflito de Escalação`: destaca com ícone `⚠` caso um jogador tenha status do elenco `lesionado`, `indisponivel` ou `reformado` (com data prevista de retorno e observação visíveis) para que o staff não o escale por engano.
       - `Indisponíveis no Jogo (com justificativa)`: exibe a justificativa enviada pelo jogador.
       - `Sem marcação`: lista quem ainda não respondeu antes do prazo de 48h.
3. **Aba 2 — Game Plan do Confronto**:
   - Lista numerada na **sequência ordenada de chamadas** (`#01`, `#02`, `#03`...) referenciando diretamente as **jogadas** do playbook (ADR-0004).
   - Cada item do **game plan** exibe:
     - Ordem da chamada (`#01`), nome da jogada (`Flood Right Z-Post`), **unidade** (`Ofensiva`), **formação**, **situação** e versão atual sincronizada do playbook (`v3 — sincronizada automaticamente`).
     - **Nota do confronto** em destaque (ex.: `"Ajuste vs. Tritões: CB #21 joga em press sem ajuda de safety em 3rd & médio; priorizar leitura no Z-Post."` — história 64).
     - Botão `"Ver atribuições e imagem da jogada"` que abre os dados vivos da jogada no playbook (qualquer edição na jogada reflete imediatamente aqui — história 65).
   - **Controles de Montagem do Game Plan (Exclusivo Staff)**:
     - Botão `"+ Adicionar jogada do playbook ao game plan"` (abre seletor buscando jogadas ativas por unidade, formação e situação).
     - Controles de ordenação acessíveis por toque e teclado (`↑ Subir posição` / `↓ Descer posição`, `44×44px`) em cada item (história 63).
     - Campo editável para a **nota da jogada no confronto** e botão `"Remover do game plan"` (remove apenas a referência, mantendo a jogada intacta no playbook).

### Desktop (`>= 1024px`) — Visão Simultânea de Escalação e Game Plan
- **Coluna Esquerda (5 colunas)**: Cabeçalho do confronto, cartão de marcação e painel consolidado cruzando **disponibilidade** com **status do elenco**.
- **Coluna Direita (7 colunas)**: Construtor/leitor completo do **game plan** ordenado, com catálogo lateral para adicionar jogadas do playbook e editar notas por confronto sem trocar de tela.

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Skeleton para o cabeçalho do confronto, contadores de disponibilidade e 4 itens numerados do game plan (`aria-busy="true"`). |
| **Vazio (`empty`)** | Quando o staff ainda não adicionou jogadas ao game plan do confronto: para o jogador, exibe `"O staff ainda está montando o game plan deste confronto. Você será avisado quando as jogadas forem definidas."`; para o staff, exibe `"+ Escolher primeira jogada do playbook"`. |
| **Erro (`error`)** | 1) Tentativa de recusar o jogo sem justificativa: campo em estado `aria-invalid="true"` com alerta `"A justificativa é obrigatória ao marcar indisponibilidade para o jogo."`.<br>2) Falha ao reordenar ou salvar nota no game plan: reversão otimista com banner `role="alert"` e botão `"Tentar salvar novamente"`. |
| **Sucesso (`default`)** | Feedback imediato ao registrar marcação, ao reordenar chamadas do game plan (`"Ordem atualizada: #02 Mesh Switch subiu para #01"`) e ao salvar nota do confronto. |
| **Prazo Encerrado (`disabled`)** | Após o prazo de resposta do jogo (padrão 48h antes), os botões de marcação ficam `disabled` para o jogador com link direto para `"Falar com o staff"`. |

---

## 4. Variação por Papel e Subpapel

- **Jogador**:
  - Registra e altera sua **marcação** de disponibilidade até o prazo (com justificativa obrigatória na recusa).
  - Consulta o **game plan** ordenado do próximo jogo com as notas do confronto para as jogadas dentro da sua visibilidade de unidade (incluindo special teams) (história 66).
- **Staff (Coordenadores e Head Coach)**:
  - Cria/edita o evento do tipo jogo (data, adversário, local, prazo de resposta — história 42).
  - Visualiza a **disponibilidade consolidada** cruzada com o **status do elenco** (`disponivel`, `indisponivel`, `lesionado`, `reformado`) e lê todas as justificativas de ausência (histórias 60, 61).
  - Monta o **game plan** referenciando jogadas do playbook, define a ordem das chamadas e escreve as notas por jogada (histórias 62, 63, 64, 65).

---

## 5. O que NÃO aparece para Jogador

1. **Justificativas de indisponibilidade de outros jogadores** para o jogo (vê apenas se o colega está disponível ou ausente).
2. **Painel administrativo de cruzamento de escalação** com observações restritas de status do elenco e cobrança de jogadores sem marcação.
3. **Controles de edição do game plan**: botões de adicionar jogada do playbook, reordenar sequência (`↑` / `↓`), editar nota do confronto ou remover item do game plan.
4. **Jogadas de unidades restritas** às quais o jogador não tem visibilidade.
