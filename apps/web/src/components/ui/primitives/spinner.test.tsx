import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with role status and data-slot', () => {
    render(<Spinner />)

    const spinner = document.querySelector('[data-slot="spinner"]')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('role', 'status')
  })

  it('uses the provided accessible label', () => {
    render(<Spinner label="Salvando presença" />)
    expect(document.querySelector('[data-slot="spinner"]')).toHaveAttribute(
      'aria-label',
      'Salvando presença',
    )
  })
})
