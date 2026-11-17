import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'
import { mockPendingStaff } from '../mocks/handlers'

function renderWithRouter(ui: React.ReactElement, route = '/') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Home', () => {
  it('renders headings and event cards for authenticated player', async () => {
    renderWithRouter(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /novidades do playbook/i })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="card"]').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-slot="badge"]').length).toBeGreaterThan(0)
  })

  it('renders pending staff state without empty sub-role parentheses and allows logout', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockPendingStaff })
      }),
    )

    renderWithRouter(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /seu cadastro como staff está pendente/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/Você solicitou acesso no papel de/i)).toBeInTheDocument()
    expect(screen.queryByText(/Staff \(\)/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Admin ou Head Coach/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument()
  })
})
