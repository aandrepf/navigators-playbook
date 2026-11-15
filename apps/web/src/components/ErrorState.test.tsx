import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders message and retry button', () => {
    const handleRetry = vi.fn()
    render(<ErrorState message="Falha ao carregar" onRetry={handleRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent(/falha ao carregar/i)
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const handleRetry = vi.fn()
    render(<ErrorState message="Falha" onRetry={handleRetry} />)

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })
})
