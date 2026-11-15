import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Evento } from './Evento'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'
import { mockPendingStaff } from '../mocks/handlers'

function renderWithRouter(ui: React.ReactElement, route = '/evento') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Evento', () => {
  it('renders event details and response buttons', async () => {
    renderWithRouter(<Evento />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /treino tático/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /^vou$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^não vou$/i })).toBeInTheDocument()
    expect(screen.getByText(/participantes do treino/i)).toBeInTheDocument()
  })

  it('shows empty state for pending staff', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockPendingStaff })
      }),
    )

    renderWithRouter(<Evento />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /acesso bloqueado/i })).toBeInTheDocument()
    })
  })
})
