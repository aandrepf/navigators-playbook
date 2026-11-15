import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'
import { MemoryRouter, useLocation } from 'react-router-dom'

function LocationSpy({ onLocation }: { onLocation: (path: string) => void }) {
  const location = useLocation()
  onLocation(location.pathname)
  return null
}

function renderWithRouter(ui: React.ReactElement, initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
      <LocationSpy onLocation={() => {}} />
    </MemoryRouter>,
  )
}

describe('EmptyState', () => {
  it('renders title, description and action button', () => {
    renderWithRouter(<EmptyState title="Vazio" subtitle="Nada aqui" actionLabel="Voltar" actionTo="/" />)

    expect(screen.getByRole('heading', { name: /vazio/i })).toBeInTheDocument()
    expect(screen.getByText(/nada aqui/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('navigates to action route when button is clicked', async () => {
    const user = userEvent.setup()
    const spy = vi.fn()
    render(
      <MemoryRouter initialEntries={['/']}>
        <EmptyState title="Vazio" subtitle="Nada aqui" actionLabel="Ir" actionTo="/home" />
        <LocationSpy onLocation={spy} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /ir/i }))
    expect(spy).toHaveBeenLastCalledWith('/home')
  })

  it('does not render action button when action props are absent', () => {
    renderWithRouter(<EmptyState title="Vazio" subtitle="Nada aqui" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
