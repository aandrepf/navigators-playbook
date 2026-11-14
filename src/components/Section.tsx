import type { ReactNode } from 'react';

interface Props {
  id: string;
  title?: string;
  subtitle?: string;
  tone?: 'default' | 'surface';
  children: ReactNode;
}

export function Section({ id, title, subtitle, tone = 'default', children }: Props) {
  return (
    <section id={id} className={`section${tone === 'surface' ? ' section--surface' : ''}`} data-section>
      {title && <h2 className="section__title">{title}</h2>}
      {subtitle && <p className="section__subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}
