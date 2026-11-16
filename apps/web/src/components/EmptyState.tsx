import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, CardDescription, CardTitle } from './ui'

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
    <Card className="empty-state-box">
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="empty-state-box__description">
          {subtitle}
        </CardDescription>
        {actionLabel && actionTo && (
          <Button variant="default" onClick={() => navigate(actionTo)}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
