# 16: Jogo e disponibilidade

**What to build:** O staff cria o evento de jogo com adversário e a marcação de disponibilidade de cada jogador. O consolidado cruza a disponibilidade com o status do elenco, sem que a marcação altere o status.

**Blocked by:** 05 (Status do elenco editável), 13 (Presença com justificativa)

**Status:** ready-for-agent

- [ ] Staff cria evento do tipo jogo com data, adversário, local e prazo de resposta (default 48h antes)
- [ ] Jogador marca disponibilidade para o jogo, com a mesma mecânica e justificativa obrigatória da presença
- [ ] Staff vê o consolidado do jogo cruzando disponibilidade com status do elenco
- [ ] Jogadores lesionados ou reformados aparecem destacados no consolidado
- [ ] Marcação de disponibilidade não altera o status do elenco
- [ ] Testes de autorização e do cruzamento com status
