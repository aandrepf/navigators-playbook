import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders with data-slot and data-variant', () => {
    render(<Badge variant="offense">OFENSIVA</Badge>)

    const badge = screen.getByText('OFENSIVA')
    expect(badge).toHaveAttribute('data-slot', 'badge')
    expect(badge).toHaveAttribute('data-variant', 'offense')
  })

  it.each([
    ['default'],
    ['secondary'],
    ['outline'],
    ['destructive'],
    ['ghost'],
    ['link'],
    ['success'],
    ['warning'],
    ['offense'],
    ['defense'],
    ['st'],
    ['new'],
    ['available'],
    ['unavailable'],
    ['injured'],
    ['retired'],
    ['position'],
  ] as const)('supports variant %s', (variant) => {
    render(<Badge variant={variant}>Label</Badge>)
    expect(screen.getByText('Label')).toHaveAttribute('data-variant', variant)
  })
})
