type IconName = 'chevron' | 'check' | 'x' | 'hash' | 'filter' | 'checkCircle';

const PATHS: Record<IconName, string> = {
  chevron: 'M6 9l6 6 6-6',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  hash: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  filter: 'M3 6h18M7 12h10M10 18h4',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14l-3-3',
};

/** Ícones SVG inline (sem dependências). */
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="icon">
      <path d={PATHS[name]} />
    </svg>
  );
}
