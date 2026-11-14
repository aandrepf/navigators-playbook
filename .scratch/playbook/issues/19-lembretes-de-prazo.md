# 19: Lembretes de prazo

**What to build:** Quem não respondeu recebe lembrete antes do prazo e um segundo aviso perto do fim, sem duplicar mensagem. Quem não tem push recebe e-mail.

**Blocked by:** 18 (Push — base e evento novo), 14 (Prazo de resposta)

**Status:** ready-for-agent

- [ ] Primeiro lembrete enviado a quem não respondeu, antes do prazo
- [ ] Segundo lembrete enviado conforme a regra definida, sem repetir o primeiro
- [ ] Quem respondeu deixa de receber lembretes daquele evento
- [ ] Fallback por e-mail quando o usuário não tem inscrição de push válida
- [ ] Nenhum lembrete é enviado após o prazo vencido
- [ ] Testes com relógio controlado e verificação de idempotência
