import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { RosterStatusBadge } from '../components/RosterStatusBadge'

export function Elenco() {
  const { state } = useAuth()

  if (state.status === 'authenticated' && state.user.role !== 'staff') {
    return (
      <EmptyState
        title="Acesso restrito"
        subtitle="A tela Elenco é exclusiva do staff. Jogadores podem consultar companheiros de unidade pelo Perfil."
      />
    )
  }

  if (state.status === 'authenticated' && state.user.approvalState === 'pendente') {
    return (
      <EmptyState
        title="Acesso bloqueado"
        subtitle="Seu cadastro como staff ainda está pendente de aprovação. Aguarde a liberação de um Head Coach."
      />
    )
  }

  if (state.status === 'loading') {
    return <LoadingState label="Carregando elenco" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.error} onRetry={() => window.location.reload()} />
  }

  return (
    <section aria-labelledby="elenco-title" className="stack-md">
      <div className="section-header" data-slot="section-heading">
        <div>
          <h2 id="elenco-title" className="section-title" data-slot="section-heading-title">
            Elenco
          </h2>
          <p className="section-subtitle" data-slot="section-heading-body">Lista completa do time com posições, unidades e status do elenco.</p>
        </div>
        <div data-slot="section-heading-actions">
          <button type="button" className="btn btn--primary">
            + Registrar jogador
          </button>
        </div>
      </div>

      <div className="card" data-slot="card">
        <div className="form-group" data-slot="field" style={{ marginBottom: 0 }}>
          <label htmlFor="elenco-search" className="form-label" data-slot="field-label">
            Buscar jogador:
          </label>
          <input type="search" id="elenco-search" className="form-input" data-slot="field-input" placeholder="Nome ou posição..." />
        </div>
      </div>

      <div className="stack-sm">
        <div className="assignment-item" data-slot="card" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Rafael Costa</strong> <span className="badge badge--position" data-slot="badge" data-variant="position">WR / KR</span>
            <div className="card__meta tabular" data-slot="card-content">Taxa de comparecimento: 92% (11/12 treinos)</div>
          </div>
          <RosterStatusBadge status="disponivel" />
        </div>
        <div className="assignment-item" data-slot="card" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Diego Almeida</strong> <span className="badge badge--position" data-slot="badge" data-variant="position">LB</span>
            <div className="card__meta tabular" data-slot="card-content">Taxa de comparecimento: 83% (10/12 treinos)</div>
          </div>
          <RosterStatusBadge status="lesionado" returnDate="30/11" />
        </div>
      </div>
    </section>
  )
}
