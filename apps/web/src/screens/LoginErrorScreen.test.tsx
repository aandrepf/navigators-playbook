import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LoginErrorScreen } from './LoginErrorScreen'
import { renderWithAuth } from '../test/test-utils'

function renderWithRouter(ui: React.ReactElement, route = '/login?login=erro') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('LoginErrorScreen', () => {
  it('renders default error message and retry button', () => {
    renderWithRouter(<LoginErrorScreen />)

    expect(screen.getByRole('alert')).toHaveTextContent(/não foi possível fazer login/i)
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('renders access_denied specific message', () => {
    renderWithRouter(<LoginErrorScreen />, '/login?login=erro&motivo=access_denied')

    expect(screen.getByRole('alert')).toHaveTextContent(/você cancelou o login com google/i)
  })

  it('navigates to login on retry', async () => {
    const user = userEvent.setup()
    renderWithRouter(<LoginErrorScreen />)

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }))
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })
})
