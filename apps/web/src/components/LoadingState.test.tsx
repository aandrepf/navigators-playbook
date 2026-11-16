import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  it('renders skeleton cards with accessible loading label', () => {
    render(<LoadingState label="Carregando eventos" />)

    expect(screen.getByLabelText(/carregando eventos/i)).toHaveAttribute('aria-busy', 'true')
    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-slot="card"]').length).toBe(2)
  })
})
