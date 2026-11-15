import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { RosterStatusBadge } from '../components/RosterStatusBadge'

export function Perfil() {
  const { state, logout } = useAuth()

  async function handleLogout() {
    await logout()
  }

  if (state.status === 'loading') {
    return <LoadingState label="Carregando perfil" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.error} onRetry={() => window.location.reload()} />
  }

  const user = state.status === 'authenticated' ? state.user : null

  return (
    <section aria-labelledby="perfil-title" className="stack-md">
      <h2 id="perfil-title" className="section-title" data-slot="section-heading-title">
        Perfil
      </h2>

      <div className="grid-2col">
        <div className="stack-md">
          <div className="card" data-slot="card">
            <h3 className="card__title" data-slot="card-title">Identidade e Papel</h3>
            <div className="stack-sm" style={{ marginTop: 'var(--space-3)' }}>
              <div>
                <span className="form-label">Nome:</span>{' '}
                <span>{user?.name || 'Não informado'}</span>
              </div>
              <div>
                <span className="form-label">E-mail:</span>{' '}
                <span>{user?.email}</span>
                <span className="badge badge--available" data-slot="badge" data-variant="available" style={{ marginLeft: 'var(--space-2)' }}>
                  Confirmado
                </span>
              </div>
              <div>
                <span className="form-label">Papel:</span>{' '}
                <span>{user?.role === 'staff' ? 'Staff' : 'Jogador'}</span>
              </div>
              {user?.subRoles && user.subRoles.length > 0 && (
                <div>
                  <span className="form-label">Subpapéis:</span>{' '}
                  <span>{user.subRoles.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {user?.role === 'jogador' && (
            <div className="card" data-slot="card">
              <h3 className="card__title" data-slot="card-title">Meu Status do Elenco</h3>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <RosterStatusBadge status="disponivel" />
              </div>
              <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
                Seu status do elenco é atualizado pelo staff. Caso precise comunicar uma lesão ou mudança cadastral, fale
                com o staff abaixo.
              </p>
            </div>
          )}
        </div>

        <div className="stack-md">
          <div className="card" data-slot="card">
            <h3 className="card__title" data-slot="card-title">Sessão e Privacidade</h3>
            <p className="card__meta" data-slot="card-content" style={{ marginTop: 'var(--space-2)' }}>
              Você permanece conectado entre visitas neste aparelho.
            </p>
            <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn--secondary" onClick={handleLogout}>
                Sair da conta
              </button>
            </div>
          </div>

          <div className="card card--danger" data-slot="card" data-variant="danger">
            <h3 className="card__title" data-slot="card-title">Zona de Perigo</h3>
            <p className="card__meta" data-slot="card-content" style={{ marginTop: 'var(--space-2)' }}>
              A exclusão da conta é irreversível.
            </p>
            <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn--danger">
                Apagar minha conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
