import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api, ApiClientError } from '../api/client'
import { POSITIONS_BY_UNIT } from '../domain/positions'
import { AuthMain } from '../components/AuthMain'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
} from '../components/ui'

const DEFAULT_TEAM_CODE = 'NAVS-2026'

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

type Step =
  | 'welcome'
  | 'email'
  | 'code'
  | 'role'
  | 'player-positions'
  | 'pending'

type ResendStatus =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

export function AuthScreen() {
  const { requestEmailCode, loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const googleErrorFlag = searchParams.get('forceError')

  const [step, setStep] = useState<Step>('welcome')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'jogador' | 'staff' | null>(null)
  const [positions, setPositions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState<ResendStatus>(null)

  async function handleRequestCode(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await requestEmailCode(email)
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar código.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    setLoading(true)
    setError(null)
    setResendStatus(null)
    try {
      await requestEmailCode(email)
      setCode('')
      setResendStatus({ type: 'success', message: `Novo código enviado para ${email}.` })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao reenviar código.'
      setResendStatus({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmRole(
    nextRole = role,
    nextPositions?: string[],
  ) {
    if (!nextRole) return
    setLoading(true)
    setError(null)

    const payload: Parameters<typeof loginWithEmail>[0] = {
      email,
      code,
      teamCode: DEFAULT_TEAM_CODE,
      name,
      phone: phone || null,
      role: nextRole,
    }
    if (nextRole === 'jogador') {
      payload.positions = nextPositions ?? positions
    }

    try {
      const user = await loginWithEmail(payload)
      if (user.approvalState === 'pendente') {
        setStep('pending')
      } else {
        navigate('/')
      }
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        setError('Código inválido ou expirado. Solicite um novo código abaixo.')
        setStep('code')
      } else if (err instanceof ApiClientError && err.status === 400) {
        setError(err.message)
        setStep('email')
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao verificar código.')
      }
    } finally {
      setLoading(false)
    }
  }

  function togglePosition(position: string) {
    setPositions((prev) =>
      prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position],
    )
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    try {
      await api.auth.checkGoogleLogin(googleErrorFlag)
      window.location.href = `/auth/google${googleErrorFlag ? `?forceError=${googleErrorFlag}` : ''}`
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Login com Google não está disponível no momento. Use o código por e-mail.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (step === 'welcome') {
    return (
      <AuthMain>
        <Card className="auth-card">
          <CardHeader className="auth-card__header">
            <h1 data-slot="card-title" className="auth-card__title ui-card__title">
              SnapIn
            </h1>
            <CardDescription className="auth-card__subtitle">
              Gestão de Futebol Americano.
            </CardDescription>
          </CardHeader>

          {error && (
            <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
          )}

          <Button
            variant="secondary"
            style={{ width: '100%' }}
            onClick={handleGoogleLogin}
            loading={loading}
            loadingLabel="Conectando..."
          >
            <GoogleIcon aria-hidden="true" style={{ marginRight: 'var(--space-2)' }} />
            Entrar com o Google
          </Button>

          <div className="or-divider">ou</div>

          <Button variant="default" style={{ width: '100%' }} onClick={() => setStep('email')}>
            Entrar com código por e-mail
          </Button>
        </Card>
      </AuthMain>
    )
  }

  if (step === 'email') {
    return (
      <AuthMain>
        <Card className="auth-card">
          <form onSubmit={handleRequestCode}>
            <CardHeader className="auth-card__header">
              <h1 data-slot="card-title" className="auth-card__title ui-card__title">
                Criar conta ou entrar
              </h1>
              <CardDescription className="auth-card__subtitle">
                Complete seus dados para receber um código de uso único.
              </CardDescription>
            </CardHeader>

            <Field>
              <FieldLabel htmlFor="team-name">Time:</FieldLabel>
              <output
                id="team-name"
                className="auth-readonly-value"
                aria-label="Time atual: Navigators"
              >
                Navigators
              </output>
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Nome completo:</FieldLabel>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Telefone (opcional):</FieldLabel>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="+351 912 345 678"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">E-mail:</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Field>

            {error && (
              <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
            )}

            <Button
              type="submit"
              variant="default"
              style={{ width: '100%' }}
              loading={loading}
              loadingLabel="Enviando código..."
            >
              Receber código de 6 dígitos
            </Button>

            <Button
              type="button"
              variant="secondary"
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
              onClick={() => setStep('welcome')}
            >
              Voltar
            </Button>
          </form>
        </Card>
      </AuthMain>
    )
  }

  if (step === 'code') {
    return (
      <AuthMain>
        <Card className="auth-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setResendStatus(null)
              setStep('role')
            }}
          >
            <CardHeader className="auth-card__header">
              <h1 data-slot="card-title" className="auth-card__title ui-card__title">
                Verifique seu e-mail
              </h1>
              <CardDescription className="auth-card__subtitle">
                Digite o código de 6 dígitos enviado para {email}.
              </CardDescription>
            </CardHeader>

            <Field>
              <FieldLabel htmlFor="code">Código de verificação:</FieldLabel>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                pattern="\d{6}"
                placeholder="000000"
                error={Boolean(error)}
                aria-describedby={error ? 'code-error' : undefined}
                className="mono"
              />
              {error && <FieldError id="code-error">{error}</FieldError>}
              {resendStatus?.type === 'success' && (
                <p role="status" className="auth-resend-status auth-resend-status--success">
                  {resendStatus.message}
                </p>
              )}
              {resendStatus?.type === 'error' && (
                <p role="alert" className="auth-resend-status auth-resend-status--error">
                  {resendStatus.message}
                </p>
              )}
            </Field>

            <Button
              type="submit"
              variant="default"
              style={{ width: '100%' }}
              loading={loading}
              loadingLabel="Verificando..."
            >
              Continuar
            </Button>

            <Button
              type="button"
              variant="secondary"
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
              loading={loading}
              loadingLabel="Reenviando..."
              onClick={() => {
                setResendStatus(null)
                void handleResendCode()
              }}
            >
              Reenviar código
            </Button>

            <Button
              type="button"
              variant="ghost"
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
              onClick={() => setStep('email')}
            >
              Voltar
            </Button>
          </form>
        </Card>
      </AuthMain>
    )
  }

  if (step === 'role') {
    return (
      <AuthMain>
        <Card className="auth-card">
          <CardHeader className="auth-card__header">
            <h1 data-slot="card-title" className="auth-card__title ui-card__title">
              Como você participa do time?
            </h1>
            <CardDescription className="auth-card__subtitle">
              Escolha seu papel para personalizar o acesso.
            </CardDescription>
          </CardHeader>

          {error && (
            <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
          )}

          <div role="group" aria-label="Escolha de papel">
            <Button
              type="button"
              variant={role === 'jogador' ? 'default' : 'outline'}
              style={{
                width: '100%',
                marginBottom: 'var(--space-3)',
                minHeight: '72px',
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
              aria-pressed={role === 'jogador'}
              disabled={loading}
              onClick={() => {
                setRole('jogador')
                setStep('player-positions')
              }}
            >
              <strong style={{ display: 'block' }}>Jogador</strong>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, display: 'block' }}>
                Atleta que pertence ao clube
              </span>
            </Button>

            <Button
              type="button"
              variant={role === 'staff' ? 'default' : 'outline'}
              style={{
                width: '100%',
                minHeight: '72px',
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
              aria-pressed={role === 'staff'}
              disabled={loading}
              loading={loading && role === 'staff'}
              loadingLabel="Enviando solicitação..."
              onClick={() => {
                setRole('staff')
                void handleConfirmRole('staff')
              }}
            >
              <strong style={{ display: 'block' }}>Staff</strong>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, display: 'block' }}>
                Coaches, Coordenadores e auxiliares do clube
              </span>
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            style={{ width: '100%', marginTop: 'var(--space-3)' }}
            disabled={loading}
            onClick={() => setStep('code')}
          >
            Voltar
          </Button>
        </Card>
      </AuthMain>
    )
  }

  if (step === 'player-positions') {
    return (
      <AuthMain>
        <Card className="auth-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleConfirmRole()
            }}
          >
            <CardHeader className="auth-card__header">
              <h1 data-slot="card-title" className="auth-card__title ui-card__title">
                Suas posições
              </h1>
              <CardDescription className="auth-card__subtitle">
                Escolha posições de ofensiva e/ou defesa. Elas serão validadas pelo staff.
              </CardDescription>
            </CardHeader>

            {error && (
              <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
            )}

            {(Object.entries(POSITIONS_BY_UNIT) as Array<[string, readonly string[]]>).map(
              ([unit, availablePositions]) => (
                <Field key={unit}>
                  <FieldLabel>{unit === 'ofensiva' ? 'Ofensiva' : 'Defesa'}:</FieldLabel>
                  <div className="btn-row" role="group" aria-label={`Posições de ${unit}`}>
                    {availablePositions.map((position) => (
                      <Button
                        key={position}
                        type="button"
                        size="sm"
                        className="position-toggle"
                        variant={positions.includes(position) ? 'default' : 'outline'}
                        aria-pressed={positions.includes(position)}
                        onClick={() => togglePosition(position)}
                      >
                        {positions.includes(position) ? `✓ ${position}` : position}
                      </Button>
                    ))}
                  </div>
                </Field>
              ),
            )}
            {positions.length === 0 && (
              <FieldHint>
                Você pode pular agora. O staff validará suas posições antes de liberar o Playbook
                por unidade.
              </FieldHint>
            )}

            <Button
              type="submit"
              variant="default"
              style={{ width: '100%' }}
              disabled={loading}
              loading={loading}
              loadingLabel="Criando conta..."
            >
              Criar conta
            </Button>
            <Button
              type="button"
              variant="secondary"
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
              disabled={loading}
              onClick={() => {
                setPositions([])
                void handleConfirmRole('jogador', [])
              }}
            >
              Pular posições por agora
            </Button>
            <Button
              type="button"
              variant="ghost"
              style={{ width: '100%', marginTop: 'var(--space-3)' }}
              disabled={loading}
              onClick={() => setStep('role')}
            >
              Voltar
            </Button>
          </form>
        </Card>
      </AuthMain>
    )
  }

  return (
    <AuthMain>
      <Card className="auth-card" style={{ textAlign: 'center' }}>
        <CardHeader className="auth-card__header">
          <h1 data-slot="card-title" className="auth-card__title ui-card__title">
            Cadastro pendente
          </h1>
          <CardDescription className="auth-card__subtitle">
            Seu cadastro como staff está aguardando definição de um Admin ou Head Coach. Você
            receberá uma notificação quando for liberado.
          </CardDescription>
        </CardHeader>
        <Button variant="default" style={{ width: '100%' }} onClick={() => navigate('/')}>
          Ir para a tela inicial
        </Button>
      </Card>
    </AuthMain>
  )
}
