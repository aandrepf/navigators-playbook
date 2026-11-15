import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Jogo } from './Jogo'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'
import { mockPendingStaff } from '../mocks/handlers'

function renderWithRouter(ui: React.ReactElement, route = '/jogo') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Jogo', () => {
  it('renders game heading, availability and game plan', async () => {
    renderWithRouter(<Jogo />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /navigators fa vs\. tritões fa/i }),
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/marcação de disponibilidade/i)).toBeInTheDocument()
    expect(screen.getByText(/game plan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /disponível — vou/i })).toBeInTheDocument()
  })

  it('shows empty state for pending staff', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockPendingStaff })
      }),
    )

    renderWithRouter(<Jogo />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /acesso bloqueado/i })).toBeInTheDocument()
    })
  })
})
