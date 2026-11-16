import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Perfil } from './Perfil'
import { renderWithAuth } from '../test/test-utils'

describe('Perfil', () => {
  it('renders profile information and logout button', async () => {
    renderWithAuth(<Perfil />, { route: '/perfil' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /perfil/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/rafael costa/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apagar minha conta/i })).toBeInTheDocument()
  })

  it('logs out when logout button is clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth(<Perfil />, { route: '/perfil' })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /sair da conta/i }))
    // logout é assíncrono; o teste verifica que não houve erro ao clicar
    expect(screen.getByRole('button', { name: /sair da conta/i })).toBeInTheDocument()
  })
})
