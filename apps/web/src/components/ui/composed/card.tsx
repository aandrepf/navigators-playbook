import { cn } from '../../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'warning' | 'danger'
  size?: 'default' | 'sm'
}

export function Card({
  variant = 'default',
  size = 'default',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn('ui-card', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: 'left' | 'center'
}

export function CardHeader({
  alignment = 'left',
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      data-alignment={alignment}
      className={cn('ui-card__header', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 data-slot="card-title" className={cn('ui-card__title', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn('ui-card__description', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-content" className={cn('ui-card__content', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-footer" className={cn('ui-card__footer', className)} {...props}>
      {children}
    </div>
  )
}
