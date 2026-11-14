# Fluxo 1: Cadastro, Autenticação e Escolha de Papel (`docs/design/flows/cadastro-e-papel.md`)

## 1. Visão Geral

Permite que qualquer membro do **time** crie sua conta usando o **código do time** (sem depender de o staff criar cada usuário manualmente — ADR-0005), confirme sua identidade via **código por e-mail** ou **conta Google** (sem senha e sem Instagram), e escolha seu **papel**:
- Se **jogador**: escolhe em quais **unidades** joga (`Ofensiva`, `Defesa` ou `Ambas`) e suas **posições** (uma ou mais), entrando direto na **Home**.
- Se **staff**: escolhe seu **subpapel** (`Head coach`, `Coordenador ofensivo`, `Coordenador defensivo` e/ou `Coordenador de special teams`) e permanece no estado **pendente** até que um **head coach** aprove seu acesso.

Histórias do spec atendidas: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `11`, `12`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Tela de Entrada / Boas-vindas]
   ├─ Já tem conta? ──► [Entrar com Google OAuth] OU [Digitar E-mail -> Código de 6 dígitos] ──► [Sessão Ativa (Cookie httpOnly)]
   │
   └─ Primeiro acesso no time:
        │
        ▼
[Passo 1: Código do Time + Identidade]
   - Campo: Código do time (ex.: NAVIGATORS-2026)
   - Campo: Nome completo
   - Escolha de autenticação:
       (A) Continuar com Google (1 toque)
       (B) Informar e-mail -> Receber código de verificação de uso único
        │
        ▼
[Passo 2: Confirmação do E-mail (apenas caminho B)]
   - Campo numérico de 6 dígitos (inputmode="numeric", autocomplete="one-time-code")
   - Botão "Reenviar código" com cooldown de 30s
        │
        ▼
[Passo 3: Escolha de Papel ("Como você participa do time?")]
   │
   ├──► Opção A: JOGADOR ("Jogo em campo, consulto o playbook e respondo a eventos")
   │       │
   │       ▼
   │    [Passo 3A: Unidades e Posições]
   │       - Escolha de Unidade: ( ) Ofensiva  ( ) Defesa  ( ) Ambas (Ofensiva e Defesa)
   │         (Nota: Special teams é incluída automaticamente para todo o time)
   │       - Escolha de Posições (múltipla escolha, min. 1):
   │         Ex.: [✓ WR] [✓ KR]
   │       - Nota tranquilizadora: "Você poderá corrigir suas posições depois no Perfil."
   │       │
   │       ▼
   │    [Destino: HOME (Estado Ativo — acesso imediato ao Playbook da sua unidade e Eventos)]
   │
   └──► Opção B: STAFF ("Faço parte do staff técnico, edito playbook, eventos ou elenco")
           │
           ▼
        [Passo 3B: Escolha de Subpapel]
           - Subpapel principal:
             ( ) Head coach
             ( ) Coordenador ofensivo
             ( ) Coordenador defensivo
           - Checkbox aditivo:
             [ ] Acumulo também o subpapel de Coordenador de special teams
           - Aviso de segurança (ADR-0005):
             "Para proteger os dados de saúde, justificativas e sigilo do playbook,
              cadastros de staff ficam pendentes até aprovação de um Head coach."
           │
           ▼
        [Destino: TELA DE CADASTRO PENDENTE (Aguardando aprovação do Head Coach)]
```

---

## 3. Regras de Interface, Validação e Acessibilidade

1. **Prevenção de erro no Código do Time**:
   - Campo com `autocapitalize="characters"`, `spellcheck="false"` e `font-family: var(--font-mono)`.
   - Se o código do time for inválido: estado `aria-invalid="true"`, borda `#FB7185` e mensagem `"Código do time não reconhecido. Peça o código atualizado ao staff do seu time."`
2. **Código de Verificação por E-mail**:
   - `inputmode="numeric"` e `autocomplete="one-time-code"` para preenchimento automático a partir do teclado do iOS/Android.
   - Se o código estiver expirado ou incorreto: exibe `"Código inválido ou expirado. Solicite um novo código abaixo."` sem limpar o e-mail digitado.
3. **Escolha Múltipla de Posições (Histórias 4, 5, 6)**:
   - As posições disponíveis são filtradas ou agrupadas conforme a(s) unidade(s) marcada(s), mantendo sempre visíveis as posições de `Special teams` (`K`, `P`, `LS`, `KR/PR`, `Gunner`).
   - Se o jogador já havia sido pré-cadastrado no elenco pelo staff (história 77), o backend vincula a conta pelo e-mail/identificador e pré-preenche as posições registradas pelo staff para simples confirmação.
4. **Sessão Persistente e Logout (Histórias 11, 12)**:
   - O login mantém a sessão entre visitas via cookie `httpOnly` com expiração deslizante, evitando autenticar antes de cada treino.
   - Em aparelho compartilhado, o botão `"Sair da conta"` no **Perfil** encerra a sessão imediatamente e retorna à tela de entrada.
