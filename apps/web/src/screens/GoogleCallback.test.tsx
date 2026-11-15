import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { GoogleCallback } from './GoogleCallback'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'

function renderWithRouter(ui: React.ReactElement, route = '/auth/google/callback?code=abc') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('GoogleCallback', () => {
  beforeEach(() => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )
  })

  it('shows loading state while confirming login', () => {
    renderWithRouter(<GoogleCallback />)
    expect(screen.getByLabelText(/confirmando login com google/i)).toBeInTheDocument()
  })

  it('shows error alert for Google access_denied error', async () => {
    renderWithRouter(<GoogleCallback />, '/auth/google/callback?error=access_denied')

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/você cancelou o login com google/i)
    })
  })
})
