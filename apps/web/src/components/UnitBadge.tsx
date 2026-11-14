type Unit = 'ofensiva' | 'defesa' | 'special_teams'

const UNIT_CONFIG: Record<
  Unit,
  { label: string; className: string; icon: string }
> = {
  ofensiva: { label: 'OFENSIVA', className: 'badge--offense', icon: '⚔️' },
  defesa: { label: 'DEFESA', className: 'badge--defense', icon: '🛡️' },
  special_teams: { label: 'SPECIAL TEAMS', className: 'badge--st', icon: '🦶' },
}

export function UnitBadge({ unit }: { unit: Unit }) {
  const config = UNIT_CONFIG[unit]
  return (
    <span className={`badge ${config.className}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  )
}
