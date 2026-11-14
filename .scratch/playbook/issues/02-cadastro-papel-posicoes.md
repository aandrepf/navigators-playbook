# 02: Cadastro com papel, subpapel e posições

**What to build:** Quem se cadastra informa o código do time, escolhe se é jogador ou staff e, sendo jogador, escolhe a unidade e as posições que ocupa. Staff fica pendente até aprovação; jogador entra direto e já vê o playbook da sua unidade.

**Blocked by:** 01 (Esqueleto andante)

**Status:** ready-for-agent

- [ ] Código do time obrigatório no cadastro; código inválido é recusado com mensagem clara
- [ ] Jogador escolhe ofensiva, defesa ou ambas e uma ou mais posições; unidades são derivadas das posições
- [ ] Staff escolhe subpapel (head coach, coordenador ofensivo, defensivo ou de special teams) e nasce pendente
- [ ] Staff pendente entra no app, mas não edita nada e vê a própria situação
- [ ] Jogador não acessa nenhuma tela de edição
- [ ] Testes da matriz de autorização nos dois caminhos de cadastro
