import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { TopBar } from './TopBar'

const PLAYER_NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/evento', label: 'Evento', icon: '📋' },
  { to: '/playbook', label: 'Playbook', icon: '📖' },
  { to: '/jogo', label: 'Jogo', icon: '🏟️' },
  { to: '/perfil', label: 'Perfil', icon: '⚙️' },
] as const

const STAFF_NAV = [
  ...PLAYER_NAV.slice(0, 4),
  { to: '/elenco', label: 'Elenco', icon: '👥' },
  { to: '/perfil', label: 'Perfil', icon: '⚙️' },
] as const

function isActive(to: string, pathname: string) {
  if (to === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(to)
}

export function AppShell() {
  const { state } = useAuth()
  const location = useLocation()

  const user = state.status === 'authenticated' ? state.user : null
  const isStaff = user?.role === 'staff'
  const isPending = user?.approvalState === 'pendente'
  const navItems = isStaff ? STAFF_NAV : PLAYER_NAV

  return (
    <div className="app-shell" data-slot="app-shell">
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <nav className="app-sidebar" data-slot="sidebar" aria-label="Navegação principal desktop">
        <div>
          <div className="sidebar-team-header">
            <div className="sidebar-team-name">
              <span aria-hidden="true">⚓</span>
              <span>Navigators FA</span>
            </div>
            <div className="sidebar-user-meta">
              {user ? (
                <>
                  Papel: {user.role === 'staff' ? 'Staff' : 'Jogador'}
                  {isPending && ' • Cadastro Pendente'}
                </>
              ) : (
                'Carregando...'
              )}
            </div>
          </div>

          <ul className="sidebar-nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="nav-item-btn"
                  aria-current={isActive(item.to, location.pathname) ? 'page' : undefined}
                >
                  <span className="nav-item-btn__label">
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {user && user.role === 'jogador' && (
          <div className="card" style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Status do elenco</div>
            <span className="badge badge--available" data-slot="badge" data-variant="available">✓ Disponível</span>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 6 }}>
              Fuso: America/Sao_Paulo
            </div>
          </div>
        )}
      </nav>

      <div className="app-main-wrapper">
        <TopBar />
        <main id="conteudo-principal" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <nav className="app-bottom-nav" data-slot="bottom-nav" aria-label="Navegação principal mobile">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="bottom-nav-btn"
            aria-current={isActive(item.to, location.pathname) ? 'page' : undefined}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
