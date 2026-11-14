export type RosterStatus =
  | 'disponivel'
  | 'indisponivel'
  | 'lesionado'
  | 'reformado'

const STATUS_CONFIG: Record<
  RosterStatus,
  { label: string; className: string; icon: string }
> = {
  disponivel: { label: 'Disponível', className: 'badge--available', icon: '✓' },
  indisponivel: {
    label: 'Indisponível',
    className: 'badge--unavailable',
    icon: '!',
  },
  lesionado: { label: 'Lesionado', className: 'badge--injured', icon: '+' },
  reformado: { label: 'Reformado', className: 'badge--retired', icon: '—' },
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
    <span className={`badge ${config.className}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
      {status === 'lesionado' && returnDate && (
        <span className="mono" style={{ marginLeft: 'var(--space-1)' }}>
          (retorno {returnDate})
        </span>
      )}
    </span>
  )
}
