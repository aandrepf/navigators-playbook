import { cn } from '../../../lib/utils'
import { Button } from './button'

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual emphasis. */
  variant?: 'default' | 'highlight' | 'warning'
  /** Banner title. */
  title?: string
  /** Banner description / body. */
  description?: string
  /** Label for the dismiss button; when provided the banner can be closed. */
  dismissLabel?: string
  /** Callback when the dismiss button is pressed. */
  onDismiss?: () => void
}

export function Banner({
  variant = 'default',
  title,
  description,
  dismissLabel,
  onDismiss,
  children,
  className,
  ...props
}: BannerProps) {
  return (
    <div
      data-slot="banner"
      data-variant={variant}
      role="region"
      className={cn('ui-banner', className)}
      {...props}
    >
      <div className="ui-banner__content">
        {title && <h2 className="ui-banner__title">{title}</h2>}
        {description && <p className="ui-banner__description">{description}</p>}
        {children}
      </div>
      {dismissLabel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="ui-banner__dismiss"
          aria-label={dismissLabel}
        >
          {dismissLabel}
        </Button>
      )}
    </div>
  )
}
