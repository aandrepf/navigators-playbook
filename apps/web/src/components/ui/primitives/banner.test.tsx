import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Banner } from './banner'

describe('Banner', () => {
  it('renders title, description and data-slot', () => {
    render(<Banner title="Aviso" description="Mensagem importante" />)

    const banner = document.querySelector('[data-slot="banner"]')
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveAttribute('role', 'region')
    expect(screen.getByRole('heading', { name: /aviso/i })).toBeInTheDocument()
    expect(screen.getByText('Mensagem importante')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const handleDismiss = vi.fn()
    render(
      <Banner
        title="Aviso"
        description="Mensagem"
        dismissLabel="Dispensar"
        onDismiss={handleDismiss}
      />,
    )

    await user.click(screen.getByRole('button', { name: /dispensar/i }))
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })
})
