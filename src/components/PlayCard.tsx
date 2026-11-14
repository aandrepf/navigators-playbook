import type { PlayPair } from '../data/types';

export function NumBadge({ n }: { n: number }) {
  return <span className="badge">{n}</span>;
}

interface Props {
  pair: PlayPair;
  /** Números que já têm âncora noutro cartão (evita ids duplicados). */
  anchoredElsewhere?: Set<number>;
}

/** Cartão de um par/conjunto de jogadas: chamada em mono como herói. */
export function PlayCard({ pair, anchoredElsewhere }: Props) {
  return (
    <article className="pcard">
      <header className="pcard__head">
        <span className="pcard__name">{pair.name}</span>
        <span className="pcard__sub">{pair.subtitle}</span>
      </header>
      <div className="pcard__plays">
        {pair.plays.map((p) => (
          <div className="pcard__play" key={p.n} id={anchoredElsewhere?.has(p.n) ? undefined : `jogada-${p.n}`}>
            <div className="pcard__meta">
              <NumBadge n={p.n} />
              {p.side && <span className="side">{p.side}</span>}
            </div>
            <div className="call call--lg">{p.call}</div>
          </div>
        ))}
      </div>
      <div className="pcard__tags">
        {pair.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
      </div>
    </article>
  );
}
