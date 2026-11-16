# Playbook do Time — MVP

Status: ready-for-agent
Feature: `playbook`

## Declaração do problema

O time de futebol americano do qual faço parte distribui o playbook em PDF por grupo de WhatsApp. Cada atualização exige reenviar o arquivo, e não há como saber quem leu, qual versão está em uso, nem o que mudou desde a última consulta. Quem é da ofensiva não tem acesso à defesa, e special teams depende de um terceiro envio.

A presença em treino é controlada por enquete de WhatsApp, que não reflete quem realmente aparece e não registra por que alguém não vai. Quem falta precisa justificar ao staff, mas ninguém tem visibilidade da justificativa nem de quem não respondeu. O mesmo vale para a disponibilidade de cada jogador para um jogo: o staff descobre no dia quem está lesionado, indisponível ou reformado.

O resultado é retrabalho para o staff, informação desatualizada para o jogador e decisões de escalação tomadas com dados incompletos.

## Solução

Um web app mobile-first, instalável como PWA, que passa a ser a fonte única do playbook e do estado do time.

O playbook deixa de ser PDF e vira jogadas estruturadas — nome, unidade, formação, situação e atribuição por posição — com imagem opcional, histórico de versões e um selo de novidade para o jogador. A visibilidade é por jogada e por unidade, com special teams aberta a todo o time.

Treinos e jogos viram eventos com prazo de resposta. O jogador responde "vou" ou "não vou"; a recusa exige justificativa, que só o staff vê. O staff acompanha confirmados, ausentes com justificativa e sem resposta, em uma tela só.

Para jogos, a resposta é a marcação de disponibilidade, e o staff monta o game plan referenciando jogadas do playbook com notas daquele confronto. O status do elenco (`disponivel`, `indisponivel`, `lesionado`, `reformado`) fica visível e atualizado, separado da disponibilidade de cada jogo.

Atualizações e prazos chegam por Web Push, com e-mail como rede de segurança.

## Histórias de usuário

### Cadastro e acesso

1. Como membro do time, quero me cadastrar com o código do time, para entrar sem depender de o staff criar minha conta.
2. Como membro do time, quero confirmar meu e-mail com um código ou entrar com Google, para provar minha identidade.
3. Como membro do time, quero informar nome e telefone opcional, para manter meu perfil pronto para futuras notificações.
4. Como membro do time, quero escolher jogador ou staff, para iniciar com o papel correto.
5. Como jogador, quero escolher mais de uma posição de ofensiva e/ou defesa, para refletir onde atuo.
6. Como jogador, quero poder pular a escolha inicial de posições, para concluir meu cadastro e completar o perfil depois.
7. Como jogador, quero ver minhas posições e o estado de validação, para saber o que foi aprovado.
8. Como jogador, quero solicitar correção de posição, para consertar um cadastro errado.
9. Como membro do staff, quero me cadastrar sem escolher subpapel, para não receber permissão de edição automaticamente.
10. Como membro do staff, quero ficar pendente até um administrador ou head coach definir meu acesso, para que ninguém ganhe edição apenas se declarando staff.
11. Como admin geral, quero administrar a aplicação inteira, para operar todos os times.
12. Como head coach, quero administrar posições e permissões esportivas do meu time, para manter o elenco correto.
13. Como staff ativo, quero revisar solicitações de posição, para validar o cadastro dos jogadores.
14. Como staff ativo, quero atribuir posições de special teams, para registrar jogadores que também atuam nessa unidade.
15. Como admin ou head coach, quero atribuir qualquer posição, para corrigir o cadastro do elenco.
16. Como jogador, quero ser avisado quando uma posição for alterada por staff, para manter meu perfil atualizado.
17. Como head coach, quero aprovar ou recusar cadastros de staff, para controlar quem edita o quê.
18. Como head coach, quero conceder o subpapel de coordenador de special teams a qualquer membro do staff, para que ele acumule essa função com a sua.
19. Como usuário, quero sair da minha conta, para usar o app em um aparelho compartilhado.
20. Como usuário, quero continuar logado entre visitas, para não autenticar a cada treino.

### Elenco e status

13. Como jogador, quero ver o elenco do time com posições e unidades, para saber com quem conto em cada situação.
14. Como jogador, quero ver o status dos companheiros (disponível, indisponível, lesionado, reformado), para entender quem está apto.
15. Como staff, quero alterar o status de um jogador, para manter o elenco atualizado.
16. Como staff, quero registrar observação no status, para explicar uma indisponibilidade pontual.
17. Como staff, quero informar data prevista de retorno quando o status é lesionado, para planejar escalação.
18. Como staff, quero filtrar o elenco por unidade, posição e status, para montar escalação rápido.
19. Como staff, quero que o status do elenco seja distinto da disponibilidade para um jogo, para não confundir lesão com ausência pontual.
20. Como jogador, quero que meu próprio status apareça no meu perfil, para saber como estou registrado.

### Playbook

21. Como staff, quero criar uma jogada com nome, unidade, formação, situação e atribuição por posição, para publicar conteúdo sem depender de PDF.
22. Como staff, quero anexar uma imagem à jogada, para reaproveitar o material que o coach já desenha.
23. Como staff, quero editar uma jogada e manter o histórico de versões, para corrigir sem perder o que foi publicado antes.
24. Como staff, quero definir quais unidades veem cada jogada, para manter o sigilo de ofensiva e defesa.
25. Como staff, quero que a jogada nasça visível apenas para a unidade dona, para não vazar conteúdo por descuido.
26. Como staff, quero liberar uma jogada específica para outra unidade, para compartilhar um conceito sem abrir o playbook inteiro.
27. Como staff, quero que jogadas de special teams sejam visíveis para todo o time, para que ataque e defesa estudem o mesmo material.
28. Como staff, quero arquivar uma jogada sem apagá-la, para tirá-la do playbook ativo mantendo o histórico.
29. Como coordenador ofensivo, quero editar jogadas da ofensiva, para manter meu playbook sem depender do head coach.
30. Como coordenador defensivo, quero editar jogadas da defesa, para manter meu playbook sem depender do head coach.
31. Como coordenador de special teams, quero editar jogadas de special teams, para manter essa unidade atualizada.
32. Como coordenador de uma unidade, quero ver, mas não editar, jogadas de outras unidades que me foram liberadas, para estudar sem risco de alteração.
33. Como head coach, quero editar qualquer jogada, para corrigir qualquer unidade.
34. Como jogador, quero listar as jogadas visíveis para mim, agrupadas por unidade, para navegar o playbook.
35. Como jogador, quero ver todas as atribuições de uma jogada, para saber o que cada posição faz e não só a minha.
36. Como jogador, quero ver o selo de novidade nas jogadas alteradas desde meu último acesso, para saber o que estudar.
37. Como jogador, quero marcar que estudei uma jogada, para o selo sumir quando eu quiser.
38. Como jogador, quero buscar jogada por nome, para achar rápido durante a reunião.
39. Como jogador, quero filtrar jogadas por formação e situação, para achar a jogada do momento do jogo.
40. Como jogador, quero abrir a imagem da jogada, para ver o desenho do coach.

### Eventos e presença

41. Como staff, quero criar um evento do tipo treino com data, local e prazo de resposta, para substituir a enquete do WhatsApp.
42. Como staff, quero criar um evento do tipo jogo com data, adversário, local e prazo de resposta, para concentrar as informações do confronto.
43. Como staff, quero ajustar o prazo de resposta por evento, para cobrar resposta com a antecedência que eu precisar.
44. Como staff, quero cancelar ou remarcar um evento, para avisar o time sem criar outro.
45. Como jogador, quero ver os próximos eventos na home, para saber o que vem e o que exige resposta.
46. Como jogador, quero confirmar que vou a um evento, para o staff saber que estou dentro.
47. Como jogador, quero recusar um evento informando justificativa, para explicar a ausência ao staff.
48. Como jogador, quero escolher a justificativa de uma lista, para responder rápido pelo celular.
49. Como jogador, quero complementar a justificativa com texto livre, para detalhar o que a lista não cobre.
50. Como jogador, quero mudar minha resposta enquanto o prazo não venceu, para corrigir um plano que mudou.
51. Como jogador, quero ser lembrado por push antes do prazo quando não respondi, para não deixar o staff sem resposta.
52. Como staff, quero ver confirmados, ausentes com justificativa e sem resposta no evento, para cobrar quem falta.
53. Como staff, quero ver a justificativa completa de cada ausência, para entender o motivo real.
54. Como staff, quero que jogadores vejam apenas "ausente", sem a justificativa, para proteger dados de saúde e vida pessoal.
55. Como staff, quero marcar a presença real no treino depois do evento, para comparar resposta com comparecimento.
56. Como staff, quero ver a taxa de comparecimento por jogador ao longo do tempo, para identificar padrão de ausência.
57. Como jogador, quero ver se sou contado como presente ou ausente, para não haver dúvida sobre o registro.

### Jogos, disponibilidade e game plan

58. Como jogador, quero marcar minha disponibilidade para um jogo, para o staff saber com quem conta.
59. Como jogador, quero que recusar um jogo também exija justificativa, para o mesmo padrão de transparência dos treinos.
60. Como staff, quero ver a disponibilidade consolidada do jogo, para decidir a escalação.
61. Como staff, quero cruzar disponibilidade com status do elenco, para não escalar quem está lesionado ou reformado.
62. Como staff, quero montar o game plan escolhendo jogadas do playbook, para montar o plano do confronto sem duplicar conteúdo.
63. Como staff, quero ordenar as jogadas do game plan, para definir a sequência de chamadas.
64. Como staff, quero escrever uma nota por jogada no game plan, para registrar o ajuste daquele adversário.
65. Como staff, quero que editar uma jogada reflita no game plan automaticamente, para não ter duas versões da mesma jogada.
66. Como jogador, quero ver o game plan do próximo jogo, para chegar sabendo o que foi escolhido.

### Notificações

67. Como jogador, quero receber push quando uma jogada visível para mim for atualizada, para não perder mudança de playbook.
68. Como jogador, quero receber push quando um evento novo exigir resposta, para responder dentro do prazo.
69. Como jogador, quero receber push de lembrete quando o prazo de resposta está perto, para não deixar o staff sem resposta.
70. Como staff, quero receber push quando um jogador responde ou justifica ausência, para acompanhar sem abrir o app.
71. Como staff, quero receber push quando um cadastro de staff aguarda aprovação, para liberar acesso rápido.
72. Como usuário, quero controlar quais notificações recebo, para não ser avisado do que não me interessa.
73. Como usuário, quero receber e-mail quando o push não estiver disponível, para não perder aviso.
74. Como usuário, quero ser avisado de que preciso instalar o app na tela inicial para receber push, para não achar que a notificação está quebrada.

### Administração, privacidade e suporte

75. Como head coach, quero remover o papel de staff de alguém, para revogar edição sem apagar a conta.
76. Como head coach, quero ver todos os cadastros pendentes, para não deixar ninguém bloqueado.
77. Como staff, quero registrar um jogador que ainda não se cadastrou no elenco, para o elenco ficar completo antes de todos entrarem.
78. Como usuário, quero entrar em contato com o staff pelo app quando não consigo responder, para não ficar sem canal.
79. Como usuário, quero apagar minha conta, para sair do time quando eu quiser.

## Decisões de implementação

### Arquitetura

- Front-end React + Vite (scaffold atual), mobile-first, responsivo para desktop, instalável como PWA com manifesto `standalone`. Navegação por barra inferior no celular e lateral no desktop.
- Backend próprio em Node/Fastify, Postgres gerenciado no Neon, deploy no Railway (ADR-0001).
- Autenticação por e-mail com código de uso único e por Google OAuth. Sem senha. Sem Instagram: a API não autentica conta pessoal nem devolve e-mail (verificado nas docs da Meta; Basic Display desativado em 04/12/2024).
- Sessão por cookie `httpOnly`, `secure`, `sameSite=lax`, com expiração deslizante.
- Web Push com VAPID e subscription por dispositivo, guardada no servidor (ADR-0002). E-mail como fallback. No iOS o push exige PWA instalado na tela inicial (16.4+), permissão por gesto e não há push silencioso.

### Modelo de dados

- `team`: um único time no MVP, com identificador presente em todas as entidades para permitir multi-time depois.
- `user`: identidade, e-mail verificado, telefone opcional, papel (`jogador` | `staff`), permissão administrativa opcional, estado de aprovação (`ativo` | `pendente` | `recusado`), preferências de notificação.
- `player`: vínculo do usuário jogador com o elenco, status do elenco e observação; data prevista de retorno quando lesionado.
- `player_position`: posições do jogador (mais de uma), cada uma mapeada a uma unidade e a um estado de validação (`pendente` | `aprovada`).
- `staff_role`: subpapéis do staff. Head coach, coordenador ofensivo e coordenador defensivo são exclusivos por unidade; coordenador de special teams é aditivo e acumulável por qualquer staff.
- `play`: jogada com nome, unidade dona, formação, situação, status (`ativa` | `arquivada`), versão atual e imagem opcional.
- `play_assignment`: atribuição por posição dentro da jogada.
- `play_revision`: histórico de versões da jogada, gravado a cada edição relevante.
- `play_visibility`: unidades que veem a jogada. Default: a unidade dona. Special teams é sempre visível para todo o time, por regra, sem depender de linha.
- `play_read`: marcação de estudo por jogador, usada para calcular novidade.
- `event`: treino ou jogo, com data, local, adversário quando jogo, prazo de resposta e estado (`ativo` | `cancelado`).
- `event_response`: resposta do jogador (`vou` | `nao_vou`), justificativa obrigatória quando `nao_vou`, e presença real registrada pelo staff depois do treino.
- `game_plan_item`: referência ordenada a uma jogada, com nota do confronto (ADR-0004).
- `push_subscription`: endpoint, chaves e dispositivo do usuário.
- `notification`: registro do que foi enviado, para idempotência e diagnóstico.

### Contratos de API (REST, JSON)

- Autenticação: iniciar e verificar código de e-mail, callback do Google, sessão atual, logout.
- Jogadores: listar, ler, solicitar e revisar posições e unidades; staff atualiza status, observação e retorno previsto.
- Staff: listar pendentes, aprovar, recusar, atribuir e remover subpapéis.
- Jogadas: listar conforme visibilidade do solicitante, ler, criar, editar, arquivar, definir visibilidade, anexar imagem, marcar como estudada.
- Eventos: listar, criar, editar, cancelar, responder, listar respostas consolidadas (staff), registrar presença real (staff).
- Jogos: marcar disponibilidade, consultar consolidado, listar e editar game plan.
- Push: registrar e remover inscrição, listar preferências.

Toda autorização é decidida no servidor, por papel, subpapel e vínculo do usuário com a entidade. A API nunca devolve justificativa para quem não é staff, nem jogada fora da visibilidade do solicitante.

### Regras de domínio

- **Visibilidade de jogada**: dona + unidades liberadas; special teams sempre aberta a todo o time (ADR-0006). `play_read` do solicitante define o que é "novo".
- **Novidade**: a jogada é nova para o jogador quando a versão atual é posterior ao seu último `play_read` e a jogada está na visibilidade dele. Não há marcação item a item obrigatória.
- **Edição por subpapel**: head coach e admin editam qualquer unidade; coordenador edita a sua; ninguém edita unidade alheia, ainda que a veja. Staff sem subpapel de unidade só lê o playbook.
- **Cadastro e posições**: jogador entra ativo mesmo sem posição aprovada. Unidades são derivadas das posições aprovadas. Staff ativo pode revisar solicitações; staff pode atribuir special teams; admin e head coach podem atribuir qualquer posição. Alterações administrativas notificam o jogador.
- **Presença**: resposta permitida até o prazo; depois disso só o staff altera. Presença real é registro separado, feito pelo staff após o treino.
- **Disponibilidade de jogo**: mesma mecânica de resposta, com prazo próprio; não altera o status do elenco.
- **Status do elenco**: `disponivel`, `indisponivel`, `lesionado`, `reformado`. Suspensão é `indisponivel` com observação. Só staff edita.
- **Prazos padrão**: treino 24h antes; jogo 48h antes; ajustáveis por evento.
- **Notificações**: push na criação de evento, no lembrete antes do prazo, na atualização de jogada visível e na resposta recebida (para o staff da unidade). Um segundo lembrete é enviado a quem não respondeu. Sem push silencioso.
- **Fuso**: `America/Sao_Paulo`; datas exibidas no fuso do time.
- **Idioma**: PT-BR, sem i18n.

### Telas do MVP

Home (próximos eventos, novidades do playbook, pendências de resposta); Evento (detalhe, responder, justificar, consolidado para staff); Playbook (lista por unidade, busca, filtros, detalhe da jogada, imagem, selo de novidade); Jogo (disponibilidade, consolidado, game plan); Elenco (somente staff: status, posições, filtros); Perfil (posições, status, notificações, sair). A aba Elenco não aparece para jogador.

## Decisões de teste

- Testamos comportamento externo, nunca implementação. Um teste que quebra ao renomear uma função interna está errado.
- **Seam 1 — API via `app.inject`** com Postgres efêmero por suíte. É o seam principal e cobre: matriz de autorização (jogador, staff sem subpapel, coordenador de cada unidade, head coach, staff pendente), visibilidade de jogada incluindo a exceção de special teams, novidade por `play_read`, ciclo de resposta com prazo vencido, justificativa obrigatória e invisível ao jogador, presença real separada da resposta, disponibilidade de jogo, game plan ordenado por referência, status do elenco e aprovação de staff.
- **Seam 2 — telas com MSW**: cliente HTTP interceptado na rede. Cobre o que cada tela mostra para cada papel, Elenco oculto ao jogador, blocos de confirmados/ausentes/sem resposta, selo de novidade, estados de carregamento e erro, e o aviso de instalação do PWA para push.
- Testes de notificação cobrem a decisão de quem notificar e a idempotência do registro, não a entrega real pelo serviço de push, que só se verifica manualmente em dispositivo.
- Prior art: `src/App.test.tsx` (Vitest + React Testing Library, `globals: true`, jest-dom carregado em `src/test/setup.ts`).

## Fora de escopo

- Editor de desenho de jogadas (campo, rotas, animação): fase 2 (ADR-0003).
- Leitura offline do playbook e do game plan: fase 2.
- Impressão, PDF, wristband e call sheet: fase 3.
- Múltiplos times ou multi-tenant: fase 3.
- Login com Instagram: inviável tecnicamente para conta pessoal; descartado.
- App nativo ou wrapper Capacitor: só se o Web Push se mostrar insuficiente.
- Escrita offline e sincronização: não previsto.
- Estatísticas de jogo, vídeo, profundidade de elenco (depth chart), pagamentos e mensalidade.
- i18n e múltiplos fusos.

## Notas adicionais

- A pesquisa sobre o Playmaker (app nativo, US$ 7–11/mês por coach) mostrou que o ponto fraco recorrente nas avaliações é exatamente compartilhar o playbook e dar acesso ao time. A diferenciação deste app é distribuição, colaboração e presença — não competir no editor.
- No iOS, o funil de push depende de instalar o PWA na tela inicial. A Home deve apresentar esse convite uma vez, sem insistir, e o e-mail cobre quem não instalar.
- O glossário em `GLOSSARY.md` fixa o vocabulário: "marcação" é disponibilidade para jogo, "presença" é treino, "status do elenco" é condição cadastral. Novos termos entram por `domain-modeling`.
- Os ADRs 0001–0006 em `docs/adr/` registram as decisões estruturais tomadas durante o desenho.
