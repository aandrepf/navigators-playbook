import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders with data-slot', () => {
    render(<Input placeholder="Nome" />)
    expect(screen.getByPlaceholderText('Nome')).toHaveAttribute('data-slot', 'input')
  })

  it('marks aria-invalid and data-state=error when error is true', () => {
    render(<Input error placeholder="E-mail" />)
    const input = screen.getByPlaceholderText('E-mail')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('data-state', 'error')
  })

  it('marks data-state=disabled when disabled', () => {
    render(<Input disabled placeholder="Bloqueado" />)
    expect(screen.getByPlaceholderText('Bloqueado')).toHaveAttribute('data-state', 'disabled')
  })
})
