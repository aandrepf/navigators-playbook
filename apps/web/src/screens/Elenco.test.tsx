import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Elenco } from './Elenco'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'
import { mockStaff, mockUser } from '../mocks/handlers'

function renderWithRouter(ui: React.ReactElement, route = '/elenco') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Elenco', () => {
  it('renders roster for staff', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockStaff })
      }),
    )

    renderWithRouter(<Elenco />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /elenco/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /registrar jogador/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/buscar jogador/i)).toBeInTheDocument()
    expect(screen.getByText(/rafael costa/i)).toBeInTheDocument()
  })

  it('shows restricted empty state for player', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockUser })
      }),
    )

    renderWithRouter(<Elenco />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /acesso restrito/i })).toBeInTheDocument()
    })
  })
})
