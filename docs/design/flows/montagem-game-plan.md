# Fluxo 4: Montagem de Game Plan pelo Staff e Consulta pelo Jogador (`docs/design/flows/montagem-game-plan.md`)

## 1. Visão Geral

Permite que o **staff** monte o **game plan** de um **jogo** selecionando **jogadas** ativas diretamente do **playbook** por referência (sem duplicar conteúdo — ADR-0004), ordene a sequência de chamadas e escreva uma **nota** específica por jogada para aquele confronto. Qualquer atualização posterior em uma jogada no playbook reflete automaticamente no game plan. O **jogador** consulta o game plan do próximo jogo na tela **Jogo** antes de entrar em campo.

Histórias do spec atendidas: `60`, `61`, `62`, `63`, `64`, `65`, `66`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Tela Jogo (Ex.: vs. Tritões FA) — Aba "Game Plan"]
        │
        ├──► Fluxo A: STAFF MONTA E EDITA O GAME PLAN
        │       │
        │       ▼
        │    [1. Adicionar Jogada por Referência (História 62)]
        │       - Staff toca em "+ Escolher jogada do playbook"
        │       - Abre gaveta/catálogo filtrável por Unidade, Formação e Situação
        │       - Staff seleciona as jogadas desejadas (ex.: "Flood Right Z-Post", "Inside Zone Split", "Nickel Blitz A-Gap")
        │       - Cada jogada entra como um game_plan_item referenciando play.id (ADR-0004)
        │       │
        │       ▼
        │    [2. Ordenar Sequência de Chamadas (História 63)]
        │       - Cada item exibe seu número de ordem (#01, #02, #03...)
        │       - Botões acessíveis de 44×44px [↑ Subir] e [↓ Descer] reordenam a sequência
        │       - Leitor de tela anuncia a nova posição ("Inside Zone Split movida para #01")
        │       │
        │       ▼
        │    [3. Escrever Nota do Confronto por Jogada (História 64)]
        │       - Em cada item do game plan, o staff preenche o campo "Nota para este confronto":
        │         Ex.: "Contra Tritões: DE #91 fecha agressivo por dentro; QB manter leitura de pull se DE encurtar."
        │       - Salva nota no game_plan_item sem alterar a jogada base no playbook
        │       │
        │       ▼
        │    [4. Sincronização Automática por Referência (História 65 / ADR-0004)]
        │       - Se o coordenador corrigir uma atribuição da jogada "Flood Right Z-Post" na tela Playbook (v2 -> v3),
        │         o item #01 do Game Plan passa a exibir automaticamente a versão v3 atualizada,
        │         preservando a nota do confronto e a ordem da chamada.
        │
        └──► Fluxo B: JOGADOR CONSULTA O GAME PLAN (História 66)
                │
                ▼
             [Jogador abre a Tela Jogo -> Aba "Game Plan"]
                - Vê a sequência ordenada de chamadas (#01, #02, #03...) visíveis para sua unidade + Special teams
                - Lê a nota tática escrita pelo staff para aquele adversário
                - Toca na jogada para abrir todas as atribuições por posição e a imagem anexada
```

---

## 3. Cruzamento com Disponibilidade e Status do Elenco (Histórias 60, 61)

Enquanto monta o **game plan** na tela **Jogo**, o staff tem ao lado (no desktop) ou na aba adjacente (no mobile) a **disponibilidade consolidada** do jogo cruzada com o **status do elenco**:
- Se uma posição crítica tiver um jogador com status do elenco `lesionado` ou `reformado`, ou com **marcação** `Não vou`, o painel exibe o alerta lado a lado para orientar quais formações e jogadas incluir no game plan.
