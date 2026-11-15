import { cn } from '../../../lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Marks the field as invalid and applies error styles. */
  error?: boolean
  /** Placeholder option shown when no value is selected. */
  placeholder?: string
  options?: SelectOption[]
}

export function Select({
  error,
  placeholder,
  options,
  children,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      data-slot="select"
      data-state={props.disabled ? 'disabled' : error ? 'error' : undefined}
      aria-invalid={error || undefined}
      className={cn('ui-select', className)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options?.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  )
}
