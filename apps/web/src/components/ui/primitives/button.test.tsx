import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders with data-slot and default variant/size', () => {
    render(<Button>Salvar</Button>)

    const button = screen.getByRole('button', { name: /salvar/i })
    expect(button).toHaveAttribute('data-slot', 'button')
    expect(button).toHaveAttribute('data-variant', 'default')
    expect(button).toHaveAttribute('data-size', 'default')
  })

  it.each([
    ['primary', 'primary'],
    ['secondary', 'secondary'],
    ['outline', 'outline'],
    ['ghost', 'ghost'],
    ['link', 'link'],
    ['destructive', 'destructive'],
    ['success', 'success'],
  ] as const)('applies data-variant=%s', (variant, expected) => {
    render(<Button variant={variant}>Botão</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', expected)
  })

  it('is disabled and has aria-disabled when loading', () => {
    render(<Button loading>Enviar</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(document.querySelector('[data-slot="spinner"]')).toBeInTheDocument()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Clique</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
