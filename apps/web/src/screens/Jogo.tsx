import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { UnitBadge } from '../components/UnitBadge'

export function Jogo() {
  const { state } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (state.status === 'authenticated' && state.user.approvalState === 'pendente') {
    return (
      <EmptyState
        title="Acesso bloqueado"
        subtitle="Seu cadastro como staff ainda está pendente de aprovação. Aguarde a liberação de um Head Coach."
      />
    )
  }

  if (loading) {
    return <LoadingState label="Carregando dados do jogo" />
  }

  return (
    <section aria-labelledby="jogo-title" className="stack-md">
      <div className="section-header" data-slot="section-heading">
        <div>
          <div className="badge-row" style={{ marginBottom: 'var(--space-1)' }}>
            <UnitBadge unit="special_teams" />
            <span className="badge badge--available" data-slot="badge" data-variant="available">Prazo: Sex 22/11 • 10:00</span>
          </div>
          <h2 id="jogo-title" className="section-title" data-slot="section-heading-title">
            Navigators FA vs. Tritões FA
          </h2>
          <p className="section-subtitle" data-slot="section-heading-body">
            Dom, 24/11/2026 • Kickoff 10:00 (America/Sao_Paulo) • Estádio Municipal
          </p>
        </div>
      </div>

      <div className="grid-2col">
        <div className="card" data-slot="card">
          <h3 className="card__title" data-slot="card-title">Marcação de Disponibilidade</h3>
          <p className="card__meta" data-slot="card-content" style={{ marginTop: 'var(--space-1)' }}>
            Informe sua disponibilidade para este jogo. A recusa exige justificativa visível apenas para o staff.
          </p>
          <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
            <button type="button" className="btn btn--success" aria-pressed="false">
              Disponível — Vou
            </button>
            <button type="button" className="btn btn--danger" aria-pressed="false">
              Indisponível — Não vou
            </button>
          </div>
        </div>

        <div className="card" data-slot="card">
          <div className="card__header" data-slot="card-header">
            <div>
              <h3 className="card__title" data-slot="card-title">Game Plan</h3>
              <p className="card__meta" data-slot="card-content">Jogadas escolhidas para o confronto</p>
            </div>
          </div>
          <div className="stack-sm">
            <div className="gameplan-item" data-slot="card" data-variant="highlight">
              <div className="gameplan-order-num">1</div>
              <div>
                <strong>Flood Right Z-Post</strong>
                <div className="gameplan-note">Ajuste: atacar Cover 3 do Tritões com leitura alta-baixa.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
