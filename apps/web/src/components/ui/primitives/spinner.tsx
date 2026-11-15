import { cn } from '../../../lib/utils'

export interface SpinnerProps {
  /** Accessible label for the loading state. */
  label?: string
  /** Visual size of the spinner. */
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

const SIZE_STYLES = {
  sm: { width: 16, height: 16, strokeWidth: 3 },
  default: { width: 20, height: 20, strokeWidth: 2.5 },
  lg: { width: 28, height: 28, strokeWidth: 2.5 },
} as const

export function Spinner({
  label = 'Carregando…',
  size = 'default',
  className,
}: SpinnerProps) {
  const { width, height, strokeWidth } = SIZE_STYLES[size]

  return (
    <span
      data-slot="spinner"
      className={cn('ui-spinner', className)}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      role="status"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
  )
}
