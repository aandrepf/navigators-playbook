# Tela 1: Home (`docs/design/screens/home.md`)

## 1. Objetivo

Ser o painel imediato de ação do membro do time ao abrir o app no celular ou no desktop: mostrar o que exige resposta urgente (**presença** no próximo treino ou **marcação** de disponibilidade no próximo jogo), destacar as **jogadas** visíveis que receberam atualização desde o último estudo (selo de novidade) e apresentar, uma única vez, o convite de instalação do PWA na tela inicial para habilitar notificações Web Push. Para o **staff** (especialmente o **head coach**), resume pendências operacionais como cadastros de staff **pendentes** e eventos com prazo próximo do encerramento.

Histórias do spec atendidas: `8`, `9`, `36`, `45`, `46`, `47`, `58`, `66`, `67`, `68`, `69`, `74`, `76`.

---

## 2. Hierarquia Visual e Layout

### Mobile (`320px–767px`) — Coluna única empilhada por urgência
1. **Cabeçalho compacto fixo**: Nome do time, saudação curta com papel/unidades do usuário (ex.: `WR / KR • Ofensiva & Special teams`) e indicador de status do elenco do próprio jogador (`Disponível`).
2. **Banner de Instalação PWA e Web Push (condicional, exibido 1 vez)**: Cartão de destaque dispensável explicando como instalar na tela inicial (iOS/Android) e botão de gesto para ativar notificações push.
3. **Bloco 1 — Pendências de Resposta (Prioridade Máxima)**:
   - Cartão do próximo **evento** (treino ou jogo) ainda sem resposta ou cujo prazo está aberto, com cronômetro/data limite (`Prazo: Sex, 15/11 às 20:00`) e botões de ação rápida de `44px` de altura mínima: `Vou` (confirma em 1 toque) e `Não vou` (abre gaveta de **justificativa** obrigatória).
4. **Bloco 2 — Novidades do Playbook**:
   - Lista das **jogadas** visíveis para o usuário cuja versão atual é posterior ao último registro de estudo (`play_read`), exibindo o selo `NOVO`, emblema de **unidade**, **formação**, **situação** e versão (`v3`).
5. **Bloco 3 — Próximos Eventos na Agenda**:
   - Lista cronológica dos próximos treinos e jogos com o estado atual da resposta do jogador (`Confirmado: Vou`, `Ausente: Não vou`, `Sem resposta` ou `Evento cancelado`).

### Desktop (`>= 1024px`) — Grade de 12 colunas com navegação lateral esquerda
- **Coluna Principal (7 colunas)**: Pendências de resposta + Agenda de próximos eventos (com barra de progresso de respostas consolidadas se o usuário for staff).
- **Coluna Secundária (5 colunas)**: Novidades do playbook + Card de aprovações de staff pendentes (para head coach) + Banner de Web Push.

---

## 3. Estados da Tela e dos Componentes

| Estado | Comportamento visual e acessível |
| :--- | :--- |
| **Carregando (`loading`)** | Exibe 3 cartões skeleton pulsantes (`aria-busy="true"`, `aria-label="Carregando painel inicial"`) mantendo a estrutura dos blocos de Próximo Evento e Novidades do Playbook para evitar Cumulative Layout Shift (CLS). |
| **Vazio (`empty`)** | Quando não há eventos futuros nem novidades no playbook: exibe ilustração tática discreta, título `"Tudo em dia com o time"`, subtítulo `"Você respondeu a todos os eventos e estudou todas as jogadas atualizadas da sua unidade."` e botão secundário `"Revisar Playbook"`. |
| **Erro (`error`)** | Em falha de rede ao carregar o resumo: exibe banner com `role="alert"`, ícone `⚠`, texto `"Não foi possível atualizar os próximos eventos e novidades do playbook."` e botão `"Tentar novamente"` (`min-height: 44px`). |
| **Sucesso (`default`)** | Ao confirmar `"Vou"` diretamente na Home: o botão entra em estado `loading` (`"Confirmando..."`), muda para o emblema `"✓ Presença confirmada"` (ou `"✓ Marcação: Disponível"`) e anuncia a mudança via `aria-live="polite"`. |
| **Componentes em Foco / Desabilitado** | Botões `Vou` / `Não vou` exibem anel `--color-focus-ring` (`#FACC15`) no foco por teclado. Quando o prazo do evento venceu, os botões ficam `disabled` com rótulo `"Prazo encerrado em 14/11 às 19:00 — fale com o staff se precisar alterar"`. |

---

## 4. Variação por Papel e Subpapel

- **Jogador**:
  - Vê seus próximos eventos com botões rápidos de resposta (**presença** para treino, **marcação** para jogo).
  - Vê apenas **jogadas** com selo de novidade que pertençam às suas unidades ou que tenham sido liberadas para sua unidade, além de todas as jogadas de **special teams** (ADR-0006).
  - Vê atalho para o **game plan** publicado do próximo jogo.
- **Staff (Coordenador Ofensivo / Defensivo / Special Teams / Staff sem subpapel)**:
  - Nos cartões de próximos eventos, vê o resumo consolidado em tempo real: `32 Confirmados • 4 Ausentes • 9 Sem resposta` e botão `"Ver consolidado"`.
  - Possui atalho rápido `"+ Novo evento"` e `"+ Nova jogada"` (habilitado caso tenha subpapel de edição).
- **Staff — Head Coach**:
  - Além da visão de staff acima, vê no topo um cartão de ação prioritária quando existem cadastros de staff aguardando decisão: `"2 cadastros de staff pendentes de aprovação"` com botões diretos `Revisar no Elenco`, `Aprovar` ou `Recusar` (histórias 9, 76).
- **Staff — Pendente (aguardando aprovação do Head Coach)**:
  - Vê uma tela de estado **Pendente** bloqueante e explicativa (ADR-0005, história 8): `"Seu cadastro como Staff (Coordenador Defensivo) está pendente de aprovação por um Head Coach. Você receberá uma notificação assim que o acesso for liberado."`, com opção de `"Falar com o staff"` ou `"Sair da conta"`, sem expor playbooks restritos, status de lesão nem justificativas antes da aprovação.

---

## 5. O que NÃO aparece para Jogador

1. **Aba Elenco** na barra de navegação inferior (mobile) ou lateral (desktop).
2. **Card de fila de aprovação de staff pendente** (exclusivo do head coach).
3. **Contadores detalhados de ausentes com justificativa** e lista nominal de quem ainda não respondeu com botão de cobrança.
4. **Botões de criação de evento (`+ Novo evento`) ou criação de jogada (`+ Nova jogada`)**.
5. **Jogadas de unidades às quais o jogador não pertence** e que não foram explicitamente liberadas para a unidade dele (exceto special teams, que é sempre visível para todo o time).
