import { useState } from 'react';
import { CALL_BY_NUMBER } from '../data/playbook';
import type { Grade } from '../data/types';
import { DataTable } from './DataTable';
import { GradeChip } from './MatrixChips';
import { NumBadge } from './PlayCard';
import { Tabs, toTabs } from './Tabs';

const FRONTS = ['4-3', '3-4', 'Over', 'Under'] as const;
const COVERS = ['C0', 'C1', 'C2', 'C3', 'C4'] as const;
type Mode = 'Cartões' | 'Tabela';
type Axis = 'Frentes' | 'Covers';

export interface MatrixGradeRow {
  n: number;
  grades: { label: string; grade: Grade }[];
}

function gradeOf(row: MatrixGradeRow, label: string): Grade | undefined {
  return row.grades.find((g) => g.label === label)?.grade;
}

export function MatrixView({ rows }: { rows: MatrixGradeRow[] }) {
  const [mode, setMode] = useState<Mode>('Cartões');
  const [axis, setAxis] = useState<Axis>('Covers');
  const labels = axis === 'Frentes' ? [...FRONTS] : [...COVERS];

  return (
    <>
      <div className="two-tabs">
        <Tabs label="Vista" items={toTabs<Mode>(['Cartões', 'Tabela'])} active={mode} onChange={setMode} />
        <Tabs label="Eixo" items={toTabs<Axis>(['Frentes', 'Covers'])} active={axis} onChange={setAxis} />
      </div>
      {mode === 'Cartões' ? (
        <div className="matrix-grid">
          {rows.map((r) => (
            <div className="mrow" key={r.n}>
              <div className="tasklist__head"><NumBadge n={r.n} /><span className="call">{CALL_BY_NUMBER[r.n]}</span></div>
              <div className="chips">
                {labels.map((lab) => {
                  const g = gradeOf(r, lab);
                  return g ? <GradeChip key={lab} grade={g} label={`${lab} ${g}`} /> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="scroll-x">
          <DataTable caption={`Matriz jogadas × ${axis.toLowerCase()}`} rowKey={(r) => String(r.n)} rows={rows}
            columns={[
              { key: 'n', header: 'Nº', primary: true, render: (r) => <NumBadge n={r.n} /> },
              ...labels.map((lab) => ({
                key: lab, header: lab,
                render: (r: MatrixGradeRow) => {
                  const g = gradeOf(r, lab);
                  return g ? <GradeChip grade={g} label={g} /> : <span aria-label="sem avaliação">—</span>;
                },
              })),
            ]} />
        </div>
      )}
    </>
  );
}
