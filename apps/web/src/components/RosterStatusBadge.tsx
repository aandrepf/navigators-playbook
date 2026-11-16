import { Badge, type BadgeProps } from './ui'

export type RosterStatus =
  | 'disponivel'
  | 'indisponivel'
  | 'lesionado'
  | 'reformado'

const STATUS_CONFIG: Record<
  RosterStatus,
  { label: string; variant: BadgeProps['variant'] }
> = {
  disponivel: { label: 'Disponível', variant: 'available' },
  indisponivel: { label: 'Indisponível', variant: 'unavailable' },
  lesionado: { label: 'Lesionado', variant: 'injured' },
  reformado: { label: 'Reformado', variant: 'retired' },
}

export function RosterStatusBadge({
  status,
  returnDate,
}: {
  status: RosterStatus
  returnDate?: string
}) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant}>
      {config.label}
      {status === 'lesionado' && returnDate && (
        <span style={{ marginLeft: 'var(--space-1)' }}>(retorno {returnDate})</span>
      )}
    </Badge>
  )
}
