import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithAuth, server } from './test/test-utils'
import { http, HttpResponse } from 'msw'

describe('App shell', () => {
  it('shows authentication screen when user is not logged in', async () => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )

    renderWithAuth(<App />, { route: '/' })

    expect(await screen.findByRole('heading', { name: /playbook do time/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar com código por e-mail/i })).toBeInTheDocument()
  })

  it('redirects authenticated player to home and shows 5 navigation items', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    const nav = screen.getByRole('navigation', { name: /navegação principal mobile/i })
    expect(nav).toBeInTheDocument()
    expect(nav.children).toHaveLength(5)
    expect(screen.queryByRole('link', { name: /elenco/i })).not.toBeInTheDocument()
  })

  it('shows 6 navigation items for staff including Elenco', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({
          user: {
            id: 'usr-2',
            email: 'coach@navigators.fa',
            name: 'Carlos Eduardo',
            role: 'staff',
            approvalState: 'ativo',
            subRoles: ['head_coach'],
          },
        })
      }),
    )

    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    const nav = screen.getByRole('navigation', { name: /navegação principal mobile/i })
    expect(nav.children).toHaveLength(6)
    expect(screen.getByRole('navigation', { name: /navegação principal mobile/i }).children).toHaveLength(6)
  })
})

describe('Authentication flow', () => {
  beforeEach(() => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )
  })

  it('allows player to sign in with email code and choose positions', async () => {
    const user = userEvent.setup()
    renderWithAuth(<App />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))

    await user.type(screen.getByLabelText(/código do time/i), 'NAVIGATORS-2026')
    await user.type(screen.getByLabelText(/nome completo/i), 'Rafael Costa')
    await user.type(screen.getByLabelText(/e-mail/i), 'rafael@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    expect(await screen.findByText(/verifique seu e-mail/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar$/i }))

    expect(await screen.findByText(/como você participa do time/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /jogador/i }))

    await waitFor(() => {
      expect(screen.getByText(/unidades e posições/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /ofensiva/i }))
    await user.click(screen.getByRole('button', { name: /wr/i }))
    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })
  })

  it('shows pending state for new staff registration', async () => {
    const user = userEvent.setup()
    renderWithAuth(<App />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: /entrar com código por e-mail/i }))
    await user.type(screen.getByLabelText(/código do time/i), 'NAVIGATORS-2026')
    await user.type(screen.getByLabelText(/nome completo/i), 'Marcos Viana')
    await user.type(screen.getByLabelText(/e-mail/i), 'marcos@navigators.fa')
    await user.click(screen.getByRole('button', { name: /receber código de 6 dígitos/i }))

    await user.type(screen.getByLabelText(/código de verificação/i), '123456')
    await user.click(screen.getByRole('button', { name: /continuar$/i }))

    await user.click(screen.getByRole('button', { name: /staff/i }))

    await user.click(screen.getByRole('radio', { name: /coordenador defensivo/i }))
    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    expect(await screen.findByText(/cadastro pendente/i)).toBeInTheDocument()
  })
})

describe('Screen states', () => {
  it('renders loading state while session is being checked', () => {
    renderWithAuth(<App />, { route: '/' })
    expect(screen.getByLabelText(/verificando sessão/i)).toBeInTheDocument()
  })

  it('renders error state when session request fails', async () => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    renderWithAuth(<App />, { route: '/' })

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
