import type { Question } from '../data/types';

export function StatePill({ state }: { state: Question['state'] }) {
  return <span className={`pill pill--${state}`}>{state}</span>;
}

export function QuestionCard({ q }: { q: Question }) {
  return (
    <article className={`qcard qcard--${q.state}`}>
      <div className="qcard__head">
        <h3 className="qcard__title">{q.point}</h3>
        <StatePill state={q.state} />
      </div>
      <p className="qcard__why">{q.why}</p>
    </article>
  );
}
