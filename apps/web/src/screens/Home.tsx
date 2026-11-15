import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { UnitBadge } from '../components/UnitBadge'
import { PwaInstallBanner } from '../components/PwaInstallBanner'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SectionHeading,
} from '../components/ui'
import type { User } from '../api/client'

export function Home() {
  const { state } = useAuth()
  const navigate = useNavigate()

  if (state.status === 'loading') {
    return <LoadingState label="Carregando home" />
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
        <Card variant="warning">
          <CardHeader>
            <div>
              <Badge variant="unavailable">APROVAÇÃO DE STAFF PENDENTE</Badge>
              <CardTitle style={{ marginTop: 'var(--space-1)' }}>
                Cadastros de staff aguardam sua aprovação
              </CardTitle>
            </div>
            <Button variant="default" size="sm" onClick={() => navigate('/elenco')}>
              Revisar no Elenco →
            </Button>
          </CardHeader>
          <CardContent style={{ margin: 0 }}>
            Acesse a tela Elenco para aprovar ou recusar novos membros do staff.
          </CardContent>
        </Card>
      )}

      <div className="grid-2col">
        <div className="stack-md">
          <div id="home-title">
            <SectionHeading
              title="Próximos Eventos"
              body="Responda antes do prazo para atualizar presença e marcação"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="badge-row">
                <UnitBadge unit="ofensiva" />
                <Badge variant="outline">Prazo: Sex 15/11 • 14:00</Badge>
              </div>
              <Badge variant="unavailable">Sem resposta</Badge>
            </CardHeader>
            <CardTitle>Treino Tático — Instalação Red Zone</CardTitle>
            <CardDescription>
              Sáb, 16/11/2026 • 14:00 às 17:00 • Campo Suplementar Sul
            </CardDescription>
            <CardFooter>
              <Button variant="success" size="sm">
                Vou ao treino
              </Button>
              <Button variant="destructive" size="sm">
                Não vou (justificar)
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="stack-md">
          <SectionHeading
            title="Novidades do Playbook"
            body="Jogadas visíveis atualizadas desde seu último estudo"
            justification="space-between"
          >
            <Button variant="outline" size="sm" onClick={() => navigate('/playbook')}>
              Abrir Playbook
            </Button>
          </SectionHeading>

          <Card variant="highlight">
            <CardHeader>
              <div className="badge-row">
                <Badge variant="new">NOVO • v3</Badge>
                <UnitBadge unit="ofensiva" />
                <Badge variant="position">Shotgun Trips Right</Badge>
              </div>
              <span className="situation">3rd & 6–10</span>
            </CardHeader>
            <CardTitle>Flood Right Z-Post</CardTitle>
            <CardDescription>
              Sua atribuição (<strong>WR-Z</strong>): Rota Post profunda (18–20 jardas) atacando o
              terço médio contra Cover 3.
            </CardDescription>
          </Card>
        </div>
      </div>
    </section>
  )
}

function PendingStaffHome({ user }: { user: User }) {
  const navigate = useNavigate()

  return (
    <Card variant="warning" aria-labelledby="pending-staff-heading">
      <CardContent>
        <div className="badge-row" style={{ marginBottom: 'var(--space-3)' }}>
          <Badge variant="unavailable">Aguardando aprovação do Head Coach</Badge>
        </div>
        <h2 id="pending-staff-heading" className="section-title" data-slot="section-heading-title">
          Seu cadastro como Staff está pendente
        </h2>
        <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
          Você solicitou acesso no papel de <strong>Staff ({formatSubRoles(user.subRoles)})</strong>.
          Por segurança do playbook e proteção das justificativas e status de lesão do elenco, seu
          acesso de edição e leitura restrita será liberado assim que um{' '}
          <strong>Head Coach</strong> aprovar sua conta.
        </p>
        <div className="btn-row" style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="secondary" onClick={() => navigate('/perfil')}>
            Falar com o staff
          </Button>
        </div>
      </CardContent>
    </Card>
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
