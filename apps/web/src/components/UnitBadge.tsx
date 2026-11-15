type Unit = 'ofensiva' | 'defesa' | 'special_teams'

const UNIT_CONFIG: Record<Unit, { label: string; className: string }> = {
  ofensiva: { label: 'OFENSIVA', className: 'badge--offense' },
  defesa: { label: 'DEFESA', className: 'badge--defense' },
  special_teams: { label: 'SPECIAL TEAMS', className: 'badge--st' },
}

export function UnitBadge({ unit }: { unit: Unit }) {
  const config = UNIT_CONFIG[unit]
  return (
    <span
      className={`badge ${config.className}`}
      data-slot="badge"
      data-variant={
        unit === 'special_teams' ? 'st' : unit === 'ofensiva' ? 'offense' : 'defense'
      }
    >
      {config.label}
    </span>
  )
}
