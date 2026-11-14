# 07: Playbook — jogada com atribuições

**What to build:** O coordenador publica jogadas com nome, unidade, formação, situação e atribuição por posição, e o jogador consulta o playbook da sua unidade. A visibilidade é por jogada, com default na unidade dona; jogadas de special teams são visíveis para todo o time.

**Blocked by:** 06 (Administração de staff)

**Status:** ready-for-agent

- [ ] Coordenador cria e edita jogadas da sua unidade; head coach edita qualquer unidade
- [ ] Jogada contém nome, unidade, formação, situação e atribuição por posição
- [ ] Jogada nasce visível apenas para a unidade dona
- [ ] Staff libera uma jogada específica para outra unidade sem abrir o playbook inteiro
- [ ] Jogador lista as jogadas visíveis agrupadas por unidade e vê todas as atribuições no detalhe
- [ ] Jogadas de special teams aparecem para todo o jogador, independentemente da unidade dele
- [ ] Coordenador lê, mas não edita, jogadas de outras unidades liberadas para ele
- [ ] Testes de visibilidade cobrindo as três unidades e a exceção de special teams
