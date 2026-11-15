import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { UnitBadge } from '../components/UnitBadge'
import { PwaInstallBanner } from '../components/PwaInstallBanner'
import type { User } from '../api/client'

export function Home() {
  const { state } = useAuth()

  if (state.status === 'loading') {
    return <LoadingState label="Carregando painel inicial" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.error} onRetry={() => window.location.reload()} />
  }

  const user = state.status === 'authenticated' ? state.user : null

  if (user?.approvalState === 'pendente') {
    return <PendingStaffHome user={user} />
  }

  return (
    <section aria-labelledby="home-title" className="stack-md">
      <PwaInstallBanner />

      {user?.subRoles.includes('head_coach') && (
        <div className="card card--warning" data-slot="card" data-variant="warning">
          <div className="card__header" data-slot="card-header">
            <div>
              <span className="badge badge--unavailable" data-slot="badge" data-variant="unavailable">! APROVAÇÃO DE STAFF PENDENTE</span>
              <h2 className="card__title" data-slot="card-title" style={{ marginTop: 'var(--space-1)' }}>
                Cadastros de staff aguardam sua aprovação
              </h2>
            </div>
            <a href="/elenco" className="btn btn--primary">
              Revisar no Elenco →
            </a>
          </div>
          <p className="card__meta" data-slot="card-content" style={{ margin: 0 }}>
            Acesse a tela Elenco para aprovar ou recusar novos membros do staff.
          </p>
        </div>
      )}

      <div className="grid-2col">
        <div className="stack-md">
          <div className="section-header" data-slot="section-heading" style={{ marginBottom: 0 }}>
            <div>
              <h2 id="home-title" className="section-title" data-slot="section-heading-title">
                Próximos Eventos
              </h2>
              <p className="section-subtitle" data-slot="section-heading-body">Responda antes do prazo para atualizar presença e marcação</p>
            </div>
          </div>

          <article className="card" data-slot="card">
            <div className="card__header" data-slot="card-header">
              <div className="badge-row">
                <UnitBadge unit="ofensiva" />
                <span className="badge badge--unavailable mono" data-slot="badge" data-variant="unavailable">⏳ Prazo: Sex 15/11 • 14:00</span>
              </div>
              <span className="badge badge--unavailable" data-slot="badge" data-variant="unavailable">! Sem resposta</span>
            </div>
            <h3 className="card__title" data-slot="card-title">Treino Tático — Instalação Red Zone</h3>
            <p className="card__meta" data-slot="card-content">Sáb, 16/11/2026 • 14:00 às 17:00 • Campo Suplementar Sul</p>
            <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn--success">
                ✓ Vou ao treino
              </button>
              <button type="button" className="btn btn--danger">
                ✕ Não vou (justificar)
              </button>
            </div>
          </article>
        </div>

        <div className="stack-md">
          <div className="section-header" data-slot="section-heading" style={{ marginBottom: 0 }}>
            <div>
              <h2 className="section-title" data-slot="section-heading-title">Novidades do Playbook</h2>
              <p className="section-subtitle" data-slot="section-heading-body">Jogadas visíveis atualizadas desde seu último estudo</p>
            </div>
            <div data-slot="section-heading-actions">
              <a href="/playbook" className="btn btn--secondary">
                Abrir Playbook
              </a>
            </div>
          </div>

          <article className="card card--highlight" data-slot="card" data-variant="highlight">
            <div className="card__header" data-slot="card-header">
              <div className="badge-row">
                <span className="badge badge--new" data-slot="badge" data-variant="new">★ NOVO • v3</span>
                <UnitBadge unit="ofensiva" />
                <span className="badge badge--position" data-slot="badge" data-variant="position">Shotgun Trips Right</span>
              </div>
              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                3rd & 6–10
              </span>
            </div>
            <h3 className="card__title" data-slot="card-title">Flood Right Z-Post</h3>
            <p className="card__meta" data-slot="card-content">
              Sua atribuição (<strong>WR-Z</strong>): Rota Post profunda (18–20 jardas) atacando o terço médio contra Cover 3.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

function PendingStaffHome({ user }: { user: User }) {
  return (
    <section className="card card--warning" data-slot="card" data-variant="warning" aria-labelledby="pending-staff-heading">
      <div className="badge-row" style={{ marginBottom: 'var(--space-3)' }}>
        <span className="badge badge--unavailable" data-slot="badge" data-variant="unavailable">! Aguardando aprovação do Head Coach</span>
      </div>
      <h2 id="pending-staff-heading" className="section-title" data-slot="section-heading-title">
        Seu cadastro como Staff está pendente
      </h2>
      <p className="section-subtitle" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
        Você solicitou acesso no papel de <strong>Staff ({formatSubRoles(user.subRoles)})</strong>. Por segurança do playbook e
        proteção das justificativas e status de lesão do elenco, seu acesso de edição e leitura restrita será liberado assim que um{' '}
        <strong>Head Coach</strong> aprovar sua conta.
      </p>
      <div className="btn-row" style={{ marginTop: 'var(--space-4)' }}>
        <a href="/perfil" className="btn btn--secondary">
          Falar com o staff
        </a>
      </div>
    </section>
  )
}

function formatSubRoles(subRoles: User['subRoles']) {
  const labels: Record<string, string> = {
    head_coach: 'Head Coach',
    coordenador_ofensivo: 'Coordenador Ofensivo',
    coordenador_defensivo: 'Coordenador Defensivo',
    coordenador_special_teams: 'Coordenador de Special Teams',
  }
  return subRoles.map((role) => labels[role] || role).join(', ')
}
