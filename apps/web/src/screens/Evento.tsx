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
      <SectionHeading
        title="Treino Tático — Instalação Red Zone"
        body="Sáb, 16/11/2026 • 14:00–17:00 (America/Sao_Paulo) • Campo Suplementar Sul"
      >
        <div className="badge-row">
          <UnitBadge unit="ofensiva" />
          <Badge variant="available">ESTADO: ATIVO</Badge>
          <Badge variant="outline">Prazo: 15/11 às 14:00 (24h antes)</Badge>
        </div>
      </SectionHeading>

      <div className="grid-2col">
        <Card>
          <CardHeader>
            <CardTitle>Minha Resposta de Presença</CardTitle>
            <CardDescription>
              Você pode mudar sua resposta livremente enquanto o prazo não vencer. A recusa exige
              justificativa visível apenas para o staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="btn-row">
              <Button variant="success" aria-pressed="false">
                Vou
              </Button>
              <Button variant="destructive" aria-pressed="false">
                Não vou
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Participantes do Treino</CardTitle>
              <CardDescription>
                Por privacidade, justificativas pessoais nunca aparecem para jogadores.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="stack-sm">
            <div className="assignment-item" style={{ gridTemplateColumns: '1fr auto' }}>
              <div>
                <strong>Gabriel Rocha</strong>{' '}
                <Badge variant="position">QB</Badge>
              </div>
              <Badge variant="available">Confirmado</Badge>
            </div>
            <div className="assignment-item" style={{ gridTemplateColumns: '1fr auto' }}>
              <div>
                <strong>Diego Almeida</strong>{' '}
                <Badge variant="position">LB</Badge>
              </div>
              <Badge variant="retired">Ausente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
