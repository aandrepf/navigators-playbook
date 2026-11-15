import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { UnitBadge } from '../components/UnitBadge'

export function Playbook() {
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
    return <LoadingState label="Carregando playbook" />
  }

  return (
    <section aria-labelledby="playbook-title" className="stack-md">
      <div className="section-header" data-slot="section-heading">
        <div>
          <h2 id="playbook-title" className="section-title" data-slot="section-heading-title">
            Playbook do Time
          </h2>
          <p className="section-subtitle" data-slot="section-heading-body">
            Jogadas estruturadas por unidade, formação, situação e atribuição por posição.
          </p>
        </div>
        {state.status === 'authenticated' && state.user.role === 'staff' && (
          <div data-slot="section-heading-actions">
            <button type="button" className="btn btn--primary">
              + Criar jogada
            </button>
          </div>
        )}
      </div>

      <div className="card" data-slot="card">
        <div className="form-group" data-slot="field" style={{ marginBottom: 0 }}>
          <label htmlFor="playbook-search" className="form-label" data-slot="field-label">
            Buscar jogada por nome:
          </label>
          <input
            type="search"
            id="playbook-search"
            className="form-input"
            data-slot="field-input"
            placeholder="Ex.: Flood Right, Inside Zone, Return..."
          />
        </div>
      </div>

      <div className="split-master-detail">
        <div className="stack-sm">
          <article className="card card--highlight" data-slot="card" data-variant="highlight">
            <div className="card__header" data-slot="card-header">
              <div className="badge-row">
                <span className="badge badge--new" data-slot="badge" data-variant="new">NOVO • v3</span>
                <UnitBadge unit="ofensiva" />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                3rd & 6–10
              </span>
            </div>
            <h3 className="card__title" data-slot="card-title">Flood Right Z-Post</h3>
            <p className="card__meta" data-slot="card-content">Formação: <strong>Shotgun Trips Right</strong></p>
          </article>

          <article className="card" data-slot="card">
            <div className="card__header" data-slot="card-header">
              <div className="badge-row">
                <span className="badge badge--new" data-slot="badge" data-variant="new">NOVO • v2</span>
                <UnitBadge unit="special_teams" />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Kickoff
              </span>
            </div>
            <h3 className="card__title" data-slot="card-title">Return Left Wedge Wall</h3>
            <p className="card__meta" data-slot="card-content">Formação: <strong>Kickoff Return Left</strong> • Visível para todo o time</p>
          </article>
        </div>

        <div className="card" data-slot="card">
          <div className="card__header" data-slot="card-header">
            <div>
              <div className="badge-row" style={{ marginBottom: 'var(--space-1)' }}>
                <span className="badge badge--new" data-slot="badge" data-variant="new">NOVIDADE NÃO ESTUDADA</span>
                <UnitBadge unit="ofensiva" />
                <span className="badge badge--position" data-slot="badge" data-variant="position">Versão atual: v3</span>
              </div>
              <h3 className="section-title" data-slot="card-title">Flood Right Z-Post</h3>
              <p className="card__meta" data-slot="card-content">
                <strong>Formação:</strong> Shotgun Trips Right • <strong>Situação:</strong> 3rd & 6–10
              </p>
            </div>
            <button type="button" className="btn btn--primary">
              ✓ Marcar que estudei esta jogada
            </button>
          </div>

          <h4 style={{ margin: 'var(--space-4) 0 var(--space-2) 0', fontSize: 'var(--text-base)' }}>
            Atribuições de Todas as Posições
          </h4>
          <div className="assignment-list">
            <div className="assignment-item assignment-item--mine">
              <div>
                <span className="badge badge--position" data-slot="badge" data-variant="position">WR-Z</span>
                <div style={{ fontSize: 11, color: 'var(--color-brand-primary)', fontWeight: 700, marginTop: 2 }}>
                  SUA POSIÇÃO
                </div>
              </div>
              <div>
                <strong>Rota Z-Post (18–20 jardas):</strong> Saída externa forçando o CB a abrir quadril; quebrar aos 14
                jardas em Post atacando o terço profundo central.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
