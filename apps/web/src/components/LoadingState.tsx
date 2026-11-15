import { Card, CardContent, Skeleton } from './ui'

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="state-panel" aria-live="polite" aria-busy="true" aria-label={label}>
      <Card>
        <CardContent className="stack-md">
          <Skeleton size="lg" />
          <Skeleton />
          <Skeleton size="sm" />
        </CardContent>
      </Card>
      <Card className="state-panel__second">
        <CardContent className="stack-md">
          <Skeleton size="lg" />
          <Skeleton />
          <Skeleton />
        </CardContent>
      </Card>
    </div>
  )
}
