import type { ReactNode } from 'react';
import { Icon } from './Icon';

type Tone = 'neutral' | 'good' | 'task';

export function Callout({ tone = 'neutral', title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <div className={`callout callout--${tone}`}>
      {title && (
        <div className="callout__title">
          {tone === 'good' && <Icon name="checkCircle" size={20} />}
          {title}
        </div>
      )}
      <div className="callout__body">{children}</div>
    </div>
  );
}
