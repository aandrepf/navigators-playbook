import { useNavigate } from 'react-router-dom'

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  actionTo,
}: {
  title: string
  subtitle: string
  actionLabel?: string
  actionTo?: string
}) {
  const navigate = useNavigate()

  return (
    <div className="empty-state-box">
      <div style={{ fontSize: '2.25rem', marginBottom: 'var(--space-2)' }} aria-hidden="true">
        🏈
      </div>
      <h2 className="section-title">{title}</h2>
      <p
        className="section-subtitle"
        style={{ maxWidth: 440, margin: 'var(--space-2) auto var(--space-4)' }}
      >
        {subtitle}
      </p>
      {actionLabel && actionTo && (
        <button type="button" className="btn btn--primary" onClick={() => navigate(actionTo)}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
