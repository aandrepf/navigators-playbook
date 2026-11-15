export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="error-state-box" role="alert">
      <div className="error-state-box__title">
        {message}
      </div>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
