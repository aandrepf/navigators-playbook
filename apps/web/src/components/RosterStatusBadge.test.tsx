import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RosterStatusBadge } from './RosterStatusBadge'

describe('RosterStatusBadge', () => {
  it.each([
    ['disponivel', 'Disponível', 'available'],
    ['indisponivel', 'Indisponível', 'unavailable'],
    ['lesionado', 'Lesionado', 'injured'],
    ['reformado', 'Reformado', 'retired'],
  ] as const)('renders %s status badge', (status, label, variant) => {
    render(<RosterStatusBadge status={status} />)

    const badge = screen.getByText(label)
    expect(badge).toHaveAttribute('data-slot', 'badge')
    expect(badge).toHaveAttribute('data-variant', variant)
  })

  it('shows return date when injured', () => {
    render(<RosterStatusBadge status="lesionado" returnDate="30/11" />)
    expect(screen.getByText(/30\/11/i)).toBeInTheDocument()
  })
})
