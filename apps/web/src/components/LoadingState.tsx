export function LoadingState({ label }: { label: string }) {
  return (
    <div className="state-panel" aria-live="polite" aria-busy="true" aria-label={label}>
      <div className="card stack-md">
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--sm" />
      </div>
      <div className="card stack-md" style={{ marginTop: 'var(--space-4)' }}>
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    </div>
  )
}
