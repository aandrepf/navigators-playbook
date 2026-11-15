import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { RosterStatusBadge } from '../components/RosterStatusBadge'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FieldLabel,
  SectionHeading,
} from '../components/ui'

export function Perfil() {
  const { state, logout } = useAuth()

  async function handleLogout() {
    await logout()
  }

  if (state.status === 'loading') {
    return <LoadingState label="Carregando perfil" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.error} onRetry={() => window.location.reload()} />
  }

  const user = state.status === 'authenticated' ? state.user : null

  return (
    <section aria-labelledby="perfil-title" className="stack-md">
      <SectionHeading title="Perfil" />

      <div className="grid-2col">
        <div className="stack-md">
          <Card>
            <CardTitle>Identidade e Papel</CardTitle>
            <CardContent className="stack-sm" style={{ marginTop: 'var(--space-3)' }}>
              <div>
                <FieldLabel>Nome:</FieldLabel>{' '}
                <span>{user?.name || 'Não informado'}</span>
              </div>
              <div>
                <FieldLabel>E-mail:</FieldLabel>{' '}
                <span>{user?.email}</span>
                <Badge variant="available" style={{ marginLeft: 'var(--space-2)' }}>
                  Confirmado
                </Badge>
              </div>
              <div>
                <FieldLabel>Papel:</FieldLabel>{' '}
                <span>{user?.role === 'staff' ? 'Staff' : 'Jogador'}</span>
              </div>
              {user?.subRoles && user.subRoles.length > 0 && (
                <div>
                  <FieldLabel>Subpapéis:</FieldLabel>{' '}
                  <span>{user.subRoles.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {user?.role === 'jogador' && (
            <Card>
              <CardTitle>Meu Status do Elenco</CardTitle>
              <CardContent style={{ marginTop: 'var(--space-3)' }}>
                <RosterStatusBadge status="disponivel" />
                <p className="form-hint" style={{ marginTop: 'var(--space-2)' }}>
                  Seu status do elenco é atualizado pelo staff. Caso precise comunicar uma lesão ou
                  mudança cadastral, fale com o staff abaixo.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="stack-md">
          <Card>
            <CardTitle>Sessão e Privacidade</CardTitle>
            <CardDescription style={{ marginTop: 'var(--space-2)' }}>
              Você permanece conectado entre visitas neste aparelho.
            </CardDescription>
            <CardContent style={{ marginTop: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={handleLogout}>
                Sair da conta
              </Button>
            </CardContent>
          </Card>

          <Card variant="danger">
            <CardTitle>Zona de Perigo</CardTitle>
            <CardDescription style={{ marginTop: 'var(--space-2)' }}>
              A exclusão da conta é irreversível.
            </CardDescription>
            <CardContent style={{ marginTop: 'var(--space-3)' }}>
              <Button variant="destructive">Apagar minha conta</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
