import { useEffect, useRef, useState, type FormEvent } from 'react';
import { POSITIONS, type Position, type Section } from '../data/types';
import { Icon } from './Icon';

interface Props {
  team: string;
  title: string;
  position: Position;
  onPositionChange: (p: Position) => void;
  sections: Section[];
  validNumbers: number[];
}

/** Cabeçalho fixo: posição, chips de secção (com a secção activa) e salto "Ir para nº". */
export function StickyHeader({ team, title, position, onPositionChange, sections, validNumbers }: Props) {
  const [active, setActive] = useState(sections[0].id);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [num, setNum] = useState('');
  const [error, setError] = useState('');
  const chipsRef = useRef<HTMLElement>(null);

  // Secção activa conforme o scroll.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-180px 0px -60% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Mantém o chip activo visível.
  useEffect(() => {
    chipsRef.current?.querySelector(`[data-chip="${active}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [active]);

  const jump = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(num);
    if (!validNumbers.includes(n)) { setError('Não há jogada com esse número.'); return; }
    const el = document.getElementById(`jogada-${n}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.classList.add('flash');
    window.setTimeout(() => el?.classList.remove('flash'), 1600);
    setError(''); setJumpOpen(false); setNum('');
  };

  return (
    <header className="sticky">
      <div className="container">
        <div className="sticky__top">
          <div className="sticky__titles">
            <div className="sticky__team">{team}</div>
            <div className="sticky__title">{title}</div>
          </div>
          <button type="button" className="btn-dark" aria-expanded={jumpOpen} onClick={() => setJumpOpen((o) => !o)}>
            <Icon name="hash" /> Ir para nº
          </button>
        </div>
        {jumpOpen && (
          <form className="jump" onSubmit={jump}>
            <label className="sr-only" htmlFor="jump-n">Número da jogada</label>
            <input id="jump-n" inputMode="numeric" pattern="[0-9]*" autoFocus placeholder={`1 a ${Math.max(...validNumbers)}`} value={num}
              onChange={(e) => setNum(e.target.value)} />
            <button type="submit" className="btn-dark">Ir</button>
            {error && <span className="jump__err" role="alert">{error}</span>}
          </form>
        )}
        <div className="sticky__pos">
          <span className="sticky__label" id="pos-label">Posição</span>
          <div className="seg" role="radiogroup" aria-labelledby="pos-label">
            {POSITIONS.map((p) => (
              <button key={p} type="button" role="radio" aria-checked={p === position}
                className={`seg__btn${p === position ? ' is-active' : ''}`} onClick={() => onPositionChange(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <nav className="chiprow" ref={chipsRef} aria-label="Secções">
          {sections.map((s) => (
            <a key={s.id} id={`chip-${s.id}`} data-chip={s.id} href={`#${s.id}`}
              className={`navchip${s.id === active ? ' is-active' : ''}`} aria-current={s.id === active ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
