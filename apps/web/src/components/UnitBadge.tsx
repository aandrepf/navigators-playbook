import { Badge, type BadgeProps } from './ui'

type Unit = 'ofensiva' | 'defesa' | 'special_teams'

const UNIT_CONFIG: Record<Unit, { label: string; variant: BadgeProps['variant'] }> = {
  ofensiva: { label: 'OFENSIVA', variant: 'offense' },
  defesa: { label: 'DEFESA', variant: 'defense' },
  special_teams: { label: 'SPECIAL TEAMS', variant: 'st' },
}

export function UnitBadge({ unit }: { unit: Unit }) {
  const config = UNIT_CONFIG[unit]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
