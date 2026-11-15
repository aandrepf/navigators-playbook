import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { UnitBadge } from '../components/UnitBadge'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SectionHeading,
} from '../components/ui'

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
      <SectionHeading
        title="Navigators FA vs. Tritões FA"
        body="Dom, 24/11/2026 • Kickoff 10:00 (America/Sao_Paulo) • Estádio Municipal"
      >
        <div className="badge-row">
          <UnitBadge unit="special_teams" />
          <Badge variant="available">Prazo: Sex 22/11 • 10:00</Badge>
        </div>
      </SectionHeading>

      <div className="grid-2col">
        <Card>
          <CardHeader>
            <CardTitle>Marcação de Disponibilidade</CardTitle>
            <CardDescription>
              Informe sua disponibilidade para este jogo. A recusa exige justificativa visível apenas
              para o staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="btn-row">
              <Button variant="success" aria-pressed="false">
                Disponível — Vou
              </Button>
              <Button variant="destructive" aria-pressed="false">
                Indisponível — Não vou
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Game Plan</CardTitle>
              <CardDescription>Jogadas escolhidas para o confronto</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="stack-sm">
            <div className="gameplan-item" data-slot="card" data-variant="highlight">
              <div className="gameplan-order-num">1</div>
              <div>
                <strong>Flood Right Z-Post</strong>
                <div className="gameplan-note">
                  Ajuste: atacar Cover 3 do Tritões com leitura alta-baixa.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
