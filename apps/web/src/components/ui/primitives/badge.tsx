import { cn } from '../../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual variant. Domain variants (`offense`, `available`, `new`, …)
   * are also accepted so tactical badges reuse the same primitive.
   */
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'ghost'
    | 'link'
    | 'success'
    | 'warning'
    // Domain variants
    | 'offense'
    | 'defense'
    | 'st'
    | 'new'
    | 'available'
    | 'unavailable'
    | 'injured'
    | 'retired'
    | 'position'
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn('ui-badge', className)}
      {...props}
    >
      {children}
    </span>
  )
}
