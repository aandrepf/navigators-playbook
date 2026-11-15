import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { UnitBadge } from '../components/UnitBadge'

export function Evento() {
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
    return <LoadingState label="Carregando detalhes do evento" />
  }

  return (
    <section aria-labelledby="evento-title" className="stack-md">
      <div className="section-header" data-slot="section-heading">
        <div>
          <div className="badge-row" style={{ marginBottom: 'var(--space-1)' }}>
            <UnitBadge unit="ofensiva" />
            <span className="badge badge--available" data-slot="badge" data-variant="available">ESTADO: ATIVO</span>
            <span className="badge badge--unavailable" data-slot="badge" data-variant="unavailable">
              Prazo de resposta: 15/11 às 14:00 (24h antes)
            </span>
          </div>
          <h2 id="evento-title" className="section-title" data-slot="section-heading-title">
            Treino Tático — Instalação Red Zone
          </h2>
          <p className="section-subtitle" data-slot="section-heading-body">
            Sáb, 16/11/2026 • 14:00–17:00 (America/Sao_Paulo) • Campo Suplementar Sul
          </p>
        </div>
      </div>

      <div className="grid-2col">
        <div className="card" data-slot="card">
          <h3 className="card__title" data-slot="card-title">Minha Resposta de Presença</h3>
          <p className="card__meta" data-slot="card-content" style={{ marginTop: 'var(--space-1)' }}>
            Você pode mudar sua resposta livremente enquanto o prazo não vencer. A recusa exige justificativa visível apenas
            para o staff.
          </p>
          <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
            <button type="button" className="btn btn--success" aria-pressed="false">
              ✓ Vou ao treino
            </button>
            <button type="button" className="btn btn--danger" aria-pressed="false">
              ✕ Não vou (Justificar)
            </button>
          </div>
        </div>

        <div className="card" data-slot="card">
          <div className="card__header" data-slot="card-header">
            <div>
              <h3 className="card__title" data-slot="card-title">Participantes do Treino</h3>
              <p className="card__meta" data-slot="card-content">
                Por privacidade, justificativas pessoais nunca aparecem para jogadores.
              </p>
            </div>
          </div>
          <div className="stack-sm">
            <div
              className="assignment-item"
              style={{ gridTemplateColumns: '1fr auto' }}
            >
              <div>
                <strong>Gabriel Rocha</strong> <span className="badge badge--position" data-slot="badge" data-variant="position">QB</span>
              </div>
              <span className="badge badge--available" data-slot="badge" data-variant="available">Confirmado</span>
            </div>
            <div
              className="assignment-item"
              style={{ gridTemplateColumns: '1fr auto' }}
            >
              <div>
                <strong>Diego Almeida</strong> <span className="badge badge--position" data-slot="badge" data-variant="position">LB</span>
              </div>
              <span className="badge badge--retired" data-slot="badge" data-variant="retired">Ausente</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
