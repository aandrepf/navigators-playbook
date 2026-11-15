import { cn } from '../../../lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual size preset. */
  size?: 'default' | 'sm' | 'lg'
}

export function Skeleton({ size = 'default', className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-size={size}
      className={cn('ui-skeleton', `ui-skeleton--${size}`, className)}
      aria-hidden="true"
      {...props}
    />
  )
}
