# Playbook do Time

Contexto do app de gestão de um time de futebol americano: distribui o playbook, organiza treinos e jogos e mantém o estado do elenco. Existe para substituir o PDF enviado por WhatsApp e as enquetes de presença, que não refletem a realidade do time.

## Language

### Conteúdo

**Jogada**:
Unidade de conteúdo do playbook, com nome, unidade, formação, situação e atribuição por posição.
_Avoid_: play, diagrama, marcação

**Playbook**:
Coleção de jogadas de um time, organizada por unidade.
_Avoid_: livro, PDF, caderno

**Unidade**:
Agrupamento de jogadores por fase do jogo: ofensiva, defesa ou special teams.
_Avoid_: grupo, time, setor

**Posição**:
Papel técnico do jogador dentro de uma unidade (QB, WR, LB…). Um jogador pode ocupar mais de uma.
_Avoid_: função, lugar

**Atribuição**:
O que uma posição deve fazer em uma jogada específica.
_Avoid_: tarefa, responsabilidade, rota

**Formação**:
Arranjo inicial dos jogadores em uma jogada.
_Avoid_: alinhamento, desenho

**Situação**:
Contexto de chamada da jogada, expresso em down e distância.
_Avoid_: cenário, momento

**Game plan**:
Lista ordenada das jogadas escolhidas para um jogo, com notas sobre aquele confronto.
_Avoid_: plano de jogo, call sheet

### Time e pessoas

**Time**:
O clube ao qual todos os usuários pertencem. O app atende um time por vez.
_Avoid_: equipe, organização, clube

**Elenco**:
Conjunto de jogadores do time.
_Avoid_: roster, plantel, grupo

**Jogador**:
Membro do elenco que consulta conteúdo e responde a eventos.
_Avoid_: atleta, usuário

**Admin**:
Pessoa com permissão administrativa geral para operar a aplicação e
administrar os times. Pode também possuir vínculo de staff.
_Avoid_: superadmin, administrador do time

**Staff**:
Membro do time com acesso de edição e visão de dados restritos.
_Avoid_: comissão técnica, treinador

**Papel**:
Categoria esportiva de acesso: jogador ou staff. A permissão de admin é
separada e pode coexistir com o vínculo de staff.
_Avoid_: perfil, tipo de usuário

**Subpapel**:
Função do staff: head coach, coordenador ofensivo, coordenador defensivo, coordenador de special teams.
_Avoid_: cargo, função

**Coordenador de special teams**:
Subpapel aditivo que qualquer membro do staff pode acumular com o seu, e que só ele edita jogadas de special teams.
_Avoid_: ST coach

**Pendente**:
Estado de um cadastro de staff que ainda aguarda definição de um admin ou
head coach.
_Avoid_: em análise, não verificado

**Posição pendente**:
Posição informada ou solicitada por um jogador que ainda aguarda revisão de
staff, head coach ou admin.
_Avoid_: posição não verificada, posição provisória

**Posição aprovada**:
Posição validada pelo staff, head coach ou admin e usada para derivar a
unidade visível ao jogador.
_Avoid_: posição confirmada pelo sistema

**Telefone**:
Número opcional informado no perfil para futura comunicação por WhatsApp.
Neste MVP não implica validação nem envio de mensagem.
_Avoid_: celular obrigatório, contato de emergência

### Estado do jogador

**Status do elenco**:
Condição cadastral do jogador: `disponivel`, `indisponivel`, `lesionado` ou `reformado`.
_Avoid_: estado, situação, condição

**Lesionado**:
Status do jogador afastado por lesão, com data prevista de retorno opcional.
_Avoid_: machucado, fora

**Reformado**:
Status do jogador que encerrou a prática do esporte mas permanece no elenco.
_Avoid_: aposentado, inativo

### Presença e disponibilidade

**Evento**:
Treino ou jogo com data, prazo de resposta e lista de participantes.
_Avoid_: atividade, compromisso, encontro

**Presença**:
Resposta e comparecimento do jogador a um treino.
_Avoid_: check-in, RSVP, confirmação

**Marcação**:
Resposta de disponibilidade do jogador para um jogo.
_Avoid_: presença de jogo, convocação, RSVP

**Disponibilidade**:
Condição do jogador para um jogo específico, derivada da sua marcação. Não se confunde com o status do elenco.
_Avoid_: status, situação

**Justificativa**:
Motivo declarado pelo jogador ao recusar um evento. Visível apenas para o staff.
_Avoid_: motivo, desculpa, observação
