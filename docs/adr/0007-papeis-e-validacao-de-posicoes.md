# Papéis administrativos e validação de posições

## Status

Aceito

## Contexto

O cadastro aberto precisa permitir que jogadores entrem sem depender de
criação manual de conta, mas posições incorretas podem liberar conteúdo de
unidade indevido. Staff também não deve receber subpapel de edição apenas por
declarar essa intenção no cadastro.

O sistema já possui `jogador`, `staff`, subpapéis de staff e a tabela
`player_position`, mas não distinguia permissão administrativa, posição
pendente e posição aprovada.

## Decisão

- `admin` é uma permissão geral da aplicação, configurada inicialmente pelo
  seed/ambiente. Não existe auto cadastro de admin.
- Admin pode coexistir com o vínculo esportivo de staff.
- Head coach e admin podem administrar posições de qualquer unidade.
- Staff ativo pode revisar solicitações de posição e atribuir posições de
  special teams; o escopo de edição de jogadas continua governado pelos
  subpapéis.
- Cadastro de staff não escolhe subpapel e entra pendente.
- Cadastro de jogador entra ativo mesmo sem posição.
- Posições informadas pelo jogador começam pendentes e só posições aprovadas
  derivam unidades liberadas para conteúdo específico.
- Alterações feitas por staff, head coach ou admin são aplicadas e notificam o
  jogador; solicitações feitas pelo jogador aguardam revisão.
- Cadastro por e-mail e Google reutiliza o mesmo onboarding de posições.
- Telefone é opcional e, por enquanto, serve apenas como dado de perfil para
  futura integração WhatsApp.

## Consequências

- O contrato público precisa devolver `admin`, posições e unidades, além do
  estado de validação das posições.
- A autorização não pode depender apenas de `role`; deve considerar admin,
  aprovação, subpapel e unidade.
- O seed precisa permitir testar o admin geral.
- A fila e o histórico de revisão de posições ficam para as fatias de Perfil
  e administração de staff.
- O cadastro continua simples para o jogador, mas a aplicação precisa tratar
  o estado de posição pendente separadamente do estado de aprovação da conta.
