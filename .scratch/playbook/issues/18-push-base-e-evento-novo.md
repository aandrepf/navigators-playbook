# 18: Push — base e evento novo

**What to build:** O jogador instala o app e recebe push quando um evento novo exige resposta. No iOS, o app explica que a instalação na tela inicial é pré-requisito, sem insistir.

**Blocked by:** 12 (Evento de treino)

**Status:** ready-for-agent

- [ ] Inscrição de push por dispositivo, com permissão disparada por gesto do usuário
- [ ] Aviso único de instalação na tela inicial quando o acesso é iOS e o app não está instalado
- [ ] Push de evento novo chega a todos os usuários ativos
- [ ] Preferências permitem desligar cada tipo de notificação
- [ ] Inscrição inválida ou expirada é removida ao falhar o envio
- [ ] Testes da decisão de quem notificar e da idempotência do registro, sem depender da entrega real
