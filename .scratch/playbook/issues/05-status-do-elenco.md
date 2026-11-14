# 05: Status do elenco editável

**What to build:** O staff mantém o status do elenco atualizado — `disponivel`, `indisponivel`, `lesionado` ou `reformado` — com observação e, na lesão, data prevista de retorno. O jogador vê o próprio status sem poder alterá-lo.

**Blocked by:** 04 (Elenco e perfil)

**Status:** ready-for-agent

- [ ] Staff altera o status de qualquer jogador entre os quatro valores
- [ ] Observação livre em qualquer status; data prevista de retorno aceita quando lesionado
- [ ] Jogador vê o próprio status e não encontra ação de edição
- [ ] Suspensão é registrada como `indisponivel` com observação, sem status próprio
- [ ] Filtros do elenco por unidade, posição e status
- [ ] Testes de autorização e de validação da data de retorno
