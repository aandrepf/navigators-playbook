import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field, FieldError, FieldHint, FieldLabel } from './field'

describe('Field', () => {
  it('renders label, hint and error with correct data-slots', () => {
    render(
      <Field data-testid="field">
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <FieldHint>Usado para login</FieldHint>
        <FieldError>E-mail inválido</FieldError>
      </Field>,
    )

    expect(screen.getByTestId('field')).toHaveAttribute('data-slot', 'field')
    expect(screen.getByText('E-mail')).toHaveAttribute('data-slot', 'field-label')
    expect(screen.getByText('Usado para login')).toHaveAttribute('data-slot', 'field-hint')

    const error = screen.getByText('E-mail inválido')
    expect(error).toHaveAttribute('data-slot', 'field-error')
    expect(error).toHaveAttribute('role', 'alert')
  })

  it('flags invalid and disabled states via data attributes', () => {
    const { rerender } = render(<Field data-testid="field" />)
    expect(screen.getByTestId('field')).not.toHaveAttribute('data-invalid')

    rerender(<Field data-testid="field" invalid />)
    expect(screen.getByTestId('field')).toHaveAttribute('data-invalid', 'true')

    rerender(<Field data-testid="field" disabled />)
    expect(screen.getByTestId('field')).toHaveAttribute('data-disabled', 'true')
  })
})
