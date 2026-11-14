import { useMemo, useState } from 'react';
import type { GroupId, PlayGroup } from '../data/types';
import { PlayCard } from './PlayCard';

type Filter = GroupId | 'todos';

/** Índice agrupado com filtro "Grupo". */
export function PlayIndex({ groups }: { groups: PlayGroup[] }) {
  const [filter, setFilter] = useState<Filter>('todos');

  // Cada número tem uma só âncora (#jogada-N): a primeira vez que aparece.
  const anchorsByPair = useMemo(() => {
    const seen = new Set<number>();
    const map = new Map<string, Set<number>>();
    for (const g of groups) for (const pair of g.pairs) {
      const dup = new Set<number>();
      for (const p of pair.plays) { if (seen.has(p.n)) dup.add(p.n); else seen.add(p.n); }
      map.set(pair.id, dup);
    }
    return map;
  }, [groups]);

  return (
    <>
      <label className="select">
        <span className="select__label">Grupo</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
          <option value="todos">Todos os grupos</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
      </label>
      {groups.filter((g) => filter === 'todos' || g.id === filter).map((g) => (
        <div key={g.id} className="index-group">
          <h3 className="group-title">{g.title}</h3>
          <div className="card-grid">
            {g.pairs.map((pair) => <PlayCard key={pair.id} pair={pair} anchoredElsewhere={anchorsByPair.get(pair.id)} />)}
          </div>
        </div>
      ))}
    </>
  );
}
