import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children?: ReactNode;
  emptyText?: string;
}

/** Acordeão nativo (<details>), cabeçalho ≥52px. */
export function CollapsibleSection({ title, defaultOpen = false, children, emptyText }: Props) {
  return (
    <details className="collapsible" open={defaultOpen}>
      <summary className="collapsible__summary">
        <span>{title}</span>
        <Icon name="chevron" size={22} />
      </summary>
      <div className="collapsible__body">
        {children ?? <p className="muted-note">{emptyText ?? 'Conteúdo por extrair do livro.'}</p>}
      </div>
    </details>
  );
}
