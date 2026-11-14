# Tela 2: Evento — Treino (`docs/design/screens/evento.md`)

## 1. Objetivo

Substituir definitivamente a enquete de WhatsApp para treinos: centralizar data, horário (no fuso `America/Sao_Paulo`), local e **prazo de resposta**; permitir que o **jogador** registre sua **presença** (`Vou` ou `Não vou` com **justificativa** obrigatória em lista rápida + complemento em texto livre) antes do prazo; permitir ao **staff** visualizar em uma única tela os confirmados, os ausentes com justificativa e os jogadores sem resposta, além de registrar a **presença real** pós-treino para medir a taxa de comparecimento ao longo do tempo.

Histórias do spec atendidas: `41`, `43`, `44`, `46`, `47`, `48`, `49`, `50`, `51`, `52`, `53`, `54`, `55`, `56`, `57`, `78`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`)
1. **Cabeçalho do Evento**:
   - Emblema do tipo (`TREINO`), estado (`ATIVO` ou `CANCELADO` / `REMARCADO`), título do treino (ex.: `Treino Tático — Instalação Red Zone`), data/hora (`Sáb, 16/11 • 14:00–17:00`), local (`Campo Suplementar Sul`) e destaque para o **prazo de resposta** (`Responder até Sex, 15/11 às 14:00 — 24h antes`).
2. **Cartão de Resposta de Presença do Jogador**:
   - Dois botões grandes lado a lado (`min-height: 48px`):
     - `✓ Vou ao treino`
     - `✕ Não vou (exige justificativa)`
   - Quando `Não vou` é selecionado, expande imediatamente o formulário de **justificativa**:
     - Chips/Select de escolha rápida (`Trabalho / Escala`, `Saúde / Lesão`, `Faculdade / Prova`, `Transporte`, `Compromisso familiar`, `Outro`).
     - Campo `<textarea>` para complemento em texto livre (`"Detalhe o motivo para o staff (visível apenas para o staff)"`).
     - Aviso de privacidade com ícone de cadeado: `"Sua justificativa é visível apenas para o staff."`
   - Após o treino ocorrer: exibe o selo oficial de **Presença real registrada pelo staff**: `"Registro pós-treino: Contado como PRESENTE"` (ou `"Contado como AUSENTE"` — história 57).
3. **Painel de Participantes**:
   - **Na visão de Staff**: Três abas/segmentos com contadores tabulares:
     1. `Confirmados (28)`
     2. `Ausentes com justificativa (5)` — exibe o motivo escolhido + texto livre de cada jogador e a taxa de comparecimento acumulada (`88% presença`).
     3. `Sem resposta (7)` — permite identificar rapidamente quem ainda não respondeu antes do prazo.
   - **Modo de Chamada Pós-Treino (Staff)**: chave/aba `"Registrar presença real"` onde cada linha de jogador recebe controles rápidos `Presente` / `Ausente`, mostrando lado a lado o que o jogador havia respondido antes do treino vs. comparecimento real (história 55).
   - **Na visão de Jogador**: Lista simplificada dos colegas agrupada por `Confirmados` e `Ausentes`, onde os ausentes exibem apenas o rótulo neutro `"Ausente"`, **sem jamais exibir a justificativa**.

### Desktop (`>= 1024px`)
- **Coluna Esquerda (4 colunas)**: Dados do treino, controles de edição de evento para o staff (`Editar data/local`, `Ajustar prazo de resposta`, `Cancelar evento`) ou cartão de resposta do jogador + canal `"Falar com o staff"` caso o prazo tenha encerrado.
- **Coluna Direita (8 colunas)**: Painel consolidado em 3 colunas simultâneas (`Confirmados`, `Ausentes com justificativa`, `Sem resposta`) e tabela de chamada para registro da **presença real**.

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Skeleton para o cabeçalho do treino, botões de resposta desabilitados com shimmer e 6 linhas skeleton na lista de participantes (`aria-busy="true"`). |
| **Vazio (`empty`)** | Se nenhum treino estiver selecionado ou agendado: exibe `"Nenhum treino agendado para esta semana"`. Para o staff, exibe o botão primário `"+ Criar evento de treino"`. |
| **Erro (`error`)** | 1) Erro de validação ao tentar enviar `Não vou` sem selecionar/preencher justificativa: borda `#FB7185` no campo, foco movido para o seletor e alerta `"Informe a justificativa para registrar que não vai ao treino."` (`role="alert"`).<br>2) Erro de rede ao salvar: mantém o texto digitado pelo jogador e exibe botão `"Reenviar resposta"`. |
| **Sucesso (`default`)** | Confirmação visual imediata no cartão (`"Resposta salva: Vou ao treino — você pode alterar até 15/11 às 14:00"`). Para o staff, ao salvar a chamada pós-treino, exibe banner `"Presença real registrada para 40 jogadores"`. |
| **Prazo Encerrado (`disabled`)** | Quando `now > deadline`: botões `Vou` e `Não vou` ficam `disabled` (`aria-disabled="true"`). Exibe aviso: `"O prazo de resposta encerrou em 15/11 às 14:00. Apenas o staff pode alterar sua presença agora."` acompanhado do botão `"Entrar em contato com o staff"` (história 78). |
| **Evento Cancelado** | Cabeçalho com emblema `CANCELADO`, botões de resposta ocultos/desabilitados e aviso claro da data de cancelamento ou remarcação (história 44). |

---

## 4. Variação por Papel e Subpapel

- **Jogador**:
  - Responde `Vou` ou `Não vou` (com justificativa) enquanto o prazo estiver aberto e pode alterar sua resposta livremente até o vencimento do prazo (história 50).
  - Vê como foi contado na **presença real** (`Presente` ou `Ausente`) após o registro do staff (história 57).
  - Quando não consegue responder (ex.: prazo vencido), aciona `"Entrar em contato com o staff"` diretamente na tela (história 78).
- **Staff (qualquer subpapel ativo)**:
  - Cria evento de treino com data, local e prazo de resposta (padrão 24h antes, ajustável — histórias 41, 43).
  - Remarca ou cancela o evento sem precisar criar outro (história 44).
  - Visualiza o consolidado completo (`Confirmados`, `Ausentes com justificativa`, `Sem resposta`), lê a justificativa completa de cada ausência e vê a **taxa de comparecimento** histórica de cada jogador (histórias 52, 53, 56).
  - Registra ou altera a resposta após o prazo e lança a **presença real** depois do treino (história 55).

---

## 5. O que NÃO aparece para Jogador

1. **Justificativas de ausência de outros jogadores**: a API não envia o campo de justificativa para o papel `jogador`, e a UI exibe apenas o selo `"Ausente"` (história 54).
2. **Aba/lista de cobrança de jogadores "Sem resposta"** com indicadores administrativos e **taxa de comparecimento (%)** individual dos demais colegas (história 56).
3. **Modo de chamada para marcar a presença real pós-treino** (história 55).
4. **Botões de criar treino, editar local/horário, ajustar prazo de resposta ou cancelar evento** (histórias 41, 43, 44).
