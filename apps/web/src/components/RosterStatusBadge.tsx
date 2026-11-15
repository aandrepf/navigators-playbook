export type RosterStatus =
  | 'disponivel'
  | 'indisponivel'
  | 'lesionado'
  | 'reformado'

const STATUS_CONFIG: Record<RosterStatus, { label: string; className: string }> = {
  disponivel: { label: 'Disponível', className: 'badge--available' },
  indisponivel: { label: 'Indisponível', className: 'badge--unavailable' },
  lesionado: { label: 'Lesionado', className: 'badge--injured' },
  reformado: { label: 'Reformado', className: 'badge--retired' },
}

export function RosterStatusBadge({
  status,
  returnDate,
}: {
  status: RosterStatus
  returnDate?: string
}) {
  const config = STATUS_CONFIG[status]
  const variant =
    status === 'disponivel'
      ? 'available'
      : status === 'indisponivel'
        ? 'unavailable'
        : status === 'lesionado'
          ? 'injured'
          : 'retired'
  return (
    <span className={`badge ${config.className}`} data-slot="badge" data-variant={variant}>
      {config.label}
      {status === 'lesionado' && returnDate && (
        <span style={{ marginLeft: 'var(--space-1)' }}>(retorno {returnDate})</span>
      )}
    </span>
  )
}
