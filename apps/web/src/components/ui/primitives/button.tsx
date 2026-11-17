import { cn } from '../../../lib/utils'
import { Spinner } from './spinner'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant mapped to `data-variant`. */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'destructive'
    | 'success'
  /** Size variant mapped to `data-size`. */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** When true, the button shows a spinner and becomes aria-busy. */
  loading?: boolean
  /** Accessible label used while loading. */
  loadingLabel?: string
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  loadingLabel = 'Carregando…',
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={props.type ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn('ui-btn', className)}
      {...props}
    >
      {loading && (
        <Spinner
          size={size === 'sm' ? 'sm' : 'default'}
          label={loadingLabel}
          className="ui-btn__spinner"
        />
      )}
      <span
        className={cn('ui-btn__label', loading && 'ui-btn__label--hidden')}
        aria-hidden={loading || undefined}
      >
        {children}
      </span>
    </button>
  )
}
