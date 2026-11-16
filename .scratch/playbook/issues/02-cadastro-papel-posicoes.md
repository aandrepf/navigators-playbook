# 02: Cadastro, papel e posições

**Blocked by:** 01 (Esqueleto andante)

**Status:** ready-for-agent

## Problem Statement

Quem entra no time precisa informar o código do time, escolher se participa
como jogador ou staff e completar o perfil sem receber permissões indevidas.
O cadastro atual coleta posições, mas não as persiste; também permite que staff
declare subpapel antes de qualquer validação administrativa.

## Solution

O cadastro por e-mail e Google usará o mesmo onboarding:

- código do time, identidade e telefone opcional;
- escolha do papel `jogador` ou `staff`;
- jogador escolhe uma ou mais posições de ofensiva e/ou defesa, ou pode
  pular essa etapa;
- staff não escolhe subpapel no cadastro e nasce `pendente`;
- posições de jogador são gravadas como solicitações pendentes de validação;
- special teams pode ser atribuída posteriormente por staff;
- admin geral e head coach podem administrar qualquer posição;
- staff ativo pode revisar solicitações de posição e atribuir posições no
  escopo permitido pelo seu subpapel.

Jogador entra como `ativo`, mesmo sem posição aprovada. Sem posição aprovada,
vê Home e Perfil, mas não vê conteúdo específico do Playbook. Staff pendente
vê apenas seu próprio estado e não edita nem consulta módulos protegidos.

## User Stories

1. Como membro do time, quero informar um código de time válido, para entrar no
   time correto.
2. Como membro do time, quero receber uma mensagem clara quando o código do
   time for inválido, para corrigir o cadastro.
3. Como membro do time, quero cadastrar nome, e-mail verificado e telefone
   opcional, para manter meu perfil pronto para futuras notificações WhatsApp.
4. Como membro do time, quero entrar por código de e-mail ou Google, para usar
   o mesmo onboarding independentemente do método de autenticação.
5. Como membro do time, quero escolher entre jogador e staff, para iniciar com
   o papel correto.
6. Como jogador, quero escolher uma ou mais posições de ofensiva e defesa, para
   informar onde atuo.
7. Como jogador, quero poder pular a escolha inicial de posições, para concluir
   o cadastro e informar os dados depois.
8. Como jogador, quero que as unidades sejam derivadas das posições, para não
   cadastrar a mesma informação duas vezes.
9. Como jogador, quero entrar ativo após o cadastro, mesmo sem posição aprovada,
   para completar o perfil sem depender do staff no primeiro acesso.
10. Como jogador, quero saber quando minhas posições estão pendentes, para
    entender por que o conteúdo de unidade ainda não está disponível.
11. Como jogador, quero solicitar alteração das minhas posições, para corrigir
    um cadastro errado.
12. Como jogador, quero ser avisado quando um staff ou admin alterar minhas
    posições, para manter meu perfil atualizado.
13. Como staff, quero me cadastrar sem escolher subpapel, para que nenhuma
    permissão de edição seja autoatribuída.
14. Como staff recém-cadastrado, quero ver meu estado pendente, para saber que
    aguardo uma definição administrativa.
15. Como admin geral, quero administrar todos os times e usuários, para operar
    a aplicação.
16. Como head coach, quero administrar as posições e permissões esportivas do
    meu time, para manter o elenco correto.
17. Como staff ativo, quero revisar solicitações de posição, para validar o
    cadastro dos jogadores.
18. Como staff ativo, quero atribuir posições de special teams, para registrar
    jogadores que também atuam nessa unidade.
19. Como admin ou head coach, quero atribuir ou alterar posições de qualquer
    unidade, para corrigir o cadastro do elenco.
20. Como jogador, quero que uma posição atribuída por staff seja aplicada
    imediatamente, para refletir a decisão do time.
21. Como usuário, quero que minha sessão devolva papel, subpapéis, posições,
    unidades e estado de aprovação, para a interface refletir minhas
    permissões.
22. Como jogador, quero que minhas posições de special teams coexistam com
    ofensiva e defesa, para representar corretamente minha atuação.

## Implementation Decisions

- Os papéis esportivos são `staff` e `jogador`; `admin` é uma permissão
  administrativa separada.
- `admin` é uma permissão geral da aplicação, configurada inicialmente pelo
  seed/ambiente e não disponível para auto cadastro. Pode coexistir com o
  vínculo esportivo de staff.
- `head_coach` continua sendo subpapel de staff e também administra posições
  no time.
- Cadastro de staff não recebe `staffRole`; subpapéis são atribuídos depois
  por admin ou head coach.
- Cadastro de jogador aceita `positions` opcional. Quando informado, cada
  posição nasce com estado `pendente`; quando omitido, o jogador fica sem
  posição.
- O catálogo autoritativo de posições é mantido no domínio do backend e
  espelhado pelo frontend:
  - ofensiva: `QB`, `RB`, `FB`, `WR`, `TE`, `OL`;
  - defesa: `DL`, `LB`, `CB`, `S`;
  - special teams: `K`, `P`, `LS`, `KR/PR`, `Gunner`.
- Unidades são derivadas das posições aprovadas. Special teams pode coexistir
  com ofensiva e defesa.
- O cadastro manual e o onboarding após Google usam os mesmos campos e regras.
- Telefone é opcional e armazenado sem validação ou envio WhatsApp neste card.
- Jogador entra `ativo`; staff entra `pendente`.
- Staff pendente não possui subpapel nem permissões de edição.
- Staff ativo pode revisar solicitações de posição. Atribuição direta de
  special teams pode ser feita por staff ativo; admin e head coach podem
  atribuir qualquer unidade.
- Solicitação feita pelo jogador exige aprovação; alteração feita por staff,
  head coach ou admin é aplicada e deve gerar notificação ao jogador.
- A fila, histórico, aprovação formal e notificações de posições serão
  implementados nas fatias de Perfil/gestão de staff; este card persiste o
  cadastro e o estado pendente inicial.
- O contrato de verificação aceita `positions` e não aceita `staffRole` para
  novos cadastros.
- A sessão devolve posições enriquecidas, unidades derivadas e permissão de
  admin.
- O banco já possui `player_position`; a implementação pode adicionar estado
  de aprovação à posição sem criar uma tabela paralela de cadastro.
- Staff existente com subpapel continua compatível; novos staffs não recebem
  `staff_role` no cadastro.

## Testing Decisions

- Testar comportamento externo pela API e pela interface, não detalhes
  internos de persistência.
- API deve cobrir:
  - código de time inválido;
  - jogador com posições;
  - jogador sem posições usando skip;
  - posição desconhecida ou de unidade inválida;
  - jogador ativo sem posição aprovada;
  - staff sem subpapel e em estado pendente;
  - campos de jogador enviados para staff;
  - sessão com posições, unidades e permissão de admin;
  - fronteiras de autorização de jogador, staff pendente, staff ativo,
    head coach e admin.
- Web deve cobrir:
  - seleção de posições usando componentes da biblioteca UI;
  - derivação visual de unidades;
  - skip e aviso de posição pendente;
  - erro acessível de código do time;
  - fluxo de jogador e staff.
- E2E deve reutilizar os fixtures e a página de autenticação existentes,
  cobrindo os dois métodos de login e a matriz de autorização.
- O padrão de validação é o já usado no card 01: testes unitários, build,
  lint e Playwright mobile/desktop.

## Out of Scope

- Aprovação/recusa final de cadastro de staff.
- Atribuição e remoção de subpapéis de staff.
- Tela completa de fila de posições e histórico de alterações.
- Edição de posições no Perfil.
- Validação de telefone, consentimento WhatsApp e envio de mensagens.
- Conteúdo do Playbook específico por unidade.
- Criação de um superadmin global fora do admin configurado no ambiente.

## Further Notes

- Card 01 é a única dependência técnica obrigatória.
- Card 03 deve reutilizar o onboarding de posições no callback Google.
- Card 04 deve implementar Perfil, edição solicitada e visualização do estado
  das posições.
- Card 06 deve implementar gestão de staff, subpapéis e governança
  administrativa.
