# 20: Push de playbook e resposta

**What to build:** O jogador é avisado quando uma jogada visível para ele muda, o staff é avisado quando um jogador responde, e o head coach é avisado quando há cadastro de staff aguardando aprovação.

**Blocked by:** 18 (Push — base e evento novo), 09 (Histórico e novidade), 06 (Administração de staff)

**Status:** ready-for-agent

- [ ] Push de jogada atualizada apenas para quem vê a jogada e ainda não a marcou como estudada
- [ ] Push de resposta recebida para head coach e para o coordenador da unidade envolvida
- [ ] Push de staff pendente para todos os head coaches
- [ ] Preferências desligadas suprimem o aviso correspondente
- [ ] Nenhum aviso é enviado a staff pendente
- [ ] Testes da decisão de destinatários por tipo de aviso
