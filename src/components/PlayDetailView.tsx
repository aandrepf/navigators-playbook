import { useState } from 'react';
import { POSITIONS, type PlayDetail, type Position } from '../data/types';
import { CollapsibleSection } from './CollapsibleSection';
import { DataTable, KeyValueList } from './DataTable';
import { GradeChip } from './MatrixChips';
import { Tabs } from './Tabs';
import { Callout } from './Callout';
import { PlayDiagram } from './PlayDiagram';

/** Ficha de uma jogada; destaca a tarefa da posição escolhida. */
export function PlayDetailView({ detail, position, defaultOpen }: { detail: PlayDetail; position: Position; defaultOpen?: boolean }) {
  const [active, setActive] = useState(String(detail.variants[0].n));
  const v = detail.variants.find((x) => String(x.n) === active) ?? detail.variants[0];
  const myTask = v.tasks[position];
  const rows = POSITIONS.filter((p) => v.tasks[p]).map((p) => ({ pos: p, task: v.tasks[p]! }));

  return (
    <CollapsibleSection title={detail.title} defaultOpen={defaultOpen}>
      <p className="strong small">{detail.concept}</p>
      <Tabs label="Variante" items={detail.variants.map((x) => ({ id: String(x.n), label: x.label }))} active={active} onChange={setActive} />
      <div className="call call--xl">{v.call}</div>
      <PlayDiagram key={v.n} n={v.n} call={v.call} />
      <Callout tone="task" title={`A sua tarefa (${position})`}>
        <span className="task-big">{myTask ?? (Object.keys(v.tasks).length === 0 ? 'Por validar: tarefas ainda não extraídas do livro de 6 nov. Veja o diagrama.' : 'Sem tarefa no diagrama para esta posição.')}</span>
      </Callout>
      <KeyValueList rows={v.keyValues} />
      {rows.length > 0 && (
        <>
          <h4 className="sub-title">Posição / Tarefa</h4>
          <DataTable caption="Tarefas por posição" rowKey={(r) => r.pos} rows={rows}
            isHighlighted={(r) => r.pos === position}
            columns={[
              { key: 'pos', header: 'Posição', primary: true, render: (r) => <span className="strong navy">{r.pos}</span> },
              { key: 'task', header: 'Tarefa', render: (r) => r.task },
            ]} />
        </>
      )}
      {v.diagramNotes.length > 0 && <div className="note-box">{v.diagramNotes.map((d) => <p key={d}>{d}</p>)}</div>}
      {v.vsDefense.length > 0 && <KeyValueList rows={v.vsDefense} />}
      {v.matrix.length > 0 && (
        <div className="chips">{v.matrix.map((m) => <GradeChip key={m.label} grade={m.grade} label={`${m.label} ${m.grade}`} />)}</div>
      )}
      {Object.keys(v.tasks).length === 0 && <p className="muted-note">Por validar: jogada nova no livro de 6 nov; só a chamada e o texto do diagrama vêm do livro.</p>}
    </CollapsibleSection>
  );
}
