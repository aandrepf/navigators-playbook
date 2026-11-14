import { CALL_BY_NUMBER, PLAY_DETAILS, POSITION_TASKS, SHARED_RULES } from '../data/playbook';
import type { Position, PositionTask } from '../data/types';
import { NumBadge } from './PlayCard';

/** Tarefas da posição escolhida. Usa a lista completa se existir; senão, as fichas de jogada. */
export function PositionTasks({ position }: { position: Position }) {
  const full = POSITION_TASKS[position];
  const fromDetails: PositionTask[] = PLAY_DETAILS.flatMap((d) =>
    d.variants.flatMap((v) => (v.tasks[position] ? [{ n: v.n, task: v.tasks[position]! }] : [])),
  );
  const tasks = full ?? fromDetails;
  const rules = SHARED_RULES[position] ?? [];

  return (
    <>
      <ol className="tasklist">
        {tasks.map((t) => (
          <li key={t.n} className="tasklist__item">
            <div className="tasklist__head">
              <NumBadge n={t.n} />
              <span className="call">{CALL_BY_NUMBER[t.n]}</span>
            </div>
            <p className="tasklist__task">{t.task}</p>
          </li>
        ))}
      </ol>
      {rules.length > 0 && (
        <>
          <h3 className="sub-title">Regras de protecção partilhadas</h3>
          <div className="stack">
            {rules.map((r) => (
              <div key={r.key + r.plays.join()} className="rule">
                <div className="rule__head"><span className="mono strong navy">{r.key}</span> · {r.plays.join(' · ')}</div>
                <p className="strong">{r.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
