import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UnitBadge } from './UnitBadge'

describe('UnitBadge', () => {
  it.each([
    ['ofensiva', 'OFENSIVA', 'offense'],
    ['defesa', 'DEFESA', 'defense'],
    ['special_teams', 'SPECIAL TEAMS', 'st'],
  ] as const)('renders %s unit badge', (unit, label, variant) => {
    render(<UnitBadge unit={unit} />)

    const badge = screen.getByText(label)
    expect(badge).toHaveAttribute('data-slot', 'badge')
    expect(badge).toHaveAttribute('data-variant', variant)
  })
})
