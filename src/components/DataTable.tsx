import type { ReactNode } from 'react';
import type { KeyValue } from '../data/types';

export interface Column<R> {
  key: string;
  header: string;
  render: (row: R) => ReactNode;
  /** Coluna principal: no telemóvel aparece como título da linha empilhada. */
  primary?: boolean;
}

interface DataTableProps<R> {
  columns: Column<R>[];
  rows: R[];
  rowKey: (row: R) => string;
  caption?: string;
  isHighlighted?: (row: R) => boolean;
}

/** Tabela em desktop; linhas empilhadas em mobile (via CSS e data-label). */
export function DataTable<R>({ columns, rows, rowKey, caption, isHighlighted }: DataTableProps<R>) {
  return (
    <table className="dtable">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>{columns.map((c) => <th key={c.key} scope="col">{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={rowKey(r)} className={isHighlighted?.(r) ? 'is-highlighted' : undefined}>
            {columns.map((c) => (
              <td key={c.key} data-label={c.header} className={c.primary ? 'dtable__primary' : undefined}>
                {c.render(r)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Lista chave/valor (dl). */
export function KeyValueList({ rows }: { rows: KeyValue[] }) {
  return (
    <dl className="kv">
      {rows.map((r) => (
        <div className="kv__row" key={r.k}>
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
