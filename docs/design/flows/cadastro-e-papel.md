# Fluxo 1: Cadastro, Autenticação e Escolha de Papel

## 1. Visão geral

Qualquer membro do **time** pode criar uma conta usando o código do time,
confirmar sua identidade por código de e-mail ou Google e escolher o papel
`jogador` ou `staff`.

- Jogador entra `ativo`, pode escolher posições ou pular essa etapa.
- Posições informadas pelo jogador ficam pendentes de validação.
- Staff não escolhe subpapel no cadastro e entra `pendente`.
- Admin geral é configurado pelo ambiente/seed; não pode ser autoatribuído.
- O onboarding de e-mail e Google é o mesmo após a identidade ser confirmada.

## 2. Fluxo

```text
[Boas-vindas]
   ├─ Google ─► [Identidade confirmada]
   └─ E-mail ─► [Código de 6 dígitos] ─► [Identidade confirmada]
                                      │
                                      ▼
                         [Código do time + nome + telefone opcional]
                                      │
                                      ▼
                          [Escolha: jogador ou staff]
                              │             │
                 ┌────────────┘             └──────────────┐
                 ▼                                         ▼
       [Jogador: posições]                     [Staff: sem subpapel]
          ├─ selecionar                             │
          └─ pular                                 ▼
                 │                         [Estado pendente]
                 ▼                                  │
       [Conta ativa + posições                 [Home com aviso;
        pendentes, se houver]                   sem módulos protegidos]
```

## 3. Dados coletados

- Código do time: obrigatório.
- Nome completo: obrigatório no cadastro manual; nome disponível do Google
  pode preencher o campo.
- E-mail: obrigatório e verificado.
- Telefone: opcional, armazenado para futura integração WhatsApp.
- Papel: `jogador` ou `staff`.
- Posições: opcionais para jogador; proibidas para staff no payload de
  cadastro.

## 4. Posições e unidades

O jogador pode selecionar múltiplas posições:

- Ofensiva: `QB`, `RB`, `FB`, `WR`, `TE`, `OL`.
- Defesa: `DL`, `LB`, `CB`, `S`.

Special teams (`K`, `P`, `LS`, `KR/PR`, `Gunner`) não é escolhida no cadastro
inicial e pode ser atribuída posteriormente por staff ativo. Uma posição de
special teams pode coexistir com ofensiva e defesa.

As unidades são derivadas das posições aprovadas. Posições escolhidas pelo
jogador começam `pendente`; posições aprovadas por staff, head coach ou admin
passam a derivar unidades liberadas para conteúdo específico.

O jogador pode usar **Pular por agora**. Nesse caso, a conta continua ativa,
mas o jogador vê um aviso no Perfil e não acessa conteúdo específico de
unidade até possuir uma posição aprovada.

## 5. Staff e administração

Staff não escolhe subpapel no cadastro. Entra pendente e não recebe
permissões de edição ou leitura protegida.

- Admin geral administra toda a aplicação.
- Head coach administra posições e permissões esportivas do time.
- Staff ativo revisa solicitações de posições.
- Staff ativo pode atribuir posições de special teams.
- Admin e head coach podem atribuir qualquer posição.
- Subpapéis (`head_coach`, coordenadores e special teams) são atribuídos
  posteriormente por admin ou head coach.

## 6. Validação e acessibilidade

1. Código do time:
   - obrigatório;
   - `autocapitalize="characters"`;
   - `spellcheck="false"`;
   - código inválido retorna erro específico associado ao campo.
2. Código de e-mail:
   - `inputmode="numeric"`;
   - `autocomplete="one-time-code"`;
   - código inválido ou expirado não limpa o e-mail.
3. Posições:
   - seleção múltipla com componentes da biblioteca UI;
   - estado selecionado exposto com `aria-pressed`;
   - botão de skip sempre disponível;
   - posição pendente visível no Perfil.
4. Estados protegidos:
   - jogador sem posição aprovada vê Home/Perfil, mas não conteúdo específico
     de unidade;
   - staff pendente vê apenas sua situação.

## 7. Escopo por card

- **Card 02:** cadastro, persistência inicial, estado pendente de posição e
  onboarding compartilhado.
- **Card 03:** integração Google reutilizando este onboarding.
- **Card 04:** Perfil, solicitação de alteração e dados pessoais.
- **Card 06:** aprovação de staff, subpapéis, fila e governança de posições.
