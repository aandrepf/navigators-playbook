# Livro de 6 nov + diagramas (8 nov 2026)
Fonte: PDF Playmaker X “CRUSADERS”, 6 nov 2026, 21 páginas, 40 jogadas — sha256 4639f22c3da28cb0ccdb6816be52261697361934c170bf4b860389f023704b71.
Base: zip revisto sha256 35857bdb… (livro de 3 nov, 42 jogadas).

## Numeração (pela chamada, nunca por índice)
- Iguais/renumeradas (33): 1→1, 2→2, 3→5, 5→4, 6→6, 7→9, 8→7, 9→10, 11–17 iguais, 18→18*, 19→21, 20→22, 21→23, 22→24,
  23→25, 24→26, 25→29, 26→30, 27→27, 28→28 (sem “Copy”), 33→31 (chamada reordenada; Z com MOR), 34→32, 35→33*, 36→34,
  37→35, 38→36, 39→37, 40→38, 41→39, 42→40.
- Alteradas (*), tarefas afectadas “Por validar”: 3 (era 4: DIVE→DUO; OL e restantes marcadas), 18 (Z-fly-Wide→Z-WORM; “QB: BEWARE! W is Unblocked”), 33 (era 35: “F-HORNET 8”→“X-NASTY-DINO F-HORNET”; “H: READ M -> S”).
- Novas, só chamada + texto do diagrama, tarefas por validar: 8 Trey F-JET Fk-Z-TUNNEL 40 DUO (DRAW); 19 I-Big LEFT BOB FK-45 POWER 4 8 9 H-FLAT; 20 Trips Bunch PISTOL LEX FK-43-DIVE X-SHALLOW 84 F-WHEEL.
- Saem: 10 (DIVE Y-SPILL), 29 (SWIRL), 30 (DRAGON), 31 (DINO 4 9), 32 (SMASH BOW). Secções DRAGON/SMASH/SWITCH retiradas; DIVE fica só como regra.
- Índice, matriz (40 linhas), “A minha posição”, Ir para nº (1 a 40), regras REX/LEX/BOB, coverages, questões e “O que mudou” actualizados.

## Diagramas + janela ampliada
- public/diagramas/jogada-01..40.webp recortados do PDF de 6 nov (200 dpi, 1634×1148, 31–50 KB), cabeçalho verificado um a um.
- src/components/PlayDiagram.tsx: miniatura-botão lazy por variante + <dialog> modal (título nº+chamada, alt, Escape, Fechar, fundo, foco preso/devolvido, Ver tamanho real, Abrir imagem, pinch-zoom).
- tools/crop-diagramas-auto.py + crusaders-headers.txt + slot-map-auto.json para refazer os recortes.
