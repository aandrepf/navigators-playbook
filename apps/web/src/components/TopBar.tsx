import { useAuth } from '../hooks/useAuth'

export function TopBar() {
  const { state } = useAuth()

  const user = state.status === 'authenticated' ? state.user : null

  return (
    <header className="mobile-topbar">
      <div>
        <h1 className="mobile-topbar__title">Playbook do Time</h1>
        <div className="mobile-topbar__subtitle">
          {user ? (
            <>
              {user.role === 'staff' ? 'Staff' : 'Jogador'}
              {user.subRoles.length > 0 && ` • ${user.subRoles.join(', ')}`}
            </>
          ) : (
            'Carregando...'
          )}
        </div>
      </div>
      <div className="badge-row">
        {user?.role === 'jogador' && (
          <span className="badge badge--available" data-slot="badge" data-variant="available" title="Seu status do elenco atual">
            Disponível
          </span>
        )}
        {user?.approvalState === 'pendente' && (
          <span className="badge badge--unavailable" data-slot="badge" data-variant="unavailable">Cadastro Pendente</span>
        )}
      </div>
    </header>
  )
}
