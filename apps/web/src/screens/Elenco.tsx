import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { RosterStatusBadge } from '../components/RosterStatusBadge'
import {
  Badge,
  Button,
  Card,
  CardDescription,
  Field,
  FieldLabel,
  Input,
  SectionHeading,
} from '../components/ui'

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
      <SectionHeading
        title="Elenco"
        body="Lista completa do time com posições, unidades e status do elenco."
        justification="space-between"
      >
        <Button variant="default">Registrar jogador</Button>
      </SectionHeading>

      <Card>
        <Field style={{ marginBottom: 0 }}>
          <FieldLabel htmlFor="elenco-search">Buscar jogador:</FieldLabel>
          <Input type="search" id="elenco-search" placeholder="Nome ou posição..." />
        </Field>
      </Card>

      <div className="stack-sm">
        <div className="assignment-item" data-slot="card" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Rafael Costa</strong>{' '}
            <Badge variant="position">WR / KR</Badge>
            <CardDescription>Taxa de comparecimento: 92% (11/12 treinos)</CardDescription>
          </div>
          <RosterStatusBadge status="disponivel" />
        </div>
        <div className="assignment-item" data-slot="card" style={{ gridTemplateColumns: '1fr auto' }}>
          <div>
            <strong>Diego Almeida</strong>{' '}
            <Badge variant="position">LB</Badge>
            <CardDescription>Taxa de comparecimento: 83% (10/12 treinos)</CardDescription>
          </div>
          <RosterStatusBadge status="lesionado" returnDate="30/11" />
        </div>
      </div>
    </section>
  )
}
