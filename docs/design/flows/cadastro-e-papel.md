# Fluxo 1: Cadastro, Autenticação e Escolha de Papel

## 1. Visão geral

Qualquer membro do **time** pode criar uma conta ou entrar no time,
confirmar sua identidade por código de e-mail ou Google e escolher o
papel `jogador` ou `staff`.

- O cadastro manual exibe **`Time: Navigators`** como informação somente leitura
  (no MVP single-team) e o frontend envia automaticamente
  `teamCode: "NAVS-2026"` na verificação, sem exibir um campo editável
  **"Código do time"** na tela.
- Jogador entra `ativo`, podendo escolher posições de ofensiva e/ou defesa ou
  pular essa etapa (**Pular posições por agora**).
- Posições informadas pelo jogador ficam com estado `pendente` de validação.
- Staff não escolhe subpapel no cadastro e entra `pendente`, aguardando
  definição de um Admin ou Head Coach.
- Admin geral é configurado pelo ambiente/seed; não pode ser autoatribuído.
- O onboarding de escolha de papel e posições é compartilhado entre e-mail e
  Google após a confirmação de identidade.

## 2. Fluxo e etapas (`AuthScreen`)

```text
[1. Boas-vindas (SnapIn)]
   ├─ Entrar com o Google ──────────────────────────┐
   │    (erro OAuth exibido na própria etapa)       │
   │                                                ▼
   └─ Entrar com código por e-mail          [Identidade Google]
        │                                           │
        ▼                                           │
[2. Dados & Time (cadastro manual)]                 │
   • Time: Navigators (somente leitura;             │
     envia teamCode: "NAVS-2026" automaticamente)   │
   • Nome completo + Telefone (opcional) + E-mail   │
   • Ações: [Receber código de 6 dígitos] / [Voltar]│
        │                                           │
        ▼                                           │
[3. Verifique seu e-mail (código 6 dígitos)]        │
   • 6 inputs individuais de 1 dígito cada          │
     (.otp-inputs / .otp-digit-input, tabular-nums) │
   • Ações: [Continuar] / [Reenviar código / Voltar]│
        │                                           │
        └───────────────────┬───────────────────────┘
                            ▼
            [4. Como você participa do time? (Papel)]
               • Escolha: [Jogador] ou [Staff]
               • Erro de submissão visível na própria etapa
               • Ação reversa: [Voltar] (retorna à etapa 3)
                   │                          │
      ┌────────────┘                          └──────────────┐
      ▼                                                      ▼
[5. Suas posições (Jogador)]                   [Staff: sem subpapel]
   • Ofensiva (QB, RB, FB, WR, TE, OL)                       │
   • Defesa (DL, LB, CB, S)                                  ▼
   • Ações:                                    [6. Cadastro pendente]
     - [Criar conta]                              • Aguarda Admin ou Head Coach
     - [Pular posições por agora]                 • Ação: [Ir para a tela inicial]
     - [Voltar] (retorna à etapa 4)                          │
      │                                                      ▼
      ▼                                        [Home de Staff Pendente]
[Conta ativa + posições                           • Exibe papel "Staff" (sem "()")
 pendentes, se houver]                            • Ações: [Falar com o staff]
                                                           e [Sair da conta]
```

### Retornos de erro na verificação final (`POST /auth/email/verify`)

- **`401` (código de 6 dígitos inválido ou expirado)**: retorna para a etapa
  **3 (`code`)** com mensagem de erro associada ao campo de código, preservando
  o e-mail, o nome e o telefone já preenchidos e o vínculo automático com o time
  (`teamCode: "NAVS-2026"`).
- **`400` / `409` (time indisponível ou falha de vínculo de time)**: retorna
  para a etapa **2 (`email`)** exibindo alerta de erro acessível no card, sem
  exigir campo editável de código do time.
- **Falha de rede ou erro `5xx` ao confirmar papel `Staff` ou `Jogador`**:
  mantém o usuário na etapa atual (**4 (`role`)** ou **5 (`player-positions`)**)
  e exibe `<FieldError role="alert">` visível no card, sem engolir o erro.

## 3. Dados coletados

- **Time (somente leitura)**: exibe `Time: Navigators` (somente leitura no MVP
  single-team). Em conformidade estrita com o `GLOSSARY.md`, nunca utiliza o
  termo proibido *"Equipe"*.
- **Código do time (`teamCode`, automático)**: vinculado ao time selecionado
  (`Navigators` → `teamCode: "NAVS-2026"`) e enviado automaticamente pelo
  frontend no `POST /auth/email/verify`, sem exibir um campo de input editável
  **"Código do time"** ao usuário.
- **Nome completo**: obrigatório no cadastro manual; nome disponível do Google
  pode preencher o campo.
- **Telefone (opcional)**: informado em formato livre (`+351 912 345 678`) para
  futura comunicação por WhatsApp, sem validação nem envio de mensagem no MVP.
- **E-mail**: obrigatório e verificado.
- **Papel**: `jogador` ou `staff`.
- **Posições**: opcionais para `jogador`; proibidas para `staff` no payload de
  cadastro.

## 4. Posições e unidades

Na etapa **5 (`player-positions`)**, o jogador pode selecionar zero, uma ou
múltiplas posições agrupadas por unidade:

- **Ofensiva**: `QB`, `RB`, `FB`, `WR`, `TE`, `OL`.
- **Defesa**: `DL`, `LB`, `CB`, `S`.

Special teams (`K`, `P`, `LS`, `KR/PR`, `Gunner`) não é escolhida no cadastro
inicial e pode ser atribuída posteriormente por staff ativo. Uma posição de
special teams pode coexistir com ofensiva e defesa.

As unidades são derivadas das posições aprovadas. Posições escolhidas pelo
jogador começam com estado `pendente`; posições aprovadas por staff, head coach
ou admin passam a derivar unidades liberadas para conteúdo específico.

O jogador pode acionar **Pular posições por agora**. Nesse caso, a conta entra
`ativa` sem posições cadastradas; o jogador vê um aviso no Perfil e acessa
apenas jogadas de special teams até possuir uma posição aprovada. Da etapa de
posições, o jogador também pode acionar **Voltar** para retornar à escolha de
papel.

## 5. Staff e administração

Staff não escolhe subpapel no cadastro. Ao selecionar **Staff** na etapa de
papel, o cadastro é submetido sem `staffRole` e entra no estado `pendente` sem
permissões de edição ou leitura protegida.

- **Tela pós-cadastro (`pending`)**: informa que o cadastro como staff aguarda
  definição de um **Admin ou Head Coach** e oferece o botão **Ir para a tela
  inicial**.
- **Home de staff pendente (`PendingStaffHome`)**: exibe que o usuário solicitou
  acesso no papel de **Staff** (sem parênteses vazios `Staff ()` quando não há
  subpapel atribuído; se houver subpapel atribuído, exibe `Staff (Subpapel)`),
  explica que a aprovação cabe a um **Admin ou Head Coach** e disponibiliza as
  ações **Falar com o staff** e **Sair da conta**.
- **Governança**:
  - Admin geral administra toda a aplicação.
  - Head coach administra posições e permissões esportivas do time.
  - Staff ativo revisa solicitações de posições e pode atribuir posições de
    special teams.
  - Admin e head coach podem atribuir qualquer posição e definir os subpapéis
    (`head_coach`, coordenadores de unidade e coordenador de special teams).

## 6. Validação, estados e acessibilidade

1. **Contexto do time e envio automático de `teamCode` (etapa `email`)**:
   - **Time somente leitura**: rótulo `Time:` associado semanticamente ao valor
     `Navigators` (`<output id="team-name" aria-label="Time atual: Navigators">Navigators</output>`
     ou `<input readOnly value="Navigators">`), sem usar `<Field disabled>`
     (evitando opacidade reduzida de controle inativo) e sem usar a palavra
     proibida *"Equipe"*;
   - **Vínculo automático do código do time**: como apenas o time `Navigators`
     está ativo no MVP, a UI não exibe um campo editável `"Código do time"`; o
     frontend envia `teamCode: "NAVS-2026"` automaticamente no payload de
     `POST /auth/email/verify`.
2. **Código de verificação de e-mail (etapa `code`)**:
   - **6 campos individuais por caractere/dígito** (`.otp-inputs` contendo 6
     inputs `.otp-digit-input` de `maxLength={1}`), agrupados semanticamente com
     `role="group"` e `aria-labelledby`, e cada campo rotulado individualmente
     (`aria-label="Dígito 1 de 6 do código de verificação"` .. `"Dígito 6 de 6"`);
   - `inputmode="numeric"`, `pattern="\d"` e `autocomplete="one-time-code"` no
     primeiro campo, com **auto-avanço de foco** ao digitar um número, suporte a
     **`Backspace`** (voltando o foco ao dígito anterior quando vazio), setas
     horizontais e **colar (`paste`)** o código completo de 6 dígitos
     distribuindo os caracteres automaticamente pelos 6 inputs;
   - tipografia `--font-mono` com `font-variant-numeric: tabular-nums`, texto
     centralizado (`text-align: center`), alvo de toque `>= 44×44px` por campo e
     layout responsivo (`grid-template-columns: repeat(6, minmax(0, 1fr))`) sem
     overflow horizontal em `390×844`;
   - código inválido ou expirado (`401`) associa o `<FieldError>` aos inputs via
     `aria-describedby` e não limpa o e-mail nem os dados preenchidos;
   - botões secundários permitem reenviar o código ou voltar à etapa `email`.
3. **Escolha de papel (etapa `role`)**:
   - grupo com `role="group"` e `aria-label="Escolha de papel"`;
   - botões **Jogador** e **Staff** com `min-height: 72px`, `aria-pressed` e
     subtítulos descritivos de cada papel (**Jogador**: `"Atleta que pertence ao clube"`;
     **Staff**: `"Coaches, Coordenadores e auxiliares do clube"`);
   - renderiza `<FieldError role="alert">` no topo do card caso a requisição de
     confirmação falhe;
   - inclui obrigatoriamente botão **Voltar** para retornar à etapa `code`.
4. **Posições do jogador (etapa `player-positions`)**:
   - seleção múltipla com botões `.position-toggle` agrupados em `Ofensiva` e
     `Defesa` (`role="group"`);
   - alvo de toque mínimo obrigatório de **`44×44px`** (`min-height: 44px`,
     `min-width: 44px`);
   - estado selecionado exposto com `aria-pressed="true"` e diferenciado por
     contraste (`background: var(--primary)`, `color: var(--primary-foreground)`)
     **e** indicador visual não-cromático (prefixo/ícone `✓ ` antes da sigla,
     ex.: `✓ WR`);
   - botões **Criar conta**, **Pular posições por agora** e **Voltar** sempre
     acessíveis com altura mínima de `44px`.
5. **Botão Google e estado de carregamento (`loading`)**:
   - rótulo visível completo **Entrar com o Google** (alinhado ao nome
     acessível, sem truncar para *"com o Google"*);
   - ícone SVG do Google puramente decorativo (`aria-hidden="true"`, sem
     `role="img"` conflitante);
   - durante `loading={true}`, o rótulo textual oculto do botão recebe
     `aria-hidden="true"` para que leitores de tela anunciem apenas o
     `loadingLabel` do `Spinner`.

## 7. Escopo por card

- **Card 02:** cadastro, persistência inicial, estado pendente de posição e
  onboarding compartilhado.
- **Card 03:** integração Google reutilizando este onboarding.
- **Card 04:** Perfil, solicitação de alteração e dados pessoais.
- **Card 06:** aprovação de staff, subpapéis, fila e governança de posições.
