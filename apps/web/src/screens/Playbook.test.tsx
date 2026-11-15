import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Playbook } from './Playbook'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'
import { mockPendingStaff, mockStaff } from '../mocks/handlers'

function renderWithRouter(ui: React.ReactElement, route = '/playbook') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Playbook', () => {
  it('renders playbook heading and search field for player', async () => {
    renderWithRouter(<Playbook />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /playbook do time/i })).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/buscar jogada por nome/i)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="card"]').length).toBeGreaterThan(0)
  })

  it('shows create play button for staff', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockStaff })
      }),
    )

    renderWithRouter(<Playbook />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /criar jogada/i })).toBeInTheDocument()
    })
  })

  it('shows empty state for pending staff', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({ user: mockPendingStaff })
      }),
    )

    renderWithRouter(<Playbook />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /acesso bloqueado/i })).toBeInTheDocument()
    })
  })
})
