import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { UnitBadge } from '../components/UnitBadge'
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
  SectionHeading,
} from '../components/ui'

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
      <SectionHeading
        title="Playbook"
        body="Jogadas estruturadas por unidade, formação, situação e atribuição por posição."
        justification="space-between"
      >
        {state.status === 'authenticated' && state.user.role === 'staff' && (
          <Button variant="default">Criar jogada</Button>
        )}
      </SectionHeading>

      <Card>
        <Field style={{ marginBottom: 0 }}>
          <FieldLabel htmlFor="playbook-search">Buscar jogada por nome:</FieldLabel>
          <Input
            type="search"
            id="playbook-search"
            placeholder="Ex.: Flood Right, Inside Zone, Return..."
          />
        </Field>
      </Card>

      <div className="split-master-detail">
        <div className="stack-sm">
          <Card variant="highlight">
            <CardHeader>
              <div className="badge-row">
                <Badge variant="new">NOVO • v3</Badge>
                <UnitBadge unit="ofensiva" />
              </div>
              <span className="situation">3rd & 6–10</span>
            </CardHeader>
            <CardTitle>Flood Right Z-Post</CardTitle>
            <CardDescription>
              Formação: <strong>Shotgun Trips Right</strong>
            </CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <div className="badge-row">
                <Badge variant="new">NOVO • v2</Badge>
                <UnitBadge unit="special_teams" />
              </div>
              <span className="situation">Kickoff</span>
            </CardHeader>
            <CardTitle>Return Left Wedge Wall</CardTitle>
            <CardDescription>
              Formação: <strong>Kickoff Return Left</strong> • Visível para todo o time
            </CardDescription>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div>
              <div className="badge-row" style={{ marginBottom: 'var(--space-1)' }}>
                <Badge variant="new">NOVIDADE NÃO ESTUDADA</Badge>
                <UnitBadge unit="ofensiva" />
                <Badge variant="position">Versão atual: v3</Badge>
              </div>
              <CardTitle>Flood Right Z-Post</CardTitle>
              <CardDescription>
                <strong>Formação:</strong> Shotgun Trips Right • <strong>Situação:</strong> 3rd &
                6–10
              </CardDescription>
            </div>
            <Button variant="default">Marcar que estudei</Button>
          </CardHeader>

          <h4 className="subsection-title">Atribuições de Todas as Posições</h4>
          <div className="assignment-list">
            <div className="assignment-item assignment-item--mine">
              <div>
                <Badge variant="position">WR-Z</Badge>
                <div className="position-hint">SUA POSIÇÃO</div>
              </div>
              <div>
                <strong>Rota Z-Post (18–20 jardas):</strong> Saída externa forçando o CB a abrir
                quadril; quebrar aos 14 jardas em Post atacando o terço profundo central.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
