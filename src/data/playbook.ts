/**
 * Dados do livro final (40 jogadas, PDF CRUSADERS de 6 nov 2026) — Ataque Navigators, jogo de domingo, 8 nov.
 * Data do jogo confirmada pelo André (4 nov 2026): domingo, 8 de novembro.
 * Livro: PDF Playmaker X de 3 nov 2026 (22 páginas, só diagramas). As fichas estão
 * em generated-plays.ts (leitura dos diagramas + regras do playbook ofensivo).
 * O que é leitura, e não texto do diagrama nem do playbook, está marcado como análise.
 */
import type {
  ChecklistItem, Gap, KeyValue, PlayGroup, Position,
  Question, Section, SharedRule, Shell, CollapsedPlay, RouteTreeRow, Motion,
} from './types';
export { PLAY_DETAILS, POSITION_TASKS, MATRIX, MATRIX_GRADES, CHANGES } from './generated-plays';

export const META = {
  team: 'Ataque Navigators',
  shortTitle: 'Domingo, 8 nov · livro final',
  title: 'Ataque Navigators · Jogo de domingo, 8 nov: livro final',
  intro:
    'As 40 jogadas do livro final, por grupo: corridas inside e outside, play action, boot e passes por conceito. As versões Esquerda/Direita estão juntas no mesmo cartão. Escolha a sua posição em cima.',
  termsNote:
    'Termos em inglês, como no playbook. O que não vem do livro nem do playbook está marcado como análise.',
};

export const SECTIONS: Section[] = [
  { id: 'indice', label: 'Índice' },
  { id: 'posicao', label: 'A minha posição' },
  { id: 'frentes', label: 'Frentes' },
  { id: 'coverages', label: 'Coverages' },
  { id: 'matriz', label: 'Matriz' },
  { id: 'inside', label: 'Corridas Inside' },
  { id: 'outside', label: 'Corridas Outside' },
  { id: 'pa', label: 'Play action' },
  { id: 'boot', label: 'Boot' },
  { id: 'passes', label: 'Passes por conceito' },
  { id: 'especiais', label: 'Especiais' },
  { id: 'rotas', label: 'Rotas e motions' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'mudou', label: 'O que mudou' },
  { id: 'questoes', label: 'Questões em aberto' },
];

// ───────────────────────── Índice ─────────────────────────
export const PLAY_GROUPS: PlayGroup[] = [
 {
  "id": "inside",
  "title": "Corridas Inside",
  "pairs": [
   {
    "id": "iso",
    "name": "ISO",
    "subtitle": "1 Esquerda · 6 Direita",
    "tags": [
     "ISO"
    ],
    "plays": [
     {
      "n": 1,
      "side": "Esq",
      "call": "I-Base Z-FLY 43-ISO Z-POP-ALERT"
     },
     {
      "n": 6,
      "side": "Dir",
      "call": "ACE Pistol F-BEE 40-ISO"
     }
    ]
   },
   {
    "id": "power",
    "name": "POWER",
    "subtitle": "4 Esquerda · 9 Direita",
    "tags": [
     "Power",
     "Power Lead"
    ],
    "plays": [
     {
      "n": 4,
      "side": "Esq",
      "call": "Trips Tight 43 POWER"
     },
     {
      "n": 9,
      "side": "Dir",
      "call": "Pro-Gun Z-FLY 44-POWER LG-LEAD Z-POP-OPTION"
     }
    ]
   },
   {
    "id": "duo",
    "name": "DUO",
    "subtitle": "2 e 3 Esquerda · 7 e 8 Direita",
    "tags": [
     "DUO"
    ],
    "plays": [
     {
      "n": 2,
      "side": "Esq",
      "call": "ACE Gun 41 DUO"
     },
     {
      "n": 3,
      "side": "Esq",
      "call": "Troop 43 DUO X-SPILL"
     },
     {
      "n": 7,
      "side": "Dir",
      "call": "Trey Wing 40-DUO F-SPILL"
     },
     {
      "n": 8,
      "side": "Dir",
      "call": "Trey F-JET Fk-Z-TUNNEL 40 DUO (DRAW)"
     }
    ]
   },
   {
    "id": "counter",
    "name": "COUNTER",
    "subtitle": "5 Esquerda · 10 Direita",
    "tags": [
     "GY Counter (5)",
     "Counter single pull (10)"
    ],
    "plays": [
     {
      "n": 5,
      "side": "Esq",
      "call": "I-Base 43-GY-COUNTER"
     },
     {
      "n": 10,
      "side": "Dir",
      "call": "Pro-Gun Close 32 X-COUNTER"
     }
    ]
   }
  ]
 },
 {
  "id": "outside",
  "title": "Corridas Outside",
  "pairs": [
   {
    "id": "toss",
    "name": "TOSS / Sprint option",
    "subtitle": "11 Esq · 13 Dir · 14 Dir. + Sprint esq.",
    "tags": [
     "Toss",
     "Pin Toss (13)",
     "Sprint option (14)"
    ],
    "plays": [
     {
      "n": 11,
      "side": "Esq",
      "call": "I-Twins RIGHT Z-JET 49-TOSS LG-PULL"
     },
     {
      "n": 13,
      "side": "Dir",
      "call": "I-Big 46 PIN TOSS"
     },
     {
      "n": 14,
      "side": "Dir",
      "call": "Trips F-INSERT 48-TOSS 19-SPRINT-OPT LG-LEAD X-SEAL"
     }
    ]
   },
   {
    "id": "reverse",
    "name": "Reverse",
    "subtitle": "12 Esquerda · 24 Direita",
    "tags": [
     "Reverse (12)",
     "Tunnel Reverse (24)"
    ],
    "plays": [
     {
      "n": 12,
      "side": "Esq",
      "call": "Pro-Gun Twins RIGHT FK-42-RUN Z-REVERSE C-LEAD (POP-ALERT)"
     },
     {
      "n": 24,
      "side": "Dir",
      "call": "Spread F-INSERT Z-TUNNEL H-REVERSE"
     }
    ]
   }
  ]
 },
 {
  "id": "pa",
  "title": "Play action",
  "pairs": [
   {
    "id": "pa-power",
    "name": "Play action Power",
    "subtitle": "15 Esquerda · 18 Direita · 19 Esquerda",
    "tags": [
     "Fake Power",
     "Drag",
     "Flat (18 com SHIV)"
    ],
    "plays": [
     {
      "n": 15,
      "side": "Esq",
      "call": "Pro-Gun Y-TANGO RIFT Z-HORNET FK-43 POWER 82 DRAG F-FLAT"
     },
     {
      "n": 18,
      "side": "Dir",
      "call": "I-Twins Z-WORM FK 42-POWER DRAG SHIV F-FLAT"
     },
     {
      "n": 19,
      "side": "Esq",
      "call": "I-Big LEFT BOB FK-45 POWER 4 8 9 H-FLAT"
     }
    ]
   },
   {
    "id": "pa-counter",
    "name": "Play action Counter / Run",
    "subtitle": "17 Esquerda · 16 Direita",
    "tags": [
     "SHIV + Dig (17)",
     "Sluggo + Glance (16)"
    ],
    "plays": [
     {
      "n": 17,
      "side": "Esq",
      "call": "Pro-Gun Twins LIFT FK-32 X-COUNTER SHIV DIG H-FLAT"
     },
     {
      "n": 16,
      "side": "Dir",
      "call": "ACE Pistol BOB F-BEE-OUT FK-42 SLUGGO GLANCE Y-SLANT H-SNEAK"
     }
    ]
   },
   {
    "id": "pa-dive",
    "name": "Play action Dive",
    "subtitle": "20 Esquerda",
    "tags": [
     "Fake Dive (por validar)"
    ],
    "plays": [
     {
      "n": 20,
      "side": "Esq",
      "call": "Trips Bunch PISTOL LEX FK-43-DIVE X-SHALLOW 84 F-WHEEL"
     }
    ]
   }
  ]
 },
 {
  "id": "boot",
  "title": "Boot",
  "pairs": [
   {
    "id": "boot",
    "name": "Boot",
    "subtitle": "21 Esquerda · 22 Direita",
    "tags": [
     "Boot"
    ],
    "plays": [
     {
      "n": 21,
      "side": "Esq",
      "call": "Trips Tight LEFT REX 41-BOOT-LEFT 2 1 5 9"
     },
     {
      "n": 22,
      "side": "Dir",
      "call": "Trips Tight ROCK 43-BOOT-R GO 9 5 F-FLAT H-STAB"
     }
    ]
   }
  ]
 },
 {
  "id": "passes",
  "title": "Passes por conceito",
  "pairs": [
   {
    "id": "stick",
    "name": "STICK",
    "subtitle": "29 Esquerda · 30 Direita",
    "tags": [
     "STICK"
    ],
    "plays": [
     {
      "n": 29,
      "side": "Esq",
      "call": "Trio LEX F-STICK Z-WHIP Y-STAB"
     },
     {
      "n": 30,
      "side": "Dir",
      "call": "Trey BOB Y-Stick X-TAG"
     }
    ]
   },
   {
    "id": "lion",
    "name": "LION",
    "subtitle": "27 LION esq. · 28 LION dir.",
    "tags": [
     "LION"
    ],
    "plays": [
     {
      "n": 27,
      "side": "Esq",
      "call": "ACE Pistol REX H-ZIP-WHEEL LION SNAG"
     },
     {
      "n": 28,
      "side": "Dir",
      "call": "Trips BOB F-JET-FLAT 2 LION H-WHEEL"
     }
    ]
   },
   {
    "id": "snag",
    "name": "SNAG",
    "subtitle": "27 SNAG dir.",
    "tags": [
     "SNAG"
    ],
    "plays": [
     {
      "n": 27,
      "side": "Dir",
      "call": "ACE Pistol REX H-ZIP-WHEEL LION SNAG"
     }
    ]
   },
   {
    "id": "shiv",
    "name": "SHIV",
    "subtitle": "31 Esquerda · 32 Direita",
    "tags": [
     "SHIV"
    ],
    "plays": [
     {
      "n": 31,
      "side": "Esq",
      "call": "Trips LEFT LEX X-NASTY FADE ZF-SHIV Y6"
     },
     {
      "n": 32,
      "side": "Dir",
      "call": "ACE Pistol LEX F-FLY-SQUARE SLICE GO Y6"
     }
    ]
   },
   {
    "id": "mesh",
    "name": "MESH",
    "subtitle": "33 Trips Left · 34 Spread · 39 Sprint-out dir.",
    "tags": [
     "MESH"
    ],
    "plays": [
     {
      "n": 33,
      "side": "Esq",
      "call": "Trips LEFT REX X-NASTY-DINO F-HORNET ZF-MESH Y-SLANT"
     },
     {
      "n": 34,
      "side": null,
      "call": "Spread LEX 4 Z-LASH YF-MESH"
     },
     {
      "n": 39,
      "side": "Dir",
      "call": "ACE Gun LEFT ROCK SPRINT-OUT LASH DIG FY-MESH H-FLAT"
     }
    ]
   },
   {
    "id": "dagger",
    "name": "DAGGER / SEAMS",
    "subtitle": "35 · 36",
    "tags": [
     "SEAMS (35)",
     "DAGGER (36)"
    ],
    "plays": [
     {
      "n": 35,
      "side": null,
      "call": "ACE Gun REX 4 DRAG DOUBLE SEAMS"
     },
     {
      "n": 36,
      "side": null,
      "call": "Trey BOB DRAG FZ-DAGGER Y-SQUARE"
     }
    ]
   },
   {
    "id": "rota",
    "name": "Chamadas por rota",
    "subtitle": "40 Esquerda",
    "tags": [
     "FLOW / DART"
    ],
    "plays": [
     {
      "n": 40,
      "side": "Esq",
      "call": "ACE Gun BOB FLOW DART Y-2 F-LASH H-CREASE"
     }
    ]
   }
  ]
 },
 {
  "id": "especiais",
  "title": "Especiais: tunnel, lateral, 2 pontos",
  "pairs": [
   {
    "id": "tunnel",
    "name": "Tunnel e lateral",
    "subtitle": "23 · 25 · 26 · 37",
    "tags": [
     "Tunnel",
     "Lateral"
    ],
    "plays": [
     {
      "n": 23,
      "side": null,
      "call": "Trio X-TUNNEL"
     },
     {
      "n": 25,
      "side": null,
      "call": "Trio Bunch X-TUNNEL"
     },
     {
      "n": 26,
      "side": null,
      "call": "Spread FREE SLOT LATERAL G-PULL"
     },
     {
      "n": 37,
      "side": null,
      "call": "Trio Bunch FAKE-Z-TUNNEL"
     }
    ]
   },
   {
    "id": "dois-pontos",
    "name": "2 pontos: Fake Wedge",
    "subtitle": "38 · Meio",
    "tags": [
     "2 pontos"
    ],
    "plays": [
     {
      "n": 38,
      "side": "Meio",
      "call": "* FAKE Wedge"
     }
    ]
   }
  ]
 }
];

/** Chamada de cada número (primeira ocorrência no índice). */
export const CALL_BY_NUMBER: Record<number, string> = (() => {
  const map: Record<number, string> = {};
  for (const g of PLAY_GROUPS) for (const p of g.pairs) for (const play of p.plays) {
    if (!(play.n in map)) map[play.n] = play.call;
  }
  return map;
})();

/** Regras de protecção partilhadas (lista do C). */
export const SHARED_RULES: Partial<Record<Position, SharedRule[]>> = {
  C: [
    { key: 'REX', plays: [27, 33, 35], text: 'REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.' },
    { key: 'LEX', plays: [31, 32, 34], text: 'LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.' },
    { key: 'BOB', plays: [28, 36, 40], text: 'BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).' },
    { key: '—', plays: [23, 25], text: 'Sem bloqueio desenhado.' },
  ],
};

// ───────────────────────── Frentes ─────────────────────────
export const FRONTS = ['4-3', '3-4', 'Over', 'Under'] as const;
export type Front = (typeof FRONTS)[number];

export const FRONT_DETAILS: Partial<Record<Front, KeyValue[]>> = {
  '4-3': [
    { k: 'Frente', v: '4-3 (even): 4 DL e 3 LB (playbook).' },
    { k: 'Como alinha', v: '4 DL e 3 LB (playbook). Nos diagramas do livro: E N T E na linha, W M S atrás.' },
    { k: 'OL e C identificam', v: 'Declarar o Mike: por defeito o MLB; com dois ILB, o ILB do lado strong. O C conta a partir do Mike (0): +1, +2… para o lado do slide (ou strong em BOB), −1, −2… para o outro lado; os DL não entram na conta. Cada OL vê se está covered ou uncovered (playbook).' },
    { k: 'Protecção', v: 'BOB: a OL fica com os 4 DL + o Mike; os backs com os LB que sobram ou quem blitzar. O RB faz scan de dentro para fora do lado oposto (−1, −2) (playbook).' },
    { k: 'Double team / 2.º nível', v: 'Uncovered: double com o colega do playside e depois climb ao LB (playbook).' },
    { k: 'Corridas que o playbook recomenda', v: 'Frentes even: POWER (4-2 ou 4-3), STRETCH, TRAP (DL de dentro agressivos). DIVE é base vs 4-2 (playbook).' },
    { k: 'No livro', v: 'ISO (1, 6), DUO (2, 3, 7, 8), Counter (5, 10) e Power (4, 9) estão desenhados contra 4-3 (livro de 3 nov; 3 e 8 por validar).' },
  ],
  '3-4': [
    { k: 'Frente', v: '3-4 (odd): 3 DL e 4 LB (playbook).' },
    { k: 'Mike', v: 'Com dois ILB, o Mike é o ILB do lado strong (playbook).' },
    { k: 'Protecção', v: 'BOB: a OL fica com os 3 DL + os ILB (as ameaças mais imediatas nos gaps A/B: o Mike e o outro ILB); os backs com os OLB ou ameaças atrasadas (playbook).' },
    { k: 'Cuidado', v: 'Manter o Mike no ILB strong cria overload do lado strong se o 0 e o +1 vierem. Ajustes do playbook: mudar o Mike; juntar H-Check (6 em protecção); mudar o Mike + H-Check; ou passar a Slide Lock. O QB reage ao −1 e ao +2 com HOT (playbook).' },
    { k: 'Caso raro', v: 'Só 3 DL e 1 ILB: mudar a chamada para corrida; o C (ou o QB) identifica quem pode ser o 5.º rusher (playbook).' },
    { k: 'Corridas que o playbook recomenda', v: 'DIVE (base vs 3-4), TOSS (vs 3-4 com os OLB apertados), Pin & Pull: Pin Toss, Pin Sweep (vs frentes odd) (playbook).' },
  ],
  Over: [
    { k: 'Frente', v: 'Over: DL deslocada para o lado strong da formação. É uma frente even (4 DL) (playbook).' },
    { k: 'Protecção', v: 'Como qualquer frente de 4: a OL fica com os 4 DL + o Mike; os backs com os outros LB (playbook).' },
    { k: 'Nos exemplos do playbook', v: 'Os desenhos de corrida do playbook são contra Over: 43-ISO (4-3 Over), I-BASE 44 POWER, PRO-GUN 34 POWER LEAD, os 4 Counters e TRIPS BUNCH 40 TRAP. A protecção BOB também é mostrada vs 4-2 Over (playbook).' },
    { k: 'Corridas que o playbook recomenda', v: 'As de frente even: POWER, STRETCH, TRAP (playbook).' },
  ],
  Under: [
    { k: 'Frente', v: 'Under: DL deslocada para o lado weak da formação. É uma frente even (4 DL) (playbook).' },
    { k: 'Protecção', v: 'Como qualquer frente de 4: a OL fica com os 4 DL + o Mike; os backs com os outros LB (playbook).' },
    { k: 'Corridas que o playbook recomenda', v: 'As de frente even: POWER, STRETCH, TRAP (playbook). O playbook não tem nenhum desenho contra Under.' },
  ],
};

/**
 * Letras e técnicas: definições do playbook. A ligação gap ↔ técnica é pela definição
 * (1-tech fica entre C e G = A gap, etc.); o playbook não as põe na mesma tabela.
 */
export const GAPS: Gap[] = [
  { numbers: '0 / 1', letter: 'A', where: 'Entre C e G (0 à direita, 1 à esquerda)', technique: '1-tech: head up no ombro do C (shade) ou entre C e G' },
  { numbers: '2 / 3', letter: 'B', where: 'Entre G e T', technique: '3-tech: head up no ombro de fora do G' },
  { numbers: '4 / 5', letter: 'C', where: 'Por fora do T', technique: '5-tech: head up no ombro de fora do T' },
  { numbers: '6 / 7', letter: 'D', where: 'Por fora do TE (ou do T se não houver TE). Um run pelo 7 vai logo por fora do TE, não tão largo como o 9', technique: '7-tech: shade de fora do TE · 9-tech: bem por fora do TE, muitas vezes o contain' },
  { numbers: '8 / 9', letter: '—', where: 'Flats', technique: '—' },
];

export const FRONT_NOTES: string[] = [
  'Gaps pares à direita do C (a começar no 0), ímpares à esquerda (playbook).',
  'Covered: há um defensor entre a sua cara e o ombro de dentro do colega do playside; o último homem do playside está covered com um defensor head-up ou por fora. Bloqueie o seu homem (playbook).',
  'Uncovered: ajude o colega do playside no double e depois climb ao LB (playbook).',
  'Half Slide (LEX/REX) ajuda contra movimento; Slide Lock (LOCK/ROCK) é bom contra stunts, twists e overloads; Full Slide (LIFT/RIFT) é bom quando os DE fazem contain do backside (playbook).',
  'Pressão que preparamos: Double A-gap, overloads e creepers (playbook).',
  'Bear (5 DL): a OL fica com os 5 DL; o Mike passa a ser do back; extra rusher = HOT (playbook).',
  'Se a defesa trouxer mais um do que bloqueamos, lança HOT. O RB bloqueia se o homem dele vier (playbook).',
  'Frentes que as protecções preparam: even (Over, Under, Wide-9), odd (Mint, Bear e outras stacked) e pressão (Double A-gap, overloads, creepers) (playbook).',
  'Audibles: DAY (Half Slide para o lado strong), NIGHT (Half Slide para o lado weak), BOBBY (passa a BOB), JOKER (troca o slide para o outro lado), FAN (o tackle abre para um blitzer de fora), TOM (o RB lê os LB do lado oposto), ABBA (o RB foca a pressão de dentro), SCAT (o RB sai já para a rota), SQUEEZE (ajuste do slide; também pré-snap vs twists de dentro), LOCK/ROCK e LIFT/RIFT (playbook).',
  'SQUEEZE: quem no slide tem de pegar num looper avisa “Squeeze! Squeeze!”; o de dentro fecha o gap de dentro, ombros paralelos à LOS. Último homem do slide: se o seu homem cruza a cara, continua a ser seu (playbook).',
  'HOT: SASHA = X, LIZZIE = Z, DAISY = Y, FAYE = F, HOLLY = H. Slot/#2 = HOT vs blitz de dentro/nickel; WR de fora = HOT se o C blitzar; TE/Wing = HOT vs pressão do safety ou OLB no edge (playbook).',
  'Huddle: o C monta sempre o huddle a 6 jardas da bola. Se não ouvir a chamada: “DEAF”. Sai-se com “Ready-Break” (playbook).',
];

// ───────────────────────── Coverages ─────────────────────────
export const SHELLS: Shell[] = [
  { shell: 'MOFC', covers: 'Cover 1, Cover 3', read: 'Um safety alto no meio (single high).' },
  { shell: 'MOFO', covers: 'Cover 2, Cover 4', read: 'Meio aberto: dois safeties (split safeties).' },
  { shell: 'Sem safety', covers: 'Cover 0', read: 'Man, ninguém fundo.' },
];

export const COVERS = ['C0', 'C1', 'C2', 'C3', 'C4'] as const;

export const COVER_DETAILS: Partial<Record<(typeof COVERS)[number], KeyValue[]>> = {
  C2: [
    { k: 'O que é', v: 'Cover 2: zona com 2 safeties fundos e os C nas flats, MOFO (playbook).' },
    { k: 'Como reconhecer', v: 'Dois safeties fundos, C baixos e por fora (análise).' },
    { k: 'Melhor do livro', v: 'SNAG (27), DAGGER (36), STICK (29, 30), Flood: 21, 22 (playbook). Corrida: ISO (1, 6). SMASH + BOW, SWITCH e DIVE puro já não estão no livro de 6 nov.' },
    { k: 'Pior do livro', v: 'SHIV sem Flat (31): o S fica com o Go e o C cai no Squat.' },
    { k: 'Ajuste', v: 'Seams entre os safeties (playbook).' },
  ],
  C0: [
    { k: 'O que é', v: 'Cover 0: man-to-man sem nenhum safety fundo (playbook).' },
    { k: 'Como reconhecer', v: 'Ninguém fundo; defensores encostados aos recebedores (análise).' },
    { k: 'Conceitos fortes (playbook)', v: 'LION (27, 28), MESH (33, 34, 39): “strong/excellent vs Cover 1 e Cover 0” (DRAGON e SWITCH também, mas já não estão no livro de 6 nov). LION e STICK (29, 30) são resposta rápida vs blitz.' },
    { k: 'Protecção', v: 'Se vierem mais do que bloqueamos: HOT (SASHA, LIZZIE, DAISY, FAYE, HOLLY). O RB bloqueia se o homem dele vier (playbook).' },
    { k: 'Motions', v: 'Yo-Yo, Scan e Fakey servem para ler man/zona antes do snap (playbook).' },
  ],
  C1: [
    { k: 'O que é', v: 'Cover 1: man-to-man com um safety fundo, MOFC (playbook).' },
    { k: 'Como reconhecer', v: 'Um safety alto no meio (single high) e man por baixo (análise).' },
    { k: 'Conceitos fortes (playbook)', v: 'Man-beaters: DRAGON, LION (27, 28), SWITCH, MESH (33, 34, 39). Também STICK (29, 30), SHIV (31, 32, 17, 18), DRIVE, RAZOR, RICE, YANKEE, HOSS, VERTS e SMASH quando há match-up. DRAGON, SWITCH e SMASH já não estão no livro de 6 nov.' },
    { k: 'Ajuste', v: 'Levels e Post atacam o safety único: MOFC → atacar o Post (playbook).' },
  ],
  C3: [
    { k: 'O que é', v: 'Cover 3: zona com três defensores fundos, MOFC (playbook).' },
    { k: 'Como reconhecer', v: 'Um safety alto e os C a recuar para os terços de fora (análise).' },
    { k: 'Conceitos fortes (playbook)', v: 'SHIV (31, 32, 17, 18), DAGGER (36: o Strike enche o vazio entre zonas), DRIVE, MESH (sólido com Sit e Check), RAZOR, RICE, YANKEE, HOSS e VERTS (os Seams dividem o safety único). SWITCH é eficaz quando o Wheel passa o defensor da flat (já não está no livro de 6 nov).' },
    { k: 'Contra', v: 'SWITCH: o playbook também diz que não é bom vs Cover 3 (o safety fica por cima). As duas frases estão no livro (playbook).' },
  ],
  C4: [
    { k: 'O que é', v: 'Cover 4 (Quarters): zona com quatro defensores fundos, MOFO (playbook).' },
    { k: 'Como reconhecer', v: 'Dois safeties fundos e os C também fundos (análise).' },
    { k: 'Conceitos fortes (playbook)', v: 'SNAG (27), Flood: Boot 21, 22 (Flood é bom vs Cover 2/Quarters). SMASH + BOW já não está no livro de 6 nov. VERTS: só se os Seams dobrarem para dentro entre os safeties.' },
    { k: 'Conceitos fracos (playbook)', v: 'RAZOR, RICE, YANKEE (em teoria) e DAGGER (36): o texto do DAGGER diz “less effective against Cover 4”, mas a linha “Coverage Advantage” diz “Excellent vs Cover 2 and Quarters”.' },
  ],
};

export const MATRIX_INTRO = 'bom / ok / mau. Base: “When is it best” e vantagens de cada conceito no playbook; o resto é análise.';
export const MATRIX_NOTE = 'Nos passes, a frente só muda a protecção, por isso quase tudo fica ok. Contra Cover 0, as corridas ficam mau porque a box fica cheia (análise).';

/**
 * Regras gerais de cada conceito no playbook (complementam as fichas das 40 jogadas).
 */
export const COLLAPSED_PLAYS: Record<string, CollapsedPlay[]> = {
  inside: [
    { title: 'POWER · 4 / 9', playbook: [
      { k: 'O que é', v: 'Esquema “kick” ao C gap (ou ao B se o último OL for o T): down blocks e doubles fazem a parede, o kick-out tira o EMOL. No Power Lead, o G do backside faz pull e wrap pelo C gap ao LB playside (ou MDM).' },
      { k: 'OL', v: 'Block down em quem estiver por dentro. Fechar o double no DL antes do climb ao LB. Doubles violentos e verticais.' },
      { k: 'Kick-out', v: 'FB, TE ou H-back: kick-out ao DE/EMOL, alvo no ombro de dentro, quadrado.' },
      { k: 'RB', v: 'Power Lead: passo lateral, press no double, corte por dentro do puller. Se o kick-out ganha, dentro; se o DE/LB enche por dentro, bounce.' },
      { k: 'Melhor vs', v: 'Frentes even (4-2, 4-3), DE indisciplinados, defesa preocupada com o outside.' },
    ] },
    { title: 'DUO · 2 / 3 / 7 / 8', missing: ' O playbook também não tem secção DUO.', playbook: [
      { k: 'No playbook', v: 'Só no ISO: “a OL pensa em regras Duo (doubles por dentro, climb tarde)”. Não há regras próprias de DUO.' },
    ] },
    { title: 'DIVE · regra do playbook (o 20 finge DIVE; não há DIVE puro no livro de 6 nov)', playbook: [
      { k: 'O que é', v: 'Inside Zone: a linha move-se em lateral, o RB vai vertical no 1.º seam. Normalmente declarado para o A ou B gap.' },
      { k: 'OL', v: 'Passo a 45° para o playside. Covered: base block. Uncovered: combo com o colega do playside até ao 1.º LB da zona. Doubles no N ou no 3-tech, climb quando o mover. Backside: cut off, ninguém cruza a sua cara.' },
      { k: 'RB', v: 'Vai buscar a bola ao QB. Aiming point: perna playside do C (ou do G). Lê o 1.º DL playside do C: selado por dentro → bounce; slant para dentro → bend; bloqueado para fora → bang.' },
      { k: 'Melhor vs', v: 'Boxes apertadas, two-high, defesas a fugir em lateral. Base vs 3-4 e 4-2. Bom para RPO.' },
    ] },
    { title: 'COUNTER · 5 / 10', playbook: [
      { k: 'O que é', v: 'Misdirection de gap: parece Power, a bola vai contra o fluxo inicial. Single Pull (G Counter) e Double Pull (GT/GY Counter).' },
      { k: 'OL', v: 'Playside: block down na ameaça de dentro. Backside que não puxa: passo playside, sem penetração. G do backside: pull flat, kick-out ao EMOL. GY: o Y (ou T no GT) faz wrap por dentro do G e lead ao LB. Single-back GY: o T do backside faz gap hinge.' },
      { k: 'FB / RB', v: 'FB: fake de Power e kick-out ao EMOL do backside. RB: counter step, segue o G e o wrapper, vertical depois da LOS.' },
      { k: 'Melhor vs', v: 'Depois de ISO e POWER; ILB a atacar os gaps cedo; para manter a defesa “honest”.' },
    ] },
  ],
  outside: [
    { title: 'TOSS / Sprint option · 11 / 13 / 14', missing: ' “Sprint option” não está definido no playbook.', playbook: [
      { k: 'TOSS', v: 'Outside Zone com a bola mais larga: o edge tem de ficar selado (reach, down block, FB/TE/G em pull ou WR em crack). Nunca deixar o EMOL penetrar.' },
      { k: 'OL', v: 'Seal ou reach ao EMOL. Doubles de zona: covered bloqueia o seu (se fizer slant backside, passa ao de dentro e climb); uncovered ajuda playside e climb. Backside sela a perseguição.' },
      { k: 'Puller / FB', v: 'Puller: por fora do bloqueio do TE (ou do último OL), lead e ajuda a selar o EMOL ou o ILB. FB: garante o EMOL, bounce e bloqueia o MDM.' },
      { k: 'PIN TOSS (13)', v: 'Pin & Pull: covered no gap do backside → pin para o backside; uncovered → pull flat para o edge, colado à linha, bloqueia a 1.ª ameaça por fora da parede.' },
      { k: 'Melhor vs', v: 'TOSS: defesas a fechar por dentro, edge fraco, 3-4 com OLB apertados. Pin & Pull: frentes odd (3-4), LB lentos a encher o edge.' },
    ] },
    { title: 'Reverse · 12 / 24', playbook: [
      { k: 'O que é', v: 'A bola vai primeiro para um lado (handoff, Toss ou fake) e depois para um WR/Slot no sentido contrário. Também com lateral primeiro (Lateral/Tunnel Reverse): a defesa lê Tunnel e fecha por dentro.' },
      { k: 'OL', v: 'Regras da Sweep/Toss/Pin & Pull de base. Step e seal para o fluxo do fake, depois abrir a parede para o WR.' },
      { k: 'Backs / WR', v: 'Backs: vender o fake, lead ou kick-out para o WR. WR/Slot: recebe o reverse, edge rápido atrás dos lead blocks.' },
      { k: 'Melhor vs', v: 'Defesas a perseguir demais o fluxo inicial; LB ou safeties agressivos. Usar pouco: alto risco se a defesa ler.' },
    ] },
  ],
  pa: [
    { title: 'Play action Power · 15 / 18 / 19', playbook: [
      { k: 'Protecção PA', v: 'Parecer corrida, não ser corrida: a OL sai com agressividade controlada, nunca mais de 3 jardas para lá da LOS. “Protect the pocket! Not the fake.” Quanto se mantém do bloqueio do Power depende do tempo que o passe precisa.' },
      { k: 'Exemplo do playbook', v: 'I-TWINS FK-43 POWER SHIV DRAG F-FLAT (quase a 18, que é FK 42).' },
      { k: '15: RIFT', v: 'Full Slide para a direita: toda a OL desliza junta, sem lado man. Usado em PA, sobretudo com o QB a afastar-se.' },
      { k: 'SHIV (18)', v: 'Interior: Square a 10 jardas; exterior: Go. QB: Go (alert) → Square → Flat. Forte vs Cover 1 e 3; com Flat vira Flood vs Cover 2.' },
    ] },
    { title: 'Play action Counter / Run · 17 / 16', playbook: [
      { k: 'Protecção PA', v: 'Igual à de PA: vender a corrida, ancorar e proteger o QB. “Protect the pocket! Not the fake.” 17 usa LIFT (Full Slide para a esquerda); 16 usa BOB.' },
      { k: 'SHIV + Dig (17)', v: 'SHIV: QB Go (alert) → Square → Flat/Check. Dig: vertical e corte a 90° para dentro.' },
      { k: 'Rotas do 16', v: 'SLUGGO: finta de slant e, 2-3 passos depois, para fora num Go. GLANCE: 7-8 jardas e corte para o post, como um post muito curto. SNEAK, SLANT: rotas do playbook.' },
    ] },
  ],
  boot: [
    { title: 'Boot · 21 / 22', playbook: [
      { k: 'Protecção', v: 'Boot: Slide Lock para o lado da run action; o T do backside faz hinge (ou cut) contra a perseguição. Naked Boot: Full Slide para a run action, sem hinge.' },
      { k: 'QB', v: 'Vender o fake até ao fim e rolar fundo: 8-10 jardas atrás da linha, 4-5 jardas por fora da tackle box.' },
      { k: 'RB', v: 'Vende o fake antes de qualquer outra tarefa.' },
      { k: 'Rotas', v: 'Flood e outros conceitos de sideline: QB lê de cima para baixo (fundo → intermédio → flat).' },
      { k: 'Melhor vs', v: 'Defesa que morde forte na run action. Flood é bom vs two-high e Cover 2/Quarters.' },
    ] },
  ],
  passes: [
    { title: 'STICK · 29 / 30', playbook: [
      { k: 'QB', v: 'Flat → Stick → Go (leitura In–Out no defensor da flat/apex): se ele abre para a flat, Stick; se fica por dentro, Flat. Go é alert. X é alert pré-snap.' },
      { k: 'Coaching points', v: '~5 jardas entre Stick e Flat. TE vira os ombros só um pouco. WR de fora: MOR (Mandatory Outside Release). Stick apertado → speed out.' },
      { k: '30: X-TAG', v: '“TREY Y-STICK X-TAG”: o X faz uma rota chamada pelo QB (exemplo do playbook).' },
      { k: 'Coverages', v: 'Forte vs Cover 2 e Cover 1; resposta rápida vs blitz.' },
    ] },
    { title: 'LION · 27 / 28', playbook: [
      { k: 'O que é', v: 'Double Slant: slant de dentro em 1 passo, slant de fora mais raso (~30°).' },
      { k: 'QB', v: 'Slant de dentro (se abrir, não esperar) → slant de fora (se o LB alinhar ou saltar para dentro) → check down. Bola fora no 3.º passo (1.º do Gun), sem hitch.' },
      { k: 'Coaching points', v: '1-2 jardas de separação vertical entre slants. Interior cruza a cara do defensor; exterior ganha leverage. Ângulo constante, olhos no QB.' },
      { k: 'Coverages', v: 'Forte vs Cover 1 e Cover 0; resposta rápida vs pressão.' },
    ] },
    { title: 'SNAG · 27', playbook: [
      { k: 'QB', v: 'Flat por WR/TE: Flat → Snag → Corner → Check. Flat pelo RB: Snag → Flat → Corner → Check. Lê o defensor da flat: abre → Snag; fica dentro → Flat.' },
      { k: 'Coaching points', v: 'Flat ≈ 2-3, Snag ≈ 5-6, Corner ≈ 10-12 jardas. Snag fica por dentro. Red Zone: 2-3 / 4-5 / 8-10.' },
      { k: 'Coverages', v: 'Excelente vs Cover 2 e Quarters; vs man o Snag passa a Whip.' },
    ] },
    { title: 'SHIV · 31 / 32', playbook: [
      { k: 'QB', v: 'Defesa pré-snap → Go (alert) → Square → Flat/Check. C recua → Square; C fica → Go. Com Flat (Flood), lê o defensor da flat.' },
      { k: 'Coaching points', v: 'Fora: Go/Fade. Dentro: Square a 10 jardas, plano até à sideline. Gun: 3 passos + hitch.' },
      { k: 'Coverages', v: 'Forte vs Cover 1 e 3. Pior vs Cover 2, a não ser que se junte Flat ou Quick-out (Flood).' },
    ] },
    { title: 'MESH · 33 / 34 / 39', missing: ' LASH (34, 39) não está definido no playbook.', playbook: [
      { k: 'O que é', v: 'Dois shallow crossers de lados opostos, com Sit ou Wheel. Quase nunca é a 1.ª leitura.' },
      { k: 'QB', v: 'Defesa pré-snap → 1.ª leitura (Wheel/Go/Corner) → Mesh → Sit/Wheel/Check. Mesh em corrida vs man, Sit vs zona.' },
      { k: 'Coaching points', v: 'Shallow a 4 jardas, por baixo do tráfego; Drag a 5; Sit 6-10. 1-2 jardas de separação entre crossers.' },
      { k: '39: Sprint-out', v: 'O playbook não define sprint-out de passe. O mais perto é o Rollout: sem fake, Full Slide ou Slide Lock para o lado, QB a 6-8 jardas e 2-3 por fora do T.' },
      { k: 'Coverages', v: 'Excelente vs Cover 1 e 0; sólido vs Cover 3.' },
    ] },
    { title: 'DAGGER / SEAMS · 35 / 36', playbook: [
      { k: 'DAGGER', v: 'Seam de dentro limpa o meio; Strike (dig de 12-15) de fora. QB: Seam → Strike → Check; 5 passos ou 3 + hitch do Gun; Strike no ritmo.' },
      { k: 'SEAM', v: 'Vertical pelas hash marks ou entre defensores, feito por recebedores de dentro (Slot, TE).' },
      { k: 'Coverages', v: 'DAGGER: muito bom vs Cover 2 e Cover 3; o texto diz menos eficaz vs Cover 4, a linha Coverage Advantage diz excelente vs Quarters.' },
    ] },
    { title: 'Chamadas por rota · 40', missing: ' DART e CREASE não estão no playbook; FLOW só no glossário (direcção da defesa).', playbook: [
      { k: 'DINO (no 33: X-NASTY-DINO)', v: 'Corner-Post: 10 jardas, corte a 45° para fora como Corner, 2 passos e quebra para o post. Vender o Corner.' },
      { k: 'Números', v: 'Árvore de fora: 0 Hitch, 1 Quick Out, 2 Slant, 3 Stop, 4 Dig, 5 Square, 6 Curl/Hook, 7 Bench, 8 Post, 9 Post-Corner. Árvore de dentro igual, mas 1 Speed Out, 2 Drag, 9 Corner.' },
      { k: 'Ordem', v: 'As rotas da chamada vão na ordem X, Z, Y, F, H, salvo se a chamada disser quem.' },
    ] },
  ],
  especiais: [
    { title: 'Tunnel e lateral · 23 / 25 / 26 / 37', missing: ' O playbook não tem secção de Tunnel.', playbook: [
      { k: 'No playbook', v: 'Só no Lateral (Tunnel) Reverse: a defesa lê Tunnel e fecha por dentro; os bloqueios da OL seguem o desenho da jogada.' },
    ] },
    { title: '2 pontos: Fake Wedge · 38', missing: ' O playbook não fala de Wedge nem de cadência.', playbook: [] },
  ],
};

// ───────────────────────── Rotas e motions (playbook) ─────────────────────────
export const ROUTE_TREE: RouteTreeRow[] = [
  { n: 0, outside: 'Hitch', inside: 'Hitch' }, { n: 1, outside: 'Quick Out', inside: 'Speed Out' },
  { n: 2, outside: 'Slant', inside: 'Drag' }, { n: 3, outside: 'Stop', inside: 'Stop' },
  { n: 4, outside: 'Dig', inside: 'Dig' }, { n: 5, outside: 'Square', inside: 'Square' },
  { n: 6, outside: 'Curl/Hook', inside: 'Curl/Hook' }, { n: 7, outside: 'Bench', inside: 'Bench' },
  { n: 8, outside: 'Post', inside: 'Post' }, { n: 9, outside: 'Post-Corner', inside: 'Corner' },
];
export const ROUTE_TREE_NOTE = 'Outside Tree: WR nos splits Wide, Slot e Nasty. Inside Tree: TE e recebedores/backs nos splits Wing e Tight (playbook).';

export const MOTIONS: Motion[] = [
  { call: 'Wing', kind: 'Mesmo lado', what: 'Para o Wing do mesmo lado (logo por fora do último homem, fora da LOS).' },
  { call: 'Tight', kind: 'Mesmo lado', what: 'WR fechado: 2 jardas por fora do último OL.' },
  { call: 'Nasty', kind: 'Mesmo lado', what: 'A meio entre TE e Slot. Bom para trips e crack blocks.' },
  { call: 'Slot', kind: 'Mesmo lado', what: 'Para o Slot do mesmo lado.' },
  { call: 'Wide', kind: 'Mesmo lado', what: 'Para a posição de Wideout.' },
  { call: 'Back', kind: 'Mesmo lado', what: 'Para o backfield (pro-set / H-back).' },
  { call: 'Insert', kind: 'Mesmo lado', what: 'Para o B gap do mesmo lado, atrás de G-T.' },
  { call: 'Bee', kind: 'Através', what: 'Para o Insert (B gap) do outro lado.' },
  { call: 'Wasp', kind: 'Através', what: 'Para o Wing do outro lado.' },
  { call: 'Tick', kind: 'Através', what: 'Para o Tight do outro lado.' },
  { call: 'Hornet', kind: 'Através', what: 'Para o Nasty do outro lado.' },
  { call: 'Fly', kind: 'Através', what: 'Para o Slot do outro lado.' },
  { call: 'Worm', kind: 'Através', what: 'Para o Wide do outro lado.' },
  { call: 'Jet', kind: 'Live', what: 'Sprint através da formação ao snap; não pára.' },
  { call: 'Zip', kind: 'Live', what: 'Sprint para a sideline do mesmo lado (leverage de fora).' },
  { call: 'Orbit', kind: 'Live', what: 'Loop estilo Jet para o backfield, atrás do QB ao snap.' },
  { call: 'Shock', kind: 'Live', what: 'Sprint para um bloqueio Trap/Wham.' },
  { call: 'Shuffle', kind: 'Live', what: 'Pequeno motion em shuffle step.' },
  { call: 'Yo-Yo', kind: 'Modificador', what: 'Lê man/zona: volta vs man, acaba vs zona.' },
  { call: 'Scan', kind: 'Modificador', what: 'Lê man/zona: volta vs zona, acaba vs man.' },
  { call: 'Fakey', kind: 'Modificador', what: 'Motion sempre falso, volta.' },
];
export const MOTION_NOTES: string[] = [
  'Fallback: “F Wasp Yo-Yo Insert” = F vai ao Wing do outro lado; se ler man, volta mas pára no Insert (playbook).',
  'Motion do mesmo lado para quem está no meio (F e H em I-Base, H em Pistol): vai para o lado weak (playbook).',
  'Números dos backs: 10 = QB, 20 = Y/Z, 30 = X/F, 40 = H; em dois backs, 30 = F e 40 = H (playbook).',
  'Não definidos no playbook: LASH, DART, CREASE, Sprint option e as marcas CD e PSR.',
];

// ───────────────────────── Checklist ─────────────────────────
export const CHECKLIST: ChecklistItem[] = [
  { id: 'ordem', text: 'Ordem da chamada: Formação, Pass Protection, Motion, Play name, Blocking Assignments, Snap Count.', who: 'Todos' },
  { id: 'gaps', text: 'Gaps: par à direita, ímpar à esquerda. 0/1 = A, 2/3 = B, 4/5 = por fora do tackle; 8/9 = flats.', who: 'Todos' },
  { id: 'back', text: 'Número do back leva a bola: 40 = H, 30 = X/F, 10 = QB.', who: 'Todos' },
  { id: 'lado', text: 'Saber o lado de cada jogada: os cartões mostram Esquerda / Direita.', who: 'Todos' },
  { id: 'mike', text: 'Identificar a frente e declarar o Mike antes do snap.', who: 'OL / QB / Backs' },
  { id: 'protec', text: 'Protecções: BOB, LEX, REX, LIFT, RIFT, ROCK. Ninguém passa pelos gaps A e B.', who: 'Linha / Backs' },
  { id: 'pa', text: 'PA: vender o fake primeiro. “Protect the pocket! Not the fake.”', who: 'Todos' },
  { id: '2pt', text: '2 pontos (38): FREEZE até “HERE WE GO!”, snap no SET; “EASY! EASY!” = Wedge normal.', who: 'Todos' },
  { id: 'mdm', text: 'Na dúvida, bloqueie o MDM.', who: 'Todos' },
  { id: 'videos', text: 'Nos vídeos: ataque de branco, defesa de azul.', who: 'Todos' },
];

// ───────────────────────── Questões em aberto ─────────────────────────
export const QUESTIONS: Question[] = [
  { point: 'Pares Esquerda/Direita', why: 'Não são espelhos exactos: muda a formação e às vezes o gap. 15/18, 17/16, 31/32 e 35/36 foram juntos por análise.', state: 'perguntar' },
  { point: 'LASH, DART, FLOW, CREASE', why: 'Aparecem em 34, 39 e 40 e não estão definidos no playbook como rotas (FLOW só no glossário: direcção do movimento da defesa). Descrevi só o desenho.', state: 'perguntar' },
  { point: 'Marcas CD e PSR', why: 'O playbook define Checkdown, Alert, HOT, MOR e CDF, mas não as siglas CD e PSR. Análise: CD = Checkdown.', state: 'perguntar' },
  { point: 'Defensores pintados', why: 'Em muitos passes (ex.: 30, 34, 35, 36, 39) há defensores pintados com a cor de um jogador. Análise: é quem ele lê ou bloqueia (HOT).', state: 'perguntar' },
  { point: '1: “adjustment”', why: 'Quem decide POP ou BLOCK MDM? O tracejado aponta ao C esquerdo.', state: 'perguntar' },
  { point: 'Boots: lado do slide', why: '21: Boot para a esquerda com REX (slide para a direita). 22: Boot para a direita com ROCK, depois do fake 43 para a esquerda. O playbook diz Slide Lock para o lado da run action.', state: 'perguntar' },
  { point: '5: QB e LT', why: 'Tracejado do QB para a direita; o LT sobe ao M, do outro lado do C.', state: 'perguntar' },
  { point: 'X-COUNTER (10, 17)', why: 'No 10 o portador desenhado é o F, não o X.', state: 'perguntar' },
  { point: '13: bloqueios', why: 'No 13, Z e Y acabam os dois no E da direita e o X não tem tarefa.', state: 'perguntar' },
  { point: '11 e 24: bloqueios no edge', why: 'No 11, F, Z e LG acabam perto do C esquerdo. No 24, um bloqueio até ao C direito sem dono claro.', state: 'perguntar' },
  { point: '25: nome', why: '25 diz X-TUNNEL mas o lateral vai ao Z.', state: 'perguntar' },
  { point: '30: X-TAG', why: 'O playbook explica com esta mesma chamada (“TREY Y-STICK X-TAG”): o X faz uma rota chamada pelo QB. Falta saber que rota o QB chama.', state: 'perguntar' },
  { point: 'Tunnels e laterais', why: '23, 25, 26 e 37 não estão na lista do André (Inside, Outside, PA, Boot, conceitos). Ficaram em Especiais; o 24 ficou no Reverse.', state: 'perguntar' },
  { point: '39: Sprint-out', why: 'O playbook descreve o QB Sprint como corrida e só nomeia “sprint-outs” entre os movimentos; não há regras de sprint-out de passe. O mais perto é o Rollout.', state: 'perguntar' },
  { point: '38 (2 pontos)', why: 'X e H a verde-azulado (cor de puller) e sem ordem de leitura. A cadência não está no playbook (o capítulo CADENCE está vazio).', state: 'perguntar' },
  { point: 'Linha nos passes', why: 'Nos diagramas de passe a OL só tem a protecção; as tarefas da OL seguem as regras do playbook.', state: 'confirmar' },
  { point: 'Personnel', why: 'Continua sem definição: o playbook só diz que há grupos de personnel “more on that later” e nunca os define.', state: 'perguntar' },
  { point: 'DAGGER vs Cover 4', why: 'O playbook contradiz-se: o texto diz “less effective against Cover 4”, a linha Coverage Advantage diz “Excellent vs Cover 2 and Quarters”. A matriz segue o texto (36 = mau vs C4).', state: 'perguntar' },
];

export const RESOLVED: string[] = [
  'Numeração: segue o livro do jogo de 6 nov (PDF CRUSADERS, 40 jogadas). Ver “O que mudou”.',
  'Data do jogo: domingo, 8 de novembro (confirmado pelo André). O “7-nov” do URL antigo estava errado; o playbook não traz data.',
  'Técnicas do DL e gap D: definidas no glossário do playbook (1, 3, 5, 7 e 9-tech).',
  '14 (era o 29): é TOSS com Sprint option, como disse o André.',
  'Antigo 3 (LE e LBs sem bloqueador) e o PWR: a jogada saiu.',
  'Template vs Over (antigo 28): saiu; já não há jogada sem tarefas.',
  '2 pontos: o Fake Wedge Toss (antigo 36) saiu, com a dúvida do caminho do QB; fica o 38.',
  '“Copy” saiu dos nomes (no livro de 6 nov também do 28).',
  'Boot do antigo 3 e Short Boot do antigo 7: saíram; a dúvida do slide fica só no 21 e no 22.',
];
