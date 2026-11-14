/** Fichas das 40 jogadas do livro do jogo (PDF Playmaker X “CRUSADERS”, 6 nov 2026, 21 páginas,
 * sha256 4639f22c…). Renumeradas pela chamada a partir das fichas do livro de 3 nov; jogadas novas
 * ou alteradas estão marcadas “Por validar”. Ver CHANGELOG-diagramas.md.
 */
import type { Grade, MatrixRow, PlayDetail, Position, PositionTask } from './types';

export const PLAY_DETAILS: PlayDetail[] = [
 {
  "id": "iso",
  "title": "ISO · 1 / 6",
  "concept": "Conceitos: ISO · Corrida Inside · 1 Esquerda · 6 Direita",
  "variants": [
   {
    "n": 1,
    "label": "1 · Esquerda",
    "call": "I-Base Z-FLY 43-ISO Z-POP-ALERT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "ISO + Alert"
     },
     {
      "k": "Formação",
      "v": "I-Base"
     },
     {
      "k": "Motion",
      "v": "Z: Fly (para o Slot do lado esquerdo)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 3 (B esquerdo)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 43. Alert: o POP do Z.",
     "H": "Portador no gap 3. Leia o bloqueio do F e corte na anca dele.",
     "F": "Lead pelo gap 3 e bloqueia o W.",
     "X": "Stalk block ao FS.",
     "Z": "Fly para a esquerda. Sem ajuste da defesa: POP. Com ajuste: bloqueia o MDM.",
     "Y": "Bloqueia o E (direita).",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Double no N com o C.",
     "C": "Double no N com o LG. Vertical primeiro.",
     "RG": "Bloqueia o T.",
     "RT": "Sobe ao M (2.º nível)."
    },
    "diagramNotes": [
     "Texto no diagrama: “Z: POP if no adjustment. Otherwise BLOCK MDM”.",
     "O W está desenhado a azul (cor do Z); o tracejado do BLOCK MDM aponta ao C esquerdo."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "4-3 / Over e Cover 2: menos homens na box (playbook, no ISO)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0/1 com o safety na box: mais um defensor do que bloqueadores (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Z: com ajuste da defesa, BLOCK MDM em vez do POP (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 6,
    "label": "6 · Direita",
    "call": "ACE Pistol F-BEE 40-ISO",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "ISO"
     },
     {
      "k": "Formação",
      "v": "ACE Pistol"
     },
     {
      "k": "Motion",
      "v": "F: Bee (para o Insert do outro lado)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 0 (A direito)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 40; fake para a esquerda (tracejado).",
     "H": "Portador no gap 0.",
     "F": "Bee para o Insert e lead ao S.",
     "X": "Bloqueia o C (esquerda).",
     "Z": "Bloqueia o SS.",
     "Y": "Bloqueia o E (direita).",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Double no N com o C.",
     "C": "Double no N; depois M (tracejado).",
     "RG": "Double no T com o RT.",
     "RT": "Double no T com o RG."
    },
    "diagramNotes": [],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "4-3 / Over e Cover 2: menos homens na box (playbook, no ISO)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0/1 com o safety na box: mais um defensor do que bloqueadores (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Double teams primeiro, depois climb (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "power",
  "title": "POWER · 4 / 9",
  "concept": "Conceitos: Power, Power Lead · Corrida Inside · 4 Esquerda · 9 Direita",
  "variants": [
   {
    "n": 4,
    "label": "4 · Esquerda",
    "call": "Trips Tight 43 POWER",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Power"
     },
     {
      "k": "Formação",
      "v": "Trips Tight"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 3 (B esquerdo)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 43; depois tracejado para a direita.",
     "H": "Passo para a direita e corta para o gap 3.",
     "F": "Atravessa por trás da LOS e kick-out ao E (esquerda).",
     "X": "Sobe e bloqueia o FS.",
     "Z": "Bloqueia o SS.",
     "Y": "Bloqueia o S.",
     "LT": "Bloqueia o W.",
     "LG": "Bloqueia o N; tracejado até ao M.",
     "C": "Sem bloqueio claro no diagrama.",
     "RG": "Bloqueia o T.",
     "RT": "Bloqueia o E (direita)."
    },
    "diagramNotes": [],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Frentes pares (playbook: Power)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0/1 com o safety na box: mais um defensor do que bloqueadores (análise)."
     },
     {
      "k": "Ajuste",
      "v": "F faz kick-out ao E; doubles antes de subir (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "bom"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 9,
    "label": "9 · Direita",
    "call": "Pro-Gun Z-FLY 44-POWER LG-LEAD Z-POP-OPTION",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Power Lead + POP"
     },
     {
      "k": "Formação",
      "v": "Pro-Gun"
     },
     {
      "k": "Motion",
      "v": "Z: Fly (da direita para a esquerda)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG lead)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 4 (por fora do RT)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 44. Opção: POP do Z.",
     "H": "Portador no gap 4.",
     "F": "Kick-out ao E (direita, EMOL).",
     "X": "Bloqueia o C (esquerda).",
     "Z": "Fly para a esquerda: POP ou bloqueio ao FS (tracejado).",
     "Y": "Sobe ao S.",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Pull para a direita e lead pelo buraco ao LB.",
     "C": "Bloqueia o N.",
     "RG": "Sobe ao M (tracejado).",
     "RT": "Bloqueia o T."
    },
    "diagramNotes": [
     "Power Lead (playbook): o guard do backside puxa até ao LB.",
     "Aqui chama-se POP-OPTION; no 1 a mesma ideia chama-se ALERT."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Frentes pares (4-2 / 4-3) e DEs indisciplinados (playbook: Power)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0/1 com o safety na box: mais um defensor do que bloqueadores (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Doubles no DL do playside antes de subir (playbook). POP do Z como opção (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "bom"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "duo",
  "title": "DUO · 2 / 3 / 7 / 8",
  "concept": "Conceitos: DUO · Corrida Inside · 2 e 3 Esquerda · 7 e 8 Direita. O 3 (Troop) e o 8 (DUO com Fake Tunnel, “DRAW”) vêm do livro de 6 nov e estão por validar.",
  "variants": [
   {
    "n": 2,
    "label": "2 · Esquerda",
    "call": "ACE Gun 41 DUO",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "DUO"
     },
     {
      "k": "Formação",
      "v": "ACE Gun"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 1 (A esquerdo)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 41; depois tracejado para trás.",
     "H": "Portador no gap 1, vertical.",
     "F": "Do slot esquerdo, bloqueia o FS.",
     "X": "Bloqueia o C (esquerda).",
     "Z": "Bloqueia o C (direita).",
     "Y": "Bloqueia o E (direita).",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Double no N com o C; depois W (tracejado).",
     "C": "Double no N com o LG.",
     "RG": "Double no T com o RT.",
     "RT": "Double no T com o RG; depois M (tracejado)."
    },
    "diagramNotes": [
     "Duo rules (playbook): double teams inside, climb late."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2, como o ISO (análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0 / box cheia (análise)."
     },
     {
      "k": "Ajuste",
      "v": "DUO: double teams inside, climb late (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 3,
    "label": "3 · Esquerda",
    "call": "Troop 43 DUO X-SPILL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "DUO + Spill (por validar)"
     },
     {
      "k": "Formação",
      "v": "Troop (X na LOS ao lado do LT; Y TE e F à direita; Z largo à direita)"
     },
     {
      "k": "Motion",
      "v": "Z: motion curto para dentro (seta sem nome)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 3 (B esquerdo)"
     }
    ],
    "tasks": {
     "QB": "Por validar (vinha do 43 DIVE): Entrega ao H no 43; depois tracejado para a direita.",
     "H": "Por validar (vinha do 43 DIVE): Portador no gap 3. Vá buscar a bola e leia: bounce, bend ou bang (playbook: DIVE).",
     "F": "Por validar (vinha do 43 DIVE): Sobe ao 2.º nível pelo lado direito, até à zona do SS.",
     "X": "Por validar (vinha do 43 DIVE): SPILL: atravessa por trás da LOS e bloqueia por fora do RT (ponta direita).",
     "Z": "Por validar (vinha do 43 DIVE): Motion curto para dentro.",
     "Y": "Por validar (vinha do 43 DIVE): Bloqueia o S.",
     "LT": "Por validar: o bloqueio passou de DIVE para DUO no livro de 6 nov (ver diagrama).",
     "LG": "Por validar: o bloqueio passou de DIVE para DUO no livro de 6 nov (ver diagrama).",
     "C": "Por validar: o bloqueio passou de DIVE para DUO no livro de 6 nov (ver diagrama).",
     "RG": "Por validar: o bloqueio passou de DIVE para DUO no livro de 6 nov (ver diagrama).",
     "RT": "Por validar: o bloqueio passou de DIVE para DUO no livro de 6 nov (ver diagrama)."
    },
    "diagramNotes": [
     "Por validar: no livro de 6 nov esta jogada passou de “Troop 43 DIVE X-SPILL” a “Troop 43 DUO X-SPILL”. As tarefas vêm da versão DIVE e precisam de confirmação."
    ],
    "vsDefense": [],
    "matrix": []
   },
   {
    "n": 7,
    "label": "7 · Direita",
    "call": "Trey Wing 40-DUO F-SPILL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "DUO"
     },
     {
      "k": "Formação",
      "v": "Trey Wing"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 0 (A direito)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 40; depois tracejado.",
     "H": "Portador no gap 0.",
     "F": "SPILL: do Wing atravessa por trás da LOS e bloqueia o E (esquerda).",
     "X": "Bloqueia o C (esquerda).",
     "Z": "Bloqueia o SS.",
     "Y": "Bloqueia o E (direita).",
     "LT": "Sobe ao W.",
     "LG": "Double no N com o C.",
     "C": "Double no N com o LG.",
     "RG": "Double no T com o RT; depois M (tracejado).",
     "RT": "Double no T com o RG."
    },
    "diagramNotes": [
     "Duo rules: double teams inside, climb late."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2, como o ISO (análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0 / box cheia (análise)."
     },
     {
      "k": "Ajuste",
      "v": "DUO: double teams inside, climb late (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 8,
    "label": "8 · Direita",
    "call": "Trey F-JET Fk-Z-TUNNEL 40 DUO (DRAW)",
    "keyValues": [
     {
      "k": "Estado",
      "v": "Por validar: jogada nova no livro de 6 nov. Só a chamada e o texto do diagrama vêm do livro."
     }
    ],
    "tasks": {},
    "diagramNotes": [
     "Texto no diagrama (livro de 6 nov): “QB: Fake Lateral”."
    ],
    "vsDefense": [],
    "matrix": []
   }
  ]
 },
 {
  "id": "counter",
  "title": "COUNTER · 5 / 10",
  "concept": "Conceitos: GY Counter (5), Counter single pull (10) · Corrida Inside · 5 Esquerda · 10 Direita",
  "variants": [
   {
    "n": 5,
    "label": "5 · Esquerda",
    "call": "I-Base 43-GY-COUNTER",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Counter (double pull GY)"
     },
     {
      "k": "Formação",
      "v": "I-Base"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 3 (B esquerdo)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao H no 43; depois tracejado para a direita.",
     "H": "Counter step para a direita, segue o RG (kick-out) e o Y (wrapper).",
     "F": "Fake para a direita e kick-out ao E do backside (direita).",
     "X": "Solta por fora do C e bloqueia o FS.",
     "Z": "Bloqueia o C (direita).",
     "Y": "Wrapper: por dentro do kick-out do RG e lead ao W.",
     "LT": "Sobe ao M.",
     "LG": "Double no N com o C.",
     "C": "Double no N com o LG.",
     "RG": "Pull e kick-out ao E (esquerda, EMOL).",
     "RT": "Bloqueia o T e tapa o lugar do RG."
    },
    "diagramNotes": [
     "Bate com a regra GY Counter two-back: G do backside faz kick-out, Y faz wrap ao LB, FB faz kick-out ao EMOL do backside."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Frentes pares e ILBs a atacar os gaps cedo (playbook: Counter)."
     },
     {
      "k": "vs defesa: pior",
      "v": "3-4 (o Counter é sobretudo para frentes pares, playbook) e box cheia em Cover 0 (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Quem fica ao lado de um puller tapa o lugar dele (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "bom"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 10,
    "label": "10 · Direita",
    "call": "Pro-Gun Close 32 X-COUNTER",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Counter (single pull)"
     },
     {
      "k": "Formação",
      "v": "Pro-Gun Close"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 2 (B direito)"
     }
    ],
    "tasks": {
     "QB": "Entrega ao F no 32; depois tracejado para trás.",
     "H": "Atravessa para a esquerda e bloqueia o E (esquerda).",
     "F": "Counter step e corta para o gap 2. Portador.",
     "X": "Bloqueia o FS.",
     "Z": "Bloqueia o SS.",
     "Y": "Bloqueia o S.",
     "LT": "Sobe ao W.",
     "LG": "Pull para a direita e kick-out ao E (direita, EMOL).",
     "C": "Bloqueia o N.",
     "RG": "Sobe ao M (tracejado).",
     "RT": "Bloqueia o T."
    },
    "diagramNotes": [
     "O nome diz X-COUNTER, mas o portador desenhado é o F (30 = X/F)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Frentes pares e ILBs a atacar cedo (playbook: Counter)."
     },
     {
      "k": "vs defesa: pior",
      "v": "3-4 e box cheia (análise)."
     },
     {
      "k": "Ajuste",
      "v": "LG faz kick-out ao E; RG sobe ao M (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "bom"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "bom"
     },
     {
      "label": "Under",
      "grade": "bom"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "toss",
  "title": "TOSS / Sprint option · 11 / 13 / 14",
  "concept": "Conceitos: Toss, Pin Toss (13), Sprint option (14) · Corrida Outside",
  "variants": [
   {
    "n": 11,
    "label": "11 · Esquerda",
    "call": "I-Twins RIGHT Z-JET 49-TOSS LG-PULL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Toss"
     },
     {
      "k": "Formação",
      "v": "I-Twins Right (Y à esquerda)"
     },
     {
      "k": "Motion",
      "v": "Z: Jet (da direita para a esquerda, sem parar)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 9 (edge esquerda)"
     }
    ],
    "tasks": {
     "QB": "Toss ao H para a esquerda; depois sai para a direita (tracejado).",
     "H": "Recebe o toss e ataca por fora pela esquerda.",
     "F": "Lead para a esquerda, por fora.",
     "X": "Bloqueia o C (direita).",
     "Z": "Jet para a esquerda e bloqueia por fora (zona do C esquerdo).",
     "Y": "Bloqueia o E (esquerda). Edge selada.",
     "LT": "Bloqueia o T.",
     "LG": "Pull para a esquerda e lead por fora até ao C (esquerda).",
     "C": "Sobe ao 2.º nível.",
     "RG": "Bloqueio do backside.",
     "RT": "Bloqueia o E (direita), backside."
    },
    "diagramNotes": [
     "TOSS (playbook): o EMOL tem de ficar selado.",
     "F, Z e LG acabam todos perto do C esquerdo (ver questões)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "3-4 com os OLBs apertados; defesas a fechar por dentro (playbook: Toss)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Edge forte ou contain rápido (playbook: Toss)."
     },
     {
      "k": "Ajuste",
      "v": "O EMOL não pode penetrar: o Y sela o E (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "bom"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 13,
    "label": "13 · Direita",
    "call": "I-Big 46 PIN TOSS",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Pin Toss (Pin & Pull)"
     },
     {
      "k": "Formação",
      "v": "I-Big (Y TE e Z Wing à direita; X na LOS à esquerda)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG e RG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Gap 6 (por fora do Y, direita)"
     }
    ],
    "tasks": {
     "QB": "Toss ao H para a direita; depois sai para a esquerda.",
     "H": "Recebe o toss e ataca por fora pela direita.",
     "F": "Lead por fora e bloqueia o S.",
     "X": "Passo curto na LOS (sem bloqueio desenhado).",
     "Z": "Do Wing, bloqueia por dentro na zona do E (direita).",
     "Y": "Pin: bloqueia o E (direita).",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Pull para a direita e sobe ao 2.º nível, por fora do S.",
     "C": "Pin: bloqueia o N.",
     "RG": "Pull para a direita e bloqueia o C (direita).",
     "RT": "Pin: bloqueia o T."
    },
    "diagramNotes": [
     "Pin & Pull (playbook): os covered fazem pin para o backside; os uncovered puxam para o playside.",
     "Z e Y acabam os dois no E da direita (ver questões)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "3-4 com os OLBs apertados (playbook: Toss); Pin & Pull para frentes ímpares (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Edge forte ou contain rápido (playbook: Toss)."
     },
     {
      "k": "Ajuste",
      "v": "Covered fazem pin, uncovered puxam (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "bom"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 14,
    "label": "14 · Dir. + Sprint esq.",
    "call": "Trips F-INSERT 48-TOSS 19-SPRINT-OPT LG-LEAD X-SEAL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Dir. + Sprint esq."
     },
     {
      "k": "Tipo",
      "v": "Toss + Sprint Option"
     },
     {
      "k": "Formação",
      "v": "Trips"
     },
     {
      "k": "Motion",
      "v": "F: Insert (gap B do mesmo lado)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG lead)"
     },
     {
      "k": "Ponto de ataque",
      "v": "48 à direita / 19 à esquerda"
     }
    ],
    "tasks": {
     "QB": "Desenhado a grená: Sprint para a esquerda (19). Há também um toss tracejado ao H (48).",
     "H": "48 Toss: por fora à direita.",
     "F": "Insert e bloqueia o S.",
     "X": "SEAL: sobe e sela por dentro (zona do W).",
     "Z": "Bloqueia o SS.",
     "Y": "Bloqueia o S; tracejado até ao C (direita).",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Pull para a esquerda e lead até ao C (esquerda).",
     "C": "Bloqueia o N.",
     "RG": "Bloqueia o T.",
     "RT": "Bloqueia o E (direita)."
    },
    "diagramNotes": [
     "TOSS com Sprint option, como disse o André: 48 Toss ao H para a direita ou 19 Sprint do QB para a esquerda.",
     "QB Sprint (playbook): funciona contra defesas agressivas e complementa o Toss."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "3-4 com OLBs apertados (playbook: Toss); defesa agressiva (playbook: QB Sprint)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Edge forte ou contain rápido (playbook: Toss)."
     },
     {
      "k": "Ajuste",
      "v": "X sela por dentro; LG lead ao C (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "bom"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "reverse",
  "title": "Reverse · 12 / 24",
  "concept": "Conceitos: Reverse (12), Tunnel Reverse (24) · Corrida Outside",
  "variants": [
   {
    "n": 12,
    "label": "12 · Esquerda",
    "call": "Pro-Gun Twins RIGHT FK-42-RUN Z-REVERSE C-LEAD (POP-ALERT)",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Reverse + Alert"
     },
     {
      "k": "Formação",
      "v": "Pro-Gun Twins Right (Y à esquerda)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (C lead)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 2, reverse pela esquerda"
     }
    ],
    "tasks": {
     "QB": "Fake do 42 ao H e entrega ao Z no reverse. Alert: POP do Z.",
     "H": "Fake do 42 e bloqueia o M.",
     "F": "Vai para a direita e bloqueia o W (pintado com a cor do Z).",
     "X": "Bloqueia o C (direita).",
     "Z": "POP (Alert) ou reverse por trás do QB, por fora do C esquerdo.",
     "Y": "Bloqueia o E (esquerda).",
     "LT": "Bloqueia o E (esquerda), com o Y.",
     "LG": "Bloqueia o T.",
     "C": "Pull para a esquerda e lead até ao C (esquerda).",
     "RG": "Bloqueia o N (sombreado).",
     "RT": "Bloqueia o E (direita)."
    },
    "diagramNotes": [
     "Texto no diagrama: “C & G: Depending on N positioning, Lead can change”."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesas que perseguem a primeira acção (playbook: Reverses)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Defesa que lê o reverse (playbook) e Cover 0 a atacar atrás da LOS (análise)."
     },
     {
      "k": "Ajuste",
      "v": "“C & G: Depending on N positioning, Lead can change” (diagrama). Usar pouco (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 24,
    "label": "24 · Direita",
    "call": "Spread F-INSERT Z-TUNNEL H-REVERSE",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Tunnel + Reverse"
     },
     {
      "k": "Formação",
      "v": "Spread"
     },
     {
      "k": "Motion",
      "v": "F: Insert (gap B do mesmo lado)"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Lateral ao Z, H por fora à direita"
     }
    ],
    "tasks": {
     "QB": "Lateral (tunnel) ao Z, atrás da LOS.",
     "H": "Volta por trás, recebe do Z e sobe pela direita.",
     "F": "Insert e bloqueia no backside (zona do W).",
     "X": "Bloqueia o C (esquerda).",
     "Z": "Recebe o lateral e entrega ao H.",
     "Y": "Bloqueia o S.",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Pull para a direita e lead por fora até ao E (direita).",
     "C": "Bloqueia o N.",
     "RG": "Sobe ao M.",
     "RT": "Sobe ao SS."
    },
    "diagramNotes": [
     "Há um bloqueio desenhado até ao C (direita) sem dono claro.",
     "Lateral (Tunnel) Reverse (playbook): a defesa lê tunnel e fecha por dentro."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesa que lê o tunnel e fecha por dentro (playbook: Lateral Reverse)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Defesa que lê o reverse (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Usar pouco: alto risco se a defesa ler (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "pa-power",
  "title": "Play action Power · 15 / 18 / 19",
  "concept": "Conceitos: Fake Power, Drag, Flat (18 com SHIV). Par por análise: o 15 finge o 43 e lança à esquerda; o 18 finge o 42 e lança à direita. O 19 (I-Big LEFT BOB FK-45 POWER, livro de 6 nov) está por validar.",
  "variants": [
   {
    "n": 15,
    "label": "15 · Esquerda",
    "call": "Pro-Gun Y-TANGO RIFT Z-HORNET FK-43 POWER 82 DRAG F-FLAT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Play action"
     },
     {
      "k": "Formação",
      "v": "Pro-Gun"
     },
     {
      "k": "Motion",
      "v": "Y: Tango (troca de profundidade); Z: Hornet (para a esquerda)"
     },
     {
      "k": "Protecção",
      "v": "RIFT"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 3, passe"
     }
    ],
    "tasks": {
     "QB": "Fake do 43 Power ao H e passe. Ordem: Z 1, X 2, F 3; Y com CD.",
     "H": "Fake do 43.",
     "F": "Pelo gap 3 e Flat para a esquerda. Marca 3.",
     "X": "8 (Post). Marca 2.",
     "Z": "Hornet e 2 (para dentro). Marca 1.",
     "Y": "Tango e DRAG para a esquerda. Marca CD.",
     "LT": "RIFT: Full Slide para a direita.",
     "LG": "RIFT: Full Slide para a direita.",
     "C": "RIFT: Full Slide para a direita.",
     "RG": "RIFT: Full Slide para a direita.",
     "RT": "RIFT: Full Slide para a direita."
    },
    "diagramNotes": [
     "82 = X 8, Z 2 (ordem X, Z).",
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "LBs que mordem o fake do 43 Power (análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0: o motion e as rotas fundas demoram (análise)."
     },
     {
      "k": "Ajuste",
      "v": "F sai para a Flat esquerda depois do fake (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 18,
    "label": "18 · Direita",
    "call": "I-Twins Z-WORM FK 42-POWER DRAG SHIV F-FLAT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Play action (SHIV)"
     },
     {
      "k": "Formação",
      "v": "I-Twins"
     },
     {
      "k": "Motion",
      "v": "Z: Fly-Wide (da esquerda para Wide à direita)"
     },
     {
      "k": "Protecção",
      "v": "Não indicada (PA)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 2, passe"
     }
    ],
    "tasks": {
     "QB": "Por validar: Fake do 42 Power ao H e passe, sem Boot. Ordem: Y 1, F 2, X 3; Z é Alert.",
     "H": "Vende o fake do 42 Power.",
     "F": "Passa pelo lado do RT/Y e Flat para a direita. Marca 2.",
     "X": "DRAG para dentro. Marca 3.",
     "Z": "Por validar (motion mudou de Z-fly-Wide para Z-WORM): Fly-Wide e vertical. Marca AL.",
     "Y": "Vertical e quebra para fora. Marca 1.",
     "LT": "Bloqueia o E (esquerda).",
     "LG": "Bloqueia o N.",
     "C": "Bloqueia em frente (zona do N).",
     "RG": "Bloqueia o T.",
     "RT": "Bloqueio de PA no lado do fake (confirmar no diagrama)."
    },
    "diagramNotes": [
     "Por validar: chamada mudou no livro de 6 nov (Z-fly-Wide → Z-WORM).",
     "Texto no diagrama (livro de 6 nov): “QB: BEWARE! W is Unblocked”.",
     "SHIV no playbook: Go → Square → Flat.",
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 3 (playbook: SHIV)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 2: o S fica com o Go e o C cai no Square (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Contra MOFO, ir à Flat do F para isolar o C (playbook: SHIV vira Flood)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 19,
    "label": "19 · Esquerda",
    "call": "I-Big LEFT BOB FK-45 POWER 4 8 9 H-FLAT",
    "keyValues": [
     {
      "k": "Estado",
      "v": "Por validar: jogada nova no livro de 6 nov. Só a chamada e o texto do diagrama vêm do livro."
     }
    ],
    "tasks": {},
    "diagramNotes": [],
    "vsDefense": [],
    "matrix": []
   }
  ]
 },
 {
  "id": "pa-counter",
  "title": "Play action Counter / Run · 17 / 16",
  "concept": "Conceitos: SHIV + Dig (17), Sluggo + Glance + Slant (16). Par por análise: o 17 lança à esquerda e o 16 à direita, mas os dois fingem para a direita.",
  "variants": [
   {
    "n": 17,
    "label": "17 · Esquerda",
    "call": "Pro-Gun Twins LIFT FK-32 X-COUNTER SHIV DIG H-FLAT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Play action (SHIV)"
     },
     {
      "k": "Formação",
      "v": "Pro-Gun Twins (esquerda)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "LIFT"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake Counter gap 2, passe"
     }
    ],
    "tasks": {
     "QB": "Fake do 32 X-Counter e passe. Ordem: X 1, Z 2, Y 3; H com CD.",
     "H": "Flat para a esquerda. Marca CD.",
     "F": "Fake do Counter pelo lado do RT.",
     "X": "Go. Marca 1.",
     "Z": "Vertical e Square para fora. Marca 2.",
     "Y": "DIG. Marca 3.",
     "LT": "LIFT: Full Slide para a esquerda.",
     "LG": "LIFT; fake de pull para a direita (desenhado).",
     "C": "LIFT: Full Slide para a esquerda.",
     "RG": "LIFT: Full Slide para a esquerda.",
     "RT": "LIFT: Full Slide para a esquerda."
    },
    "diagramNotes": [
     "SHIV: Go → Square → Flat.",
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 3 (playbook: SHIV)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 2 se a Flat não prender o C (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Contra MOFO, a H-Flat isola o C (playbook: SHIV vira Flood)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 16,
    "label": "16 · Direita",
    "call": "ACE Pistol BOB F-BEE-OUT FK-42 SLUGGO GLANCE Y-SLANT H-SNEAK",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Play action"
     },
     {
      "k": "Formação",
      "v": "ACE Pistol"
     },
     {
      "k": "Motion",
      "v": "F: Bee e Out (para a direita)"
     },
     {
      "k": "Protecção",
      "v": "BOB"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 2, passe"
     }
    ],
    "tasks": {
     "QB": "Fake do 42 ao H e passe. Ordem: Y 1, Z 2, F 3; X é Alert; H com CD.",
     "H": "Fake do 42 e SNEAK. Marca CD.",
     "F": "Bee e Flat para a direita. Marca 3.",
     "X": "SLUGGO. Marca AL.",
     "Z": "GLANCE. Marca 2.",
     "Y": "SLANT. Marca 1.",
     "LT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "LG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "C": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par)."
    },
    "diagramNotes": [
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Man / press: SLUGGO e GLANCE funcionam contra man (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Zona funda que não morde o fake (análise)."
     },
     {
      "k": "Ajuste",
      "v": "BOB: se vier mais um do que bloqueamos, lança HOT (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "pa-dive",
  "title": "Play action Dive · 20",
  "concept": "Chamada FK-43-DIVE (livro de 6 nov). Por validar.",
  "variants": [
   {
    "n": 20,
    "label": "20 · Esquerda",
    "call": "Trips Bunch PISTOL LEX FK-43-DIVE X-SHALLOW 84 F-WHEEL",
    "keyValues": [
     {
      "k": "Estado",
      "v": "Por validar: jogada nova no livro de 6 nov. Só a chamada e o texto do diagrama vêm do livro."
     }
    ],
    "tasks": {},
    "diagramNotes": [],
    "vsDefense": [],
    "matrix": []
   }
  ]
 },
 {
  "id": "boot",
  "title": "Boot · 21 / 22",
  "concept": "Conceitos: Boot com rotas em níveis (Flood, análise)",
  "variants": [
   {
    "n": 21,
    "label": "21 · Esquerda",
    "call": "Trips Tight LEFT REX 41-BOOT-LEFT 2 1 5 9",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Play action / Boot"
     },
     {
      "k": "Formação",
      "v": "Trips Tight Left"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "REX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 1, Boot esquerda"
     }
    ],
    "tasks": {
     "QB": "Fake do 41 e Boot para a esquerda. Ordem: F 1, Y 2, Z 3. “No Boot if Throwing X”.",
     "H": "Fake do 41 e bloqueia (tracejado).",
     "F": "9 (Corner). Marca 1.",
     "X": "2 (Slant). Marcas PSR e CDF.",
     "Z": "1 (Quick Out). Marca 3.",
     "Y": "5 (Square). Marca 2.",
     "LT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "LG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "C": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man."
    },
    "diagramNotes": [
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 / Cover 4: Quick Out, Square e Corner no mesmo lado como um Flood (playbook: Flood; leitura minha, análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Pressão do lado do Boot (análise)."
     },
     {
      "k": "Ajuste",
      "v": "“No Boot if Throwing X” (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "bom"
     }
    ]
   },
   {
    "n": 22,
    "label": "22 · Direita",
    "call": "Trips Tight ROCK 43-BOOT-R GO 9 5 F-FLAT H-STAB",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Play action / Boot"
     },
     {
      "k": "Formação",
      "v": "Trips Tight"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "ROCK"
     },
     {
      "k": "Ponto de ataque",
      "v": "Fake gap 3, Boot direita"
     }
    ],
    "tasks": {
     "QB": "Fake do 43 e Boot para a direita. Ordem: Z 1, Y 2, F 3; X com PSR; H com CD.",
     "H": "Fake do 43 e STAB. Marca CD.",
     "F": "Flat para a direita. Marca 3.",
     "X": "GO. Marca PSR.",
     "Z": "9 (Corner). Marca 1.",
     "Y": "5 (Square). Marca 2.",
     "LT": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "LG": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "C": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "RG": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "RT": "ROCK: Slide Lock para a direita (um homem do lado man)."
    },
    "diagramNotes": [
     "“Protect the pocket! Not the fake.” A OL não passa das 3 jardas além da LOS."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 / Cover 4: Flat, Square e Corner como um Flood (playbook: Flood; leitura minha, análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Pressão do lado do Boot (análise)."
     },
     {
      "k": "Ajuste",
      "v": "O Boot funciona melhor quando a defesa morde o run action (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "bom"
     }
    ]
   }
  ]
 },
 {
  "id": "stick",
  "title": "STICK · 29 / 30",
  "concept": "Conceitos: STICK",
  "variants": [
   {
    "n": 29,
    "label": "29 · Esquerda",
    "call": "Trio LEX F-STICK Z-WHIP Y-STAB",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Passe quick (STICK)"
     },
     {
      "k": "Formação",
      "v": "Trio"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "LEX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: F 1, Z 2; X é Alert; Y com CD; H é HOT.",
     "H": "“H: Read S to CB. If both BLITZ, run Crease.” Sai para a direita (HOT).",
     "F": "STICK. Marca 1.",
     "X": "GO. Marcas AL e MOR.",
     "Z": "WHIP. Marca 2.",
     "Y": "STAB. Marca CD.",
     "LT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "LG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "C": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man."
    },
    "diagramNotes": [
     "S e C (direita) estão pintados."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 e Cover 1 (playbook: STICK); WHIP contra man (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Blitz dos dois lados (diagrama)."
     },
     {
      "k": "Ajuste",
      "v": "“H: Read S to CB. If both BLITZ, run Crease.” (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 30,
    "label": "30 · Direita",
    "call": "Trey BOB Y-Stick X-TAG",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Passe quick (STICK)"
     },
     {
      "k": "Formação",
      "v": "Trey"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "BOB"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "1 Step. Ordem: F 1, Y 2; X e Z com AL.",
     "H": "Check (W pintado com a sua cor).",
     "F": "Vertical curto e Flat. Marca 1.",
     "X": "TAG: diagonal para dentro e várias opções a tracejado. Marca AL.",
     "Z": "GO. Marcas AL e MOR.",
     "Y": "STICK. Marca 2.",
     "LT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "LG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "C": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par)."
    },
    "diagramNotes": [
     "STICK: Flat → Stick → Go, lendo o apex."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 e Cover 1; resposta rápida contra blitz (playbook: STICK)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook para Cover 3/4."
     },
     {
      "k": "Ajuste",
      "v": "“1 Step” (diagrama): a bola sai rápido."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "lion",
  "title": "LION · 27 / 28",
  "concept": "Conceitos: LION + SNAG (27), LION + Slant/Flat (28)",
  "variants": [
   {
    "n": 27,
    "label": "27 · LION esq. / SNAG dir.",
    "call": "ACE Pistol REX H-ZIP-WHEEL LION SNAG",
    "keyValues": [
     {
      "k": "Lado",
      "v": "LION esq. / SNAG dir."
     },
     {
      "k": "Tipo",
      "v": "Passe quick (LION + SNAG)"
     },
     {
      "k": "Formação",
      "v": "ACE Pistol"
     },
     {
      "k": "Motion",
      "v": "H: Zip (para a linha lateral esquerda)"
     },
     {
      "k": "Protecção",
      "v": "REX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Esquerda (LION): F 1, X 2, H 3. Direita (SNAG): Z 1, Y 2.",
     "H": "Zip para a esquerda e WHEEL. Marca 3.",
     "F": "Slant de dentro do LION. Marca 1.",
     "X": "Rota de fora do LION, para dentro. Marca 2.",
     "Z": "SNAG: sobe e volta para dentro. Marca 1.",
     "Y": "Vertical e Corner. Marca 2.",
     "LT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "LG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "C": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man."
    },
    "diagramNotes": [
     "LION: Slant de dentro → Slant de fora → check (playbook).",
     "SNAG: Snag + Corner (playbook)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "LION vs Cover 1/0 e blitz; SNAG vs Cover 2 e Quarters (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook para Cover 3 (fica ok, análise)."
     },
     {
      "k": "Ajuste",
      "v": "Escolher o lado antes do snap: man/pressão → LION; dois safeties → SNAG (análise)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "bom"
     }
    ]
   },
   {
    "n": 28,
    "label": "28 · LION dir.",
    "call": "Trips BOB F-JET-FLAT 2 LION H-WHEEL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "LION dir."
     },
     {
      "k": "Tipo",
      "v": "Passe quick (LION)"
     },
     {
      "k": "Formação",
      "v": "Trips"
     },
     {
      "k": "Motion",
      "v": "F: Jet (para a esquerda)"
     },
     {
      "k": "Protecção",
      "v": "BOB"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Esquerda: X 1, F 2. Direita (LION): Y 1, Z 2, H 3.",
     "H": "WHEEL para a direita. Marca 3.",
     "F": "Jet e Flat para a esquerda. Marca 2.",
     "X": "2 (Slant). Marca 1.",
     "Z": "Rota de fora do LION, para dentro. Marca 2.",
     "Y": "Slant de dentro do LION. Marca 1.",
     "LT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "LG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "C": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par)."
    },
    "diagramNotes": [
     "LION: Slant de dentro → Slant de fora → check.",
     "Slant do X + Flat do F à esquerda: a estrutura do DRAGON (análise)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 0; resposta rápida contra pressão (playbook: LION)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Zona bem espaçada: só funciona se lerem mal (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Inside Slant → Outside Slant → Check (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "shiv",
  "title": "SHIV · 31 / 32",
  "concept": "Conceitos: SHIV, Curl/Hook (Y6). Par por análise: o 32 não diz SHIV no nome, mas tem Go + Square + Flat do mesmo lado. Há SHIV também em 17 e 18.",
  "variants": [
   {
    "n": 31,
    "label": "31 · Esquerda",
    "call": "Trips LEFT LEX X-NASTY FADE ZF-SHIV Y6",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Passe (SHIV)"
     },
     {
      "k": "Formação",
      "v": "Trips Left; X em Nasty à direita"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "LEX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: F 1, Z 2, Y 3; X é Alert.",
     "H": "Check (W pintado com a sua cor) e sai para a direita (tracejado).",
     "F": "Square do SHIV. Marca 1.",
     "X": "FADE. Marca AL.",
     "Z": "Go do SHIV (rota mais longa). Marca 2.",
     "Y": "6 (Curl/Hook). Marca 3.",
     "LT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "LG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "C": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man."
    },
    "diagramNotes": [
     "“ZF-”: a 1.ª letra corre a rota mais longa.",
     "No livro de 37 o X fazia 8 (Post) e não havia ordem de leitura.",
     "Livro de 6 nov: mesma jogada; a chamada passa a “LEX X-NASTY” e o Z tem “MOR” no diagrama."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 3 (playbook: SHIV)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 2: o S fica com o Go e o C cai no Square; aqui não há Flat (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Contra MOFO, ir ao Y6 ou ao FADE do X (análise)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "mau"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 32,
    "label": "32 · Direita",
    "call": "ACE Pistol LEX F-FLY-SQUARE SLICE GO Y6",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Passe (dropback)"
     },
     {
      "k": "Formação",
      "v": "ACE Pistol"
     },
     {
      "k": "Motion",
      "v": "F: Fly (da esquerda para a direita)"
     },
     {
      "k": "Protecção",
      "v": "LEX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: Y 1, F 2, Z 3; X é HOT; H com CD.",
     "H": "Check (S pintado com a sua cor) e Flat direita. Marca CD.",
     "F": "Fly e Square para fora. Marca 2.",
     "X": "SLICE. Marca HOT (W pintado com a sua cor).",
     "Z": "GO. Marcas 3 e MOR.",
     "Y": "6 (Curl/Hook). Marca 1.",
     "LT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "LG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "C": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man."
    },
    "diagramNotes": [
     "Go do Z + Square do F + Flat do H à direita: a estrutura do SHIV (análise)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 / Cover 3: Go + Square no mesmo lado como o SHIV (análise); Hook contra zona (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0 se o QB não ler o HOT (análise)."
     },
     {
      "k": "Ajuste",
      "v": "X é o HOT (Slice) (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "mesh",
  "title": "MESH · 33 / 34 / 39",
  "concept": "Conceitos: MESH",
  "variants": [
   {
    "n": 33,
    "label": "33 · Trips Left",
    "call": "Trips LEFT REX X-NASTY-DINO F-HORNET ZF-MESH Y-SLANT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Trips Left"
     },
     {
      "k": "Tipo",
      "v": "Passe (MESH)"
     },
     {
      "k": "Formação",
      "v": "Trips Left"
     },
     {
      "k": "Motion",
      "v": "F: Hornet (para a direita)"
     },
     {
      "k": "Protecção",
      "v": "REX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: Y 1, F 2; X é Alert; Z com CD.",
     "H": "Por validar (diagrama: “H: READ M -> S”): Check (M pintado com a sua cor).",
     "F": "Hornet e cruzamento curto do MESH para a esquerda. Marca 2.",
     "X": "Por validar (X passa a X-NASTY-DINO; já não há a rota 8): 8 (Post). Marca AL.",
     "Z": "Cruzamento do MESH para a direita. Marca CD.",
     "Y": "SLANT. Marca 1.",
     "LT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "LG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "C": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man."
    },
    "diagramNotes": [
     "Por validar: chamada mudou no livro de 6 nov (“F-HORNET 8” → “X-NASTY-DINO F-HORNET”).",
     "Texto no diagrama (livro de 6 nov): “H: READ M -> S”."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 0 (playbook: MESH); sólido vs Cover 3."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook para Cover 2/4."
     },
     {
      "k": "Ajuste",
      "v": "Contra man, os rubs; contra zona, sobrecarga no meio curto (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 34,
    "label": "34 · Spread",
    "call": "Spread LEX 4 Z-LASH YF-MESH",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Spread"
     },
     {
      "k": "Tipo",
      "v": "Passe (MESH)"
     },
     {
      "k": "Formação",
      "v": "Spread"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "LEX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: F 1, Z 2, X 3; Y com CD.",
     "H": "“H: Read M -> S” (M e S pintados com a sua cor).",
     "F": "Cruzamento curto do MESH para a direita. Marca 1.",
     "X": "4 (Dig) da esquerda para a direita. Marca 3.",
     "Z": "LASH: vertical e quebra para fora. Marca 2.",
     "Y": "Cruzamento curto do MESH para a esquerda. Marca CD.",
     "LT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "LG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "C": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RG": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man.",
     "RT": "LEX: Half Slide para a esquerda. O slide começa no 1.º OL livre do backside; à direita dele, man."
    },
    "diagramNotes": [
     "LASH não está definido no playbook (ver questões)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 0 (playbook: MESH); sólido vs Cover 3."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook para Cover 2/4."
     },
     {
      "k": "Ajuste",
      "v": "“H: Read M -> S” (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 39,
    "label": "39 · Sprint-out dir.",
    "call": "ACE Gun LEFT ROCK SPRINT-OUT LASH DIG FY-MESH H-FLAT",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Sprint-out dir."
     },
     {
      "k": "Tipo",
      "v": "Sprint-out (MESH)"
     },
     {
      "k": "Formação",
      "v": "ACE Gun Left (Y TE à esquerda)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "ROCK"
     },
     {
      "k": "Ponto de ataque",
      "v": "Sprint-out para a direita"
     }
    ],
    "tasks": {
     "QB": "Sprint-out para a direita. Ordem: H 1, X 2, Y 3, Z 4; F com CD.",
     "H": "Flat para a direita. Marca 1 (M e S pintados com a sua cor).",
     "F": "Cruzamento curto do MESH para a esquerda. Marca CD.",
     "X": "LASH: vertical e quebra para fora. Marca 2.",
     "Z": "DIG (4) da esquerda para a direita. Marca 4.",
     "Y": "Cruzamento do MESH para a direita. Marca 3.",
     "LT": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "LG": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "C": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "RG": "ROCK: Slide Lock para a direita (um homem do lado man).",
     "RT": "ROCK: Slide Lock para a direita (um homem do lado man)."
    },
    "diagramNotes": [
     "Ordem X, Z: X LASH, Z DIG.",
     "LASH não está definido no playbook (ver questões)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 0 (playbook: MESH)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Pressão do lado do sprint-out (análise)."
     },
     {
      "k": "Ajuste",
      "v": "ROCK: Slide Lock para a direita, o lado do sprint-out (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "bom"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "dagger",
  "title": "DAGGER / SEAMS · 35 / 36",
  "concept": "Conceitos: Double Seams (35), DAGGER (36). Par por análise: no 35, Seam do F + Dig do X à esquerda é a estrutura do DAGGER.",
  "variants": [
   {
    "n": 35,
    "label": "35 · Esquerda",
    "call": "ACE Gun REX 4 DRAG DOUBLE SEAMS",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Passe (dropback)"
     },
     {
      "k": "Formação",
      "v": "ACE Gun"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "REX"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: F 1, X 2, Z 3 (HOT); Y é Alert; H com CD.",
     "H": "Check (W pintado com a sua cor) e Flat esquerda. Marca CD.",
     "F": "Seam. Marca 1.",
     "X": "4 (Dig). Marca 2.",
     "Z": "DRAG. Marca 3 e HOT (S pintado com a sua cor).",
     "Y": "Seam. Marca AL.",
     "LT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "LG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "C": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RG": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man.",
     "RT": "REX: Half Slide para a direita. O slide começa no 1.º OL livre do backside; à esquerda dele, man."
    },
    "diagramNotes": [
     "Seam do F + Dig do X à esquerda: a estrutura do DAGGER (análise)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 1 e Cover 3 (MOFC): os Seams dividem o safety (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 2: os Seams têm de ajustar e é preciso checkdown (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Z é o HOT no Drag; H dá check e sai para CD (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "bom"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 36,
    "label": "36 · Direita",
    "call": "Trey BOB DRAG FZ-DAGGER Y-SQUARE",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Direita"
     },
     {
      "k": "Tipo",
      "v": "Passe (DAGGER)"
     },
     {
      "k": "Formação",
      "v": "Trey"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "BOB"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "3 Step. Ordem: Z 1, Y 2; F é Alert; X com CD.",
     "H": "Check (W pintado com a sua cor).",
     "F": "Seam do DAGGER. Marca AL.",
     "X": "DRAG. Marca CD.",
     "Z": "Vertical e Dig para dentro. Marca 1.",
     "Y": "5 (Square) para fora. Marca 2. HOT contra o S (pintado com a sua cor): tracejado curto para fora.",
     "LT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "LG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "C": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par)."
    },
    "diagramNotes": [
     "DAGGER (playbook): vertical do recetor de dentro + Dig fundo (12–15 jardas) do de fora."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 e Cover 3 (playbook: DAGGER)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 4: menos eficaz (playbook: DAGGER)."
     },
     {
      "k": "Ajuste",
      "v": "Y é o HOT contra o S; 3 Step (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "bom"
     },
     {
      "label": "C4",
      "grade": "mau"
     }
    ]
   }
  ]
 },
 {
  "id": "rota",
  "title": "Chamadas por rota · 40",
  "concept": "Conceitos: FLOW DART (40). Sem conceito do playbook no nome.",
  "variants": [
   {
    "n": 40,
    "label": "40 · Esquerda",
    "call": "ACE Gun BOB FLOW DART Y-2 F-LASH H-CREASE",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Passe (FLOW)"
     },
     {
      "k": "Formação",
      "v": "ACE Gun"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "BOB"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Ordem: X 1, H 2, F 3; Y e Z com PSR.",
     "H": "CREASE: sai curto para a esquerda. Marca 2.",
     "F": "LASH: vertical e quebra para fora, fundo. Marca 3.",
     "X": "Rota curta para fora. Marca 1.",
     "Z": "Curta para dentro. Marca PSR.",
     "Y": "2 (Slant) com stem vertical. Marca PSR.",
     "LT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "LG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "C": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RG": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par).",
     "RT": "BOB (Big on Big): man no seu DL; a OL fica com os DL (+ o Mike em frente par)."
    },
    "diagramNotes": [
     "FLOW, DART, LASH e CREASE não estão definidos no playbook (ver questões).",
     "Três níveis à esquerda (X, H, F): parecido com um Flood (análise)."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Cover 2 / Quarters: três níveis à esquerda, como um Flood (análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook para FLOW."
     },
     {
      "k": "Ajuste",
      "v": "Y e Z com PSR (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "bom"
     }
    ]
   }
  ]
 },
 {
  "id": "tunnel",
  "title": "Tunnel e lateral · 23 / 25 / 26 / 37",
  "concept": "Conceitos: Tunnel, Lateral, Fake Tunnel",
  "variants": [
   {
    "n": 23,
    "label": "23 · Esquerda",
    "call": "Trio X-TUNNEL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Esquerda"
     },
     {
      "k": "Tipo",
      "v": "Tunnel"
     },
     {
      "k": "Formação",
      "v": "Trio (esquerda)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (RG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Lateral ao X, pela esquerda"
     }
    ],
    "tasks": {
     "QB": "Lateral (tunnel) ao X.",
     "H": "Passo para a direita; bloqueia na zona do RG.",
     "F": "Bloqueia o W.",
     "X": "Recua, recebe o lateral e sobe por dentro (tracejado).",
     "Z": "Bloqueia o W, com o F.",
     "Y": "Bloqueia o E (direita).",
     "LT": "Solta e bloqueia o C (esquerda).",
     "LG": "Solta e bloqueia o FS.",
     "C": "Sem bloqueio desenhado.",
     "RG": "Pull para a esquerda até à zona do M.",
     "RT": "Bloqueia o C (direita), em arco."
    },
    "diagramNotes": [],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesa que fecha por dentro no tunnel (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0 com pressão de fora (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Usar pouco (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 25,
    "label": "25 · Bunch",
    "call": "Trio Bunch X-TUNNEL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Bunch"
     },
     {
      "k": "Tipo",
      "v": "Tunnel"
     },
     {
      "k": "Formação",
      "v": "Trio Bunch"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (RG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Lateral ao Z (bunch)"
     }
    ],
    "tasks": {
     "QB": "Lateral (tracejado) ao Z, atrás do bunch.",
     "H": "Contorna por fora do LT e bloqueia na zona do M.",
     "F": "Bloqueia o W.",
     "X": "Bloqueia o W.",
     "Z": "Recebe o lateral e sobe (tracejado).",
     "Y": "Bloqueia o E (direita).",
     "LT": "Bloqueia o C (esquerda).",
     "LG": "Bloqueia o FS.",
     "C": "Sem bloqueio desenhado.",
     "RG": "Pull para a esquerda até ao M.",
     "RT": "Bloqueia o C (direita), em arco."
    },
    "diagramNotes": [
     "O nome diz X-TUNNEL, mas quem recebe o lateral é o Z."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesa que fecha por dentro no tunnel (playbook)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Cover 0 com pressão de fora (análise)."
     },
     {
      "k": "Ajuste",
      "v": "O lateral vai ao Z (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 26,
    "label": "26 · Lateral",
    "call": "Spread FREE SLOT LATERAL G-PULL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Lateral"
     },
     {
      "k": "Tipo",
      "v": "Lateral"
     },
     {
      "k": "Formação",
      "v": "Spread"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Run blocking (LG pull)"
     },
     {
      "k": "Ponto de ataque",
      "v": "Lateral ao F, pela esquerda"
     }
    ],
    "tasks": {
     "QB": "Lateral ao F (slot esquerdo, atrás da LOS).",
     "H": "Sobe pelo lado direito (a cinzento).",
     "F": "Recebe o lateral e sobe pela esquerda.",
     "X": "Bloqueia na direção do FS.",
     "Z": "Bloqueia o C (direita).",
     "Y": "Bloqueia o SS.",
     "LT": "Bloqueia o W.",
     "LG": "Pull para a esquerda e lead até ao C (esquerda).",
     "C": "Sobe ao M.",
     "RG": "Bloqueia na zona do M (a cinzento).",
     "RT": "Bloqueia o E (direita)."
    },
    "diagramNotes": [
     "Só F, X e LG estão a cores; o resto está a cinzento."
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesa que persegue o fluxo (playbook: Reverses)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Defesa que lê o lateral (playbook)."
     },
     {
      "k": "Ajuste",
      "v": "Usar pouco (playbook)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "mau"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   },
   {
    "n": 37,
    "label": "37 · Fake (passe)",
    "call": "Trio Bunch FAKE-Z-TUNNEL",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Fake (passe)"
     },
     {
      "k": "Tipo",
      "v": "Fake Tunnel (passe)"
     },
     {
      "k": "Formação",
      "v": "Trio Bunch"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Não indicada"
     },
     {
      "k": "Ponto de ataque",
      "v": "Pump fake ao Z, passe"
     }
    ],
    "tasks": {
     "QB": "“PUMP FAKE to Z. Throw to F or X.”",
     "H": "Bloqueia o E (esquerda).",
     "F": "“Fake Block and Go.”",
     "X": "“Fake Block and Split Safeties.”",
     "Z": "Move-se por trás do F para vender o tunnel.",
     "Y": "“Try to bait Safety”: vertical e volta.",
     "LT": "Bloqueia em frente (diagrama).",
     "LG": "Bloqueia em frente (diagrama).",
     "C": "Bloqueia em frente (diagrama).",
     "RG": "Bloqueia em frente (diagrama).",
     "RT": "Bloqueia em frente (diagrama)."
    },
    "diagramNotes": [],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Safeties que mordem o tunnel; o X divide os safeties (diagrama; leitura análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Defesa paciente no tunnel (análise)."
     },
     {
      "k": "Ajuste",
      "v": "Pump fake ao Z; lança ao F ou ao X (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "bom"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 },
 {
  "id": "dois-pontos",
  "title": "2 pontos: Fake Wedge · 38",
  "concept": "Conceitos: Fake Wedge",
  "variants": [
   {
    "n": 38,
    "label": "38 · Meio",
    "call": "* FAKE Wedge",
    "keyValues": [
     {
      "k": "Lado",
      "v": "Meio"
     },
     {
      "k": "Tipo",
      "v": "2 pontos: Fake Wedge (passe)"
     },
     {
      "k": "Formação",
      "v": "Goal line (X na LOS, I atrás do QB)"
     },
     {
      "k": "Motion",
      "v": "—"
     },
     {
      "k": "Protecção",
      "v": "Não indicada"
     },
     {
      "k": "Ponto de ataque",
      "v": "Passe"
     }
    ],
    "tasks": {
     "QB": "Cadência do diagrama. Sem números de leitura.",
     "H": "A verde-azulado: bloqueio no backside.",
     "F": "Tracejado até ao RT e Flat para a direita.",
     "X": "A verde-azulado, na LOS: bloqueio no backside.",
     "Z": "Rota funda em diagonal para a direita.",
     "Y": "Sobe ~10 jardas e quebra para fora.",
     "LT": "Bloqueio em frente (Wedge).",
     "LG": "Bloqueio em frente (Wedge).",
     "C": "Bloqueio em frente (Wedge).",
     "RG": "Bloqueio em frente (Wedge).",
     "RT": "Bloqueio em frente (Wedge)."
    },
    "diagramNotes": [
     "“FREEZE UNTIL -> HERE WE GO! CALL. Then SNAP on SET!”",
     "“EASY! EASY! CALL -> RUN NORMAL WEDGE.”"
    ],
    "vsDefense": [
     {
      "k": "vs defesa: melhor",
      "v": "Defesa que fecha por dentro contra o Wedge (análise)."
     },
     {
      "k": "vs defesa: pior",
      "v": "Sem dado no playbook."
     },
     {
      "k": "Ajuste",
      "v": "FREEZE até “HERE WE GO!”; snap no SET (diagrama)."
     }
    ],
    "matrix": [
     {
      "label": "4-3",
      "grade": "ok"
     },
     {
      "label": "3-4",
      "grade": "ok"
     },
     {
      "label": "Over",
      "grade": "ok"
     },
     {
      "label": "Under",
      "grade": "ok"
     },
     {
      "label": "C0",
      "grade": "ok"
     },
     {
      "label": "C1",
      "grade": "ok"
     },
     {
      "label": "C2",
      "grade": "ok"
     },
     {
      "label": "C3",
      "grade": "ok"
     },
     {
      "label": "C4",
      "grade": "ok"
     }
    ]
   }
  ]
 }
];

export const POSITION_TASKS: Partial<Record<Position, PositionTask[]>> = (() => {
  const map: Partial<Record<Position, PositionTask[]>> = {};
  const seen = new Set<string>();
  for (const d of PLAY_DETAILS) for (const v of d.variants) {
    (Object.keys(v.tasks) as Position[]).forEach((pos) => {
      const key = pos + ':' + v.n;
      if (seen.has(key)) return;
      seen.add(key);
      (map[pos] ??= []).push({ n: v.n, task: v.tasks[pos]! });
    });
  }
  for (const pos of Object.keys(map) as Position[]) map[pos]!.sort((a, b) => a.n - b.n);
  return map;
})();

export const MATRIX_GRADES: { n: number; grades: { label: string; grade: Grade }[] }[] =
  PLAY_DETAILS.flatMap((d) => d.variants.map((v) => ({ n: v.n, grades: v.matrix })))
    .filter((row, i, arr) => arr.findIndex((x) => x.n === row.n) === i)
    .sort((a, b) => a.n - b.n);

export const MATRIX: MatrixRow[] = MATRIX_GRADES.map((row) => ({
  n: row.n,
  bom: row.grades.filter((g) => g.grade === 'bom' && g.label.startsWith('C')).map((g) => g.label as MatrixRow['bom'][number]),
  mau: row.grades.filter((g) => g.grade === 'mau' && g.label.startsWith('C')).map((g) => g.label as MatrixRow['mau'][number]),
}));

export const CHANGES: { state: string; plays: string; what: string }[] = [
  { state: 'Igual', plays: '33 jogadas (algumas com número novo)',
    what: 'Livro de 3 nov → livro de 6 nov: 1→1, 2→2, 3→5, 5→4, 6→6, 7→9, 8→7, 9→10, 11–17 iguais, 19→21, 20→22, 21→23, 22→24, 23→25, 24→26, 25→29, 26→30, 27→27, 28→28 (sem “Copy”), 33→31 (chamada reordenada: LEX X-NASTY; Z com MOR), 34→32, 36→34, 37→35, 38→36, 39→37, 40→38, 41→39, 42→40.' },
  { state: 'Mudou', plays: '3, 18, 33',
    what: '3 (era o 4): DIVE passa a DUO. 18: Z-fly-Wide passa a Z-WORM; “QB: BEWARE! W is Unblocked”. 33 (era o 35): “F-HORNET 8” passa a “X-NASTY-DINO F-HORNET”; “H: READ M -> S”. Tarefas afectadas marcadas por validar.' },
  { state: 'Novas', plays: '8, 19, 20',
    what: '8: Trey F-JET Fk-Z-TUNNEL 40 DUO (DRAW). 19: I-Big LEFT BOB FK-45 POWER 4 8 9 H-FLAT. 20: Trips Bunch PISTOL LEX FK-43-DIVE X-SHALLOW 84 F-WHEEL. Só chamada e texto do diagrama; tarefas por validar.' },
  { state: 'Saem', plays: '5 do livro de 3 nov',
    what: '10 (Trey F-TANGO 40 DIVE Y-SPILL), 29 (Trey Wing LEFT REX F-ZIP-WHEEL SWIRL 2 SEAM), 30 (Trey Wing REX F-TICK XF-SHIV DRAGON H-FLAT), 31 (Trey LEFT X-NASTY LEX DINO 4 9 F-0 H-CHECK-STAB), 32 (Spread F-TANGO BOB SMASH BOW H-FLAT).' },
];
