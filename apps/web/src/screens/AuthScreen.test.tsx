import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthScreen } from './AuthScreen'
import { renderWithAuth, server } from '../test/test-utils'
import { http, HttpResponse } from 'msw'

function renderWithRouter(ui: React.ReactElement, route = '/login') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('AuthScreen', () => {
  beforeEach(() => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )
  })

  it('starts at welcome step and navigates to email login', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    expect(screen.getByRole('heading', { name: /snapin/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /criar conta ou entrar/i })).toBeInTheDocument()
    })
  })

  it('shows read-only team name instead of team code input', async () => {
    renderWithRouter(<AuthScreen />)

    await userEvent.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    expect(screen.getByText(/Equipe:/i)).toBeInTheDocument()
    expect(screen.getByText(/Navigators/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/código do time/i)).not.toBeInTheDocument()
  })

  it('allows entering name and email', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })
  })
})
