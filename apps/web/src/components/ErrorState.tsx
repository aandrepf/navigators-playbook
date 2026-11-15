import { Button, Card, CardContent, CardTitle } from './ui'

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Card className="error-state-box" role="alert">
      <CardContent>
        <CardTitle>{message}</CardTitle>
        {onRetry && (
          <div className="error-state-box__actions">
            <Button variant="outline" onClick={onRetry}>
              Tentar novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
