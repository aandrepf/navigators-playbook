import { cn } from '../../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid and applies error styles. */
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      data-state={props.disabled ? 'disabled' : error ? 'error' : undefined}
      aria-invalid={error || undefined}
      className={cn('ui-input', className)}
      {...props}
    />
  )
}
