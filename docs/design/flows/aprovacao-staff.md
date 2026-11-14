# Fluxo 5: Aprovação de Staff, Subpapéis e Revogação (`docs/design/flows/aprovacao-staff.md`)

## 1. Visão Geral

Garante que ninguém ganhe acesso de edição ao playbook nem visualização de dados restritos (**justificativas** de ausência e detalhes de **status do elenco** / lesões) apenas se autodeclarando **staff** no cadastro (ADR-0005). Todo cadastro como staff nasce no estado **pendente** até que um **head coach** aprove ou recuse. Após aprovado, o head coach também pode conceder cumulativamente o subpapel de **coordenador de special teams** a qualquer membro do staff ou remover o papel de staff sem apagar a conta do usuário.

Histórias do spec atendidas: `7`, `8`, `9`, `10`, `29`, `30`, `31`, `33`, `71`, `75`, `76`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Usuário se cadastra escolhendo Papel = STAFF e Subpapel (ex.: Coordenador Defensivo) — História 7]
        │
        ▼
[Estado do Usuário: PENDENTE (História 8 / ADR-0005)]
   - O usuário vê a tela de bloqueio informativo:
     "Cadastro de Staff Pendente — aguardando aprovação de um Head Coach."
   - Não tem acesso a justificativas, status do elenco restrito nem edição do playbook.
   - Sistema dispara Web Push (e e-mail fallback) para o(s) Head Coach(es) (História 71).
        │
        ▼
[Head Coach abre o App -> Card na Home OU Topo da Tela Elenco (História 76)]
   - Visualiza a fila "Cadastros de Staff Pendentes":
     • Nome: Carlos Eduardo Silva
     • E-mail verificado: carlos.silva@navigators.com.br
     • Subpapel solicitado: Coordenador Defensivo
        │
        ├──► Decisão A: HEAD COACH TOCA EM [✕ RECUSAR] (História 9)
        │       - Confirma recusa
        │       - Estado de aprovação passa para 'recusado'
        │       - Usuário não recebe acesso de staff (pode converter-se em jogador ou falar com o staff)
        │
        └──► Decisão B: HEAD COACH TOCA EM [✓ APROVAR] (História 9)
                - Estado de aprovação passa para 'ativo'
                - O novo membro do staff passa a ter acesso imediato às 6 abas (incluindo Elenco)
                - Suas permissões de edição no Playbook seguem estritamente seu subpapel:
                  • Head coach -> edita qualquer unidade (História 33)
                  • Coordenador ofensivo -> edita Ofensiva (História 29)
                  • Coordenador defensivo -> edita Defesa (História 30)
        │
        ▼
[Gestão Contínua de Subpapéis pelo Head Coach na Tela Elenco]
   ├─► Conceder Coordenador de Special Teams (História 10):
   │     - Head Coach ativa o toggle "+ Acumular Coordenador de Special Teams" em um membro do staff ativo
   │     - O membro mantém seu subpapel original e passa a ser o único (além do Head Coach)
   │       habilitado a criar/editar jogadas da unidade Special teams (História 31)
   │
   └─► Remover Papel de Staff (História 75):
         - Head Coach aciona "Remover papel de staff" e confirma no modal
         - O usuário perde o papel 'staff' e os subpapéis de edição, voltando ao papel 'jogador'
           sem ter sua conta apagada
```

---

## 3. Estados e Segurança

- **Transparência no Estado Pendente**: a tela de espera informa qual subpapel foi solicitado e quando, oferecendo botão `"Falar com o staff"` caso o solicitante precise agilizar a aprovação antes do treino.
- **Confirmação em Ações Administrativas**: tanto recusar um cadastro pendente quanto remover o papel de staff de um membro ativo exibem confirmação explícita com descrição clara do impacto (`"Ao remover o papel de staff, esta conta deixará de editar o playbook e não verá mais a aba Elenco nem as justificativas de ausência."`).
