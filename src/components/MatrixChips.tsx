import type { Cover, Grade } from '../data/types';
import { Icon } from './Icon';

export function GradeChip({ grade, label }: { grade: Grade; label: string }) {
  return (
    <span className={`chip chip--${grade}`}>
      {grade === 'bom' && <Icon name="check" size={15} />}
      {grade === 'mau' && <Icon name="x" size={15} />}
      {label}
    </span>
  );
}

/** Chips Bom/Mau de uma jogada; lados vazios não aparecem. */
export function MatrixChips({ bom, mau }: { bom: Cover[]; mau: Cover[] }) {
  if (!bom.length && !mau.length) return null;
  return (
    <div className="chips">
      {bom.map((c) => <GradeChip key={`b${c}`} grade="bom" label={`Bom vs ${c}`} />)}
      {mau.map((c) => <GradeChip key={`m${c}`} grade="mau" label={`Mau vs ${c}`} />)}
    </div>
  );
}
