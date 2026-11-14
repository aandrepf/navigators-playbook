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
      <div className="section-header">
        <div>
          <h2 id="elenco-title" className="section-title">
            Elenco
          </h2>
          <p className="section-subtitle">Lista completa do time com posições, unidades e status do elenco.</p>
        </div>
        <button type="button" className="btn btn--primary">
          + Registrar jogador
        </button>
      </div>

      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="elenco-search" className="form-label">
            Buscar jogador:
          </label>
          <input type="search" id="elenco-search" className="form-input" placeholder="Nome ou posição..." />
        </div>
      </div>

      <div className="stack-sm">
        <div className="assignment-item" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Rafael Costa</strong> <span className="badge badge--position">WR / KR</span>
            <div className="card__meta tabular">Taxa de comparecimento: 92% (11/12 treinos)</div>
          </div>
          <RosterStatusBadge status="disponivel" />
        </div>
        <div className="assignment-item" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Diego Almeida</strong> <span className="badge badge--position">LB</span>
            <div className="card__meta tabular">Taxa de comparecimento: 83% (10/12 treinos)</div>
          </div>
          <RosterStatusBadge status="lesionado" returnDate="30/11" />
        </div>
      </div>
    </section>
  )
}
