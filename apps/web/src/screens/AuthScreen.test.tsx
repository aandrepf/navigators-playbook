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

  it('shows read-only team name and no editable team code', async () => {
    renderWithRouter(<AuthScreen />)

    await userEvent.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    expect(screen.queryByLabelText(/código do time/i)).not.toBeInTheDocument()
    expect(screen.getByText(/^Time:$/i)).toBeInTheDocument()
    expect(screen.getByText(/Navigators/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/time atual: navigators/i)).toBeInTheDocument()
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

  it('does not show WhatsApp hint under phone field', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    expect(screen.getByLabelText(/telefone \(opcional\)/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/usaremos este dado para futuras notificações/i),
    ).not.toBeInTheDocument()
  })

  it('shows team name as a plain readonly value without a badge outline', async () => {
    renderWithRouter(<AuthScreen />)

    await userEvent.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    expect(screen.getByText(/^Time:$/i)).toBeInTheDocument()
    expect(screen.getByText(/Navigators/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/time atual: navigators/i)).toBeInTheDocument()
    expect(document.querySelector('[data-slot="badge"]')).not.toBeInTheDocument()
  })

  it('renders role buttons in an accessible group with aria-pressed', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })

    const roleGroup = screen.getByRole('group', { name: /escolha de papel/i })
    expect(roleGroup).toBeInTheDocument()

    const jogadorButton = screen.getByRole('button', { name: /^jogador/i })
    const staffButton = screen.getByRole('button', { name: /^staff/i })

    expect(jogadorButton).toHaveAttribute('aria-pressed', 'false')
    expect(staffButton).toHaveAttribute('aria-pressed', 'false')

    expect(
      screen.getByText(/consulto o playbook e respondo a treinos e jogos/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/acesso sujeito à aprovação de um admin ou head coach/i),
    ).toBeInTheDocument()
  })

  it('navigates back from positions step to role step', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^jogador/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /suas posições/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^voltar$/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })
  })

  it('renders position toggle buttons with at least 44px touch target', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^jogador/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /suas posições/i })).toBeInTheDocument()
    })

    const positionButton = screen.getByRole('button', { name: /^wr$/i })
    expect(positionButton).toHaveClass('position-toggle')
    expect(positionButton).toHaveAttribute('data-size', 'sm')
    expect(positionButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(positionButton)
    await waitFor(() => {
      expect(positionButton).toHaveAttribute('aria-pressed', 'true')
    })
    expect(positionButton).toHaveTextContent('✓ WR')
  })

  it('shows Google button with full visible label', async () => {
    renderWithRouter(<AuthScreen />)
    const googleButton = screen.getByRole('button', { name: /entrar com o google/i })
    expect(googleButton).toBeInTheDocument()
  })

  it('renders back button and error on role step', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/código de verificação/i), '000000')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /^voltar$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^voltar$/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })
  })

  it('shows field error in role step when staff verification fails', async () => {
    const user = userEvent.setup()
    server.use(
      http.post('/auth/email/verify', () => {
        return new HttpResponse(JSON.stringify({ error: 'Erro no servidor' }), { status: 500 })
      }),
    )

    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /como você participa do time/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /^staff/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/erro no servidor/i)
    })
  })

  it('uses tabular-nums mono font for verification code input', async () => {
    const user = userEvent.setup()
    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    const codeInput = screen.getByLabelText(/código de verificação/i)
    expect(codeInput).toHaveClass('mono')
  })

  it('exposes a single main landmark and skip link on the login screen', async () => {
    renderWithRouter(<AuthScreen />)

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /pular para o conteúdo principal/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo-principal')
  })

  it('resends the verification code and shows a success status', async () => {
    const user = userEvent.setup()
    let requestCount = 0
    server.use(
      http.post('/auth/email/request', async ({ request }) => {
        const body = (await request.json()) as { email: string }
        if (body.email === 'reenviar@navigators.fa') {
          requestCount++
        }
        return new HttpResponse(JSON.stringify({ ok: true }), { status: 200 })
      }),
    )

    renderWithRouter(<AuthScreen />)

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'reenviar@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique seu e-mail/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /reenviar código/i }))

    await waitFor(() => {
      expect(requestCount).toBe(2)
    })
    expect(screen.getByRole('status')).toHaveTextContent(/novo código enviado/i)
  })
})
