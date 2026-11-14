export type Position = 'QB' | 'H' | 'F' | 'X' | 'Z' | 'Y' | 'LT' | 'LG' | 'C' | 'RG' | 'RT';
export const POSITIONS: Position[] = ['QB', 'H', 'F', 'X', 'Z', 'Y', 'LT', 'LG', 'C', 'RG', 'RT'];

export type Side = 'Esq' | 'Dir' | 'Esq/Dir' | 'Meio' | null;
export type Cover = 'C0' | 'C1' | 'C2' | 'C3' | 'C4';
export type Grade = 'bom' | 'ok' | 'mau';
export type GroupId = 'inside' | 'outside' | 'pa' | 'boot' | 'passes' | 'especiais';

export interface Play {
  n: number;
  side: Side;
  call: string;
}

export interface PlayPair {
  id: string;
  name: string;
  /** Subtítulo do cartão, ex. "1 Esquerda · 6 Direita" */
  subtitle: string;
  plays: Play[];
  tags: string[];
}

export interface PlayGroup {
  id: GroupId;
  title: string;
  pairs: PlayPair[];
}

/** Tarefa de uma posição numa jogada. */
export interface PositionTask {
  n: number;
  task: string;
}

/** Regra de protecção partilhada por várias jogadas (REX, LEX, BOB…). */
export interface SharedRule {
  key: string;
  plays: number[];
  text: string;
}

export interface KeyValue {
  k: string;
  v: string;
}

export interface Gap {
  numbers: string;
  letter: string;
  where: string;
  technique: string;
}

export interface Shell {
  shell: string;
  covers: string;
  read: string;
}

export interface MatrixRow {
  n: number;
  bom: Cover[];
  mau: Cover[];
}

export interface PlayDetail {
  id: string;
  title: string;
  concept: string;
  variants: {
    n: number;
    label: string;
    call: string;
    keyValues: KeyValue[];
    /** Tarefa por posição; posições sem tarefa ficam undefined. */
    tasks: Partial<Record<Position, string>>;
    diagramNotes: string[];
    vsDefense: KeyValue[];
    matrix: { label: string; grade: Grade }[];
  }[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  who: string;
}

export type QuestionState = 'perguntar' | 'confirmar';

export interface Question {
  point: string;
  why: string;
  state: QuestionState;
}

export interface Section {
  id: string;
  label: string;
}

/** Secção de jogada colapsada: título + regras do conceito tiradas do playbook (não da ficha da jogada). */
export interface CollapsedPlay {
  title: string;
  /** Regras gerais do conceito no playbook. Vazio = o playbook não tem nada. */
  playbook: KeyValue[];
  /** Nota curta sobre o que falta (ficha da jogada, diagrama, tarefas). */
  missing?: string;
}

/** Linha das árvores de rotas (Outside Tree / Inside Tree) do playbook. */
export interface RouteTreeRow {
  n: number;
  outside: string;
  inside: string;
}

/** Motion ou shift do playbook. */
export interface Motion {
  call: string;
  kind: string;
  what: string;
}
