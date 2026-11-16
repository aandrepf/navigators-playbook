import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithAuth, server } from './test/test-utils'
import { http, HttpResponse } from 'msw'

const googleErrorSearch = '?error=access_denied'

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
            phone: null,
            role: 'staff',
            approvalState: 'ativo',
            isAdmin: false,
            subRoles: ['head_coach'],
            positions: [],
            units: [],
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
      expect(screen.getByRole('heading', { name: /suas posições/i })).toBeInTheDocument()
    })

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

describe('Google login regression', () => {
  beforeEach(() => {
    server.use(
      http.get('/auth/session', () => {
        return new HttpResponse(null, { status: 401 })
      }),
    )
  })

  it('shows accessible feedback when Google login is unavailable', async () => {
    server.use(
      http.get('/auth/google', () => {
        return HttpResponse.json({ error: 'Login com Google não configurado' }, { status: 503 })
      }),
    )

    const user = userEvent.setup()
    renderWithAuth(<App />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: /entrar com google/i }))

    const alert = await screen.findByRole('alert', {}, { timeout: 2000 })
    expect(alert).toHaveTextContent(/login com google não configurado/i)
  })

  it('shows accessible feedback when Google returns an error parameter', async () => {
    renderWithAuth(<App />, { route: `/auth/google/callback${googleErrorSearch}` })

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/você cancelou o login com google/i)
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('shows accessible feedback for access_denied redirect at root', async () => {
    renderWithAuth(<App />, { route: '/?login=erro&motivo=access_denied' })

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/você cancelou o login com google/i)
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })
})

describe('Design system data-slot', () => {
  it('renders app shell with data-slot and responsive navigation', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    expect(document.querySelector('[data-slot="app-shell"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="bottom-nav"]')).toBeInTheDocument()
  })

  it('renders cards and badges with data-slot on Home', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    expect(document.querySelectorAll('[data-slot="card"]').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-slot="badge"]').length).toBeGreaterThan(0)
    expect(document.querySelector('[data-slot="section-heading"]')).toBeInTheDocument()
  })

  it('renders UnitBadge and RosterStatusBadge with data-variant', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({
          user: {
            id: 'usr-2',
            email: 'coach@navigators.fa',
            name: 'Carlos Eduardo',
            phone: null,
            role: 'staff',
            approvalState: 'ativo',
            isAdmin: false,
            subRoles: ['head_coach'],
            positions: [],
            units: [],
          },
        })
      }),
    )

    renderWithAuth(<App />, { route: '/elenco' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /elenco/i })).toBeInTheDocument()
    })

    const badges = document.querySelectorAll('[data-slot="badge"]')
    expect(badges.length).toBeGreaterThan(0)
    expect(Array.from(badges).some((b) => b.getAttribute('data-variant') === 'position')).toBe(true)
    expect(Array.from(badges).some((b) => b.getAttribute('data-variant') === 'available')).toBe(true)
  })

  it('requires data-slot and data-variant on every badge', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    const allBadges = document.querySelectorAll('[data-slot="badge"]')
    expect(allBadges.length).toBeGreaterThan(0)
    for (const badge of Array.from(allBadges)) {
      expect(badge).toHaveAttribute('data-slot', 'badge')
      expect(badge).toHaveAttribute('data-variant')
    }
  })

  it('does not render icons inside badges', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({
          user: {
            id: 'usr-2',
            email: 'coach@navigators.fa',
            name: 'Carlos Eduardo',
            phone: null,
            role: 'staff',
            approvalState: 'ativo',
            isAdmin: false,
            subRoles: ['head_coach'],
            positions: [],
            units: [],
          },
        })
      }),
    )

    renderWithAuth(<App />, { route: '/elenco' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /elenco/i })).toBeInTheDocument()
    })

    const iconGlyphs = /[\u2713\u2715\u0021\u2605\u23F3\u{1F4F2}\u2694\u{1F6E1}\u{1F9B6}\u002B\u2014]/u
    const allBadges = document.querySelectorAll('[data-slot="badge"]')
    expect(allBadges.length).toBeGreaterThan(0)
    for (const badge of Array.from(allBadges)) {
      expect(badge.textContent).not.toMatch(iconGlyphs)
    }
  })

  it('does not render icons inside any button', async () => {
    server.use(
      http.get('/auth/session', () => {
        return HttpResponse.json({
          user: {
            id: 'usr-2',
            email: 'coach@navigators.fa',
            name: 'Carlos Eduardo',
            phone: null,
            role: 'staff',
            approvalState: 'ativo',
            isAdmin: false,
            subRoles: ['head_coach'],
            positions: [],
            units: [],
          },
        })
      }),
    )

    renderWithAuth(<App />, { route: '/elenco' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /elenco/i })).toBeInTheDocument()
    })

    const iconGlyphs = /[\u2713\u2715\u002B\u271A\u2795\u26A0\u21BB\u2191\u2193\u2190\u2192\u1F514]/u
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    for (const button of buttons) {
      expect(button.textContent).not.toMatch(iconGlyphs)
    }
  })

  it('renders highlighted cards with flat surfaces instead of gradients', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    const highlighted = document.querySelector('[data-variant="highlight"]')
    expect(highlighted).toBeInTheDocument()
    const bgImage = window.getComputedStyle(highlighted!).backgroundImage
    expect(bgImage === 'none' || bgImage === '').toBe(true)
  })

  it('does not use mono font-family anywhere in the rendered app', async () => {
    renderWithAuth(<App />, { route: '/' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    expect(document.querySelector('.mono')).not.toBeInTheDocument()

    const allElements = document.querySelectorAll('*')
    for (const element of Array.from(allElements)) {
      const fontFamily = window.getComputedStyle(element).fontFamily
      expect(fontFamily).not.toMatch(
        /JetBrains Mono|SFMono-Regular|SFMono|Menlo|Monaco|Consolas/i,
      )
    }
  })
})
