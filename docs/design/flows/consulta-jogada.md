# Fluxo 3: Consulta e Estudo de Jogada no Playbook (`docs/design/flows/consulta-jogada.md`)

## 1. Visão Geral

Descreve como o **jogador** descobre que uma **jogada** visível para ele foi criada ou atualizada, localiza a jogada por **unidade**, busca textual ou filtros de **formação** e **situação**, estuda todas as **atribuições** por **posição** e a imagem anexada pelo coach, e marca que estudou a jogada (`play_read`) para remover o **selo de novidade**.

Histórias do spec atendidas: `34`, `35`, `36`, `37`, `38`, `39`, `40`, `67`.

---

## 2. Diagrama do Fluxo Passo a Passo

```text
[Gatilho: Push "Jogada atualizada no seu playbook" OU Bloco "Novidades do Playbook" na Home]
        │
        ▼
[Tela Playbook — Lista Agrupada por Unidade]
   - Jogador vê apenas jogadas dentro da sua visibilidade:
     • Sua(s) unidade(s) de atuação (Ofensiva e/ou Defesa)
     • Jogadas de outra unidade liberadas especificamente pelo staff (ADR-0006)
     • Todas as jogadas de Special teams (aberta a todo o time — ADR-0006)
   - Jogadas com versão atual > último play_read do jogador exibem o selo [★ NOVO • v3]
        │
        ├──► Atalho de Descoberta (Reunião ou Beira de Campo):
        │       - Busca por nome: digita "Flood" ou "Mesh" (História 38)
        │       - Filtra por Formação: ex. "Shotgun Trips Right" (História 39)
        │       - Filtra por Situação (down e distância): ex. "3rd & 6-10" (História 39)
        │       - Filtra por "★ Apenas novidades" (História 36)
        │
        ▼
[Jogador seleciona a Jogada "Flood Right Z-Post (v3)"]
        │
        ▼
[Detalhe da Jogada]
   1. Cabeçalho Tático:
      - Nome, Unidade (Ofensiva), Formação (Shotgun Trips Right), Situação (3rd & Médio), Versão (v3)
   2. Imagem da Jogada (quando anexada pelo coach — História 40):
      - Visualização nítida do desenho; toque em "Ampliar imagem" abre em tela cheia com zoom
   3. Lista Completa de Atribuições por Posição (História 35):
      - Exibe TODAS as posições da jogada para que o jogador entenda o conceito completo:
        • WR-Z [SUA POSIÇÃO]: "Rota Post profunda (18–20 jardas) atacando o terço médio contra Cover 3."
        • WR-X [SUA POSIÇÃO]: "Rota Dig em 12 jardas no lado oposto para segurar o safety de lado fraco."
        • Slot-Y: "Rota Out intermediária em 10–12 jardas rumo à sideline direita."
        • RB: "Check & release para o Flat direito (4 jardas) após leitura de blitz do MLB."
        • QB: "Drop de 5 passos; leitura alta-baixa na lateral direita (Z-Post -> Y-Out -> RB-Flat)."
        • OL: "Proteção Slide Left com RB responsável pelo LB externo direito."
        │
        ▼
[Jogador toca em "✓ Marcar que estudei esta jogada (v3)" — História 37]
   - Grava play_read na versão atual (v3)
   - Selo [★ NOVO] desaparece da jogada
   - Se o staff publicar depois uma versão v4, o selo [★ NOVO • v4] voltará a aparecer automaticamente
```

---

## 3. Comportamento de Visibilidade e Edição Concorrente

1. **Marcação de Estudo Intencional (`play_read`)**:
   - Abrir a jogada rapidamente não remove o selo por acidente se o jogador ainda quiser voltar a ela; o botão `"✓ Marcar como estudada"` dá controle explícito ao jogador para fazer o selo sumir quando ele quiser (história 37).
2. **Reflexo de Edição (Histórias 23, 36)**:
   - Quando o coordenador da unidade ou o head coach edita qualquer atribuição, formação, situação ou imagem da jogada, uma nova revisão (`play_revision`) é gerada, incrementando a versão e reativando o selo de novidade para todos os jogadores que têm visibilidade sobre aquela jogada.
