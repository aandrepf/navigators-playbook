import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { TopBar } from './TopBar'
import { Badge, Avatar } from './ui'

const PLAYER_NAV = [
  { to: '/', label: 'Home' },
  { to: '/evento', label: 'Evento' },
  { to: '/playbook', label: 'Playbook' },
  { to: '/jogo', label: 'Jogo' },
  { to: '/perfil', label: 'Perfil' },
] as const

const STAFF_NAV = [
  ...PLAYER_NAV.slice(0, 4),
  { to: '/elenco', label: 'Elenco' },
  { to: '/perfil', label: 'Perfil' },
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
              <span>Navigators</span>
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
                  <span className="nav-item-btn__label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {user && (
          <div className="sidebar-profile-card" data-slot="profile-card">
            <Avatar alt={user.name ?? user.email} size="default" />
            <div data-slot="profile-card-details">
              <span data-slot="profile-card-name">{user.name ?? user.email}</span>
              <span data-slot="profile-card-body">
                {user.role === 'staff' ? 'Staff' : 'Jogador'}
                {user.subRoles.length > 0 && ` • ${user.subRoles.join(', ')}`}
              </span>
            </div>
            {isPending ? (
              <Badge variant="unavailable">Pendente</Badge>
            ) : (
              <Badge variant="available">Ativo</Badge>
            )}
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
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
