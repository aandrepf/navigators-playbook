import { useEffect, useState } from 'react';
import type { ChecklistItem } from '../data/types';

const STORAGE_KEY = 'navigators-checklist-v1';

function load(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; }
}

/** Checklist com estado guardado em localStorage. */
export function Checklist({ items }: { items: ChecklistItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch { /* modo privado */ }
  }, [done]);

  const count = items.filter((i) => done[i.id]).length;

  return (
    <>
      <div className="checklist__bar">
        <span className="strong">{count} / {items.length} feitos</span>
        <button type="button" className="btn-ghost" onClick={() => setDone({})} disabled={count === 0}>Limpar</button>
      </div>
      <ul className="checklist">
        {items.map((i) => (
          <li key={i.id}>
            <label className="checklist__item">
              <input type="checkbox" checked={!!done[i.id]} onChange={(e) => setDone((d) => ({ ...d, [i.id]: e.target.checked }))} />
              <span>
                <span className={`checklist__text${done[i.id] ? ' is-done' : ''}`}>{i.text}</span>
                <span className="tag tag--sm">{i.who}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
