import { cn } from '../../../lib/utils'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Marks the entire field as invalid. */
  invalid?: boolean
  /** Disables the field visually. */
  disabled?: boolean
}

export function Field({
  invalid,
  disabled,
  children,
  className,
  ...props
}: FieldProps) {
  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn('ui-field', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface FieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function FieldLabel({
  children,
  className,
  ...props
}: FieldLabelProps) {
  return (
    <label data-slot="field-label" className={cn('ui-field__label', className)} {...props}>
      {children}
    </label>
  )
}

export interface FieldHintProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FieldHint({
  children,
  className,
  ...props
}: FieldHintProps) {
  return (
    <p data-slot="field-hint" className={cn('ui-field__hint', className)} {...props}>
      {children}
    </p>
  )
}

export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FieldError({
  children,
  className,
  ...props
}: FieldErrorProps) {
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn('ui-field__error', className)}
      {...props}
    >
      {children}
    </p>
  )
}
