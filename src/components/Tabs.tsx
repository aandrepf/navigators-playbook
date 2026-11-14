export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}

/** Segmented control acessível (role=tablist), botões ≥44px. */
export function Tabs<T extends string>({ items, active, onChange, label }: TabsProps<T>) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((it) => (
        <button key={it.id} type="button" role="tab" aria-selected={it.id === active}
          className={`tabs__btn${it.id === active ? ' is-active' : ''}`} onClick={() => onChange(it.id)}>
          {it.label}
        </button>
      ))}
    </div>
  );
}

export const toTabs = <T extends string>(ids: readonly T[]): TabItem<T>[] => ids.map((id) => ({ id, label: id }));
