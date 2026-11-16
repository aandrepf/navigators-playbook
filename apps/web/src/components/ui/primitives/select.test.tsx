import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './select'

describe('Select', () => {
  it('renders with data-slot', () => {
    render(<Select options={[{ value: 'a', label: 'Opção A' }]} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'select')
  })

  it('renders options and placeholder', () => {
    render(
      <Select
        placeholder="Escolha"
        options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
        ]}
      />,
    )

    expect(screen.getByRole('option', { name: 'Escolha' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Sim' })).toHaveAttribute('value', 'sim')
    expect(screen.getByRole('option', { name: 'Não' })).toHaveAttribute('value', 'nao')
  })

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <Select
        onChange={handleChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    )

    await user.selectOptions(screen.getByRole('combobox'), 'b')
    expect(handleChange).toHaveBeenCalled()
  })
})
