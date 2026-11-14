export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="error-state-box" role="alert">
      <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>
        ⚠ {message}
      </div>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          ↻ Tentar novamente
        </button>
      )}
    </div>
  )
}
