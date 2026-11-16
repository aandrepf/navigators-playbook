import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api, ApiClientError } from '../api/client'
import { POSITIONS_BY_UNIT } from '../domain/positions'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
} from '../components/ui'

type Step =
  | 'welcome'
  | 'email'
  | 'code'
  | 'role'
  | 'player-positions'
  | 'pending'

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
  const [teamCode, setTeamCode] = useState('')
  const [role, setRole] = useState<'jogador' | 'staff' | null>(null)
  const [positions, setPositions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function handleConfirmRole(nextRole = role) {
    if (!nextRole) return
    setLoading(true)
    setError(null)

    const payload: Parameters<typeof loginWithEmail>[0] = {
      email,
      code,
      teamCode,
      name,
      phone: phone || null,
      role: nextRole,
    }
    if (nextRole === 'jogador') payload.positions = positions

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
      <div className="auth-layout">
        <Card className="auth-card">
          <CardHeader className="auth-card__header">
            <CardTitle className="auth-card__title">Playbook do Time</CardTitle>
            <CardDescription className="auth-card__subtitle">
              Acesse o playbook, eventos e status do elenco do seu time.
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
            Continuar com Google
          </Button>

          <div className="or-divider">ou</div>

          <Button variant="default" style={{ width: '100%' }} onClick={() => setStep('email')}>
            Entrar com código por e-mail
          </Button>
        </Card>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="auth-layout">
        <Card className="auth-card">
          <form onSubmit={handleRequestCode}>
            <CardHeader className="auth-card__header">
              <CardTitle className="auth-card__title">Criar conta ou entrar</CardTitle>
              <CardDescription className="auth-card__subtitle">
                Informe o código do time, seu nome e e-mail para receber um código de uso único.
              </CardDescription>
            </CardHeader>

            <Field>
              <FieldLabel htmlFor="team-code">Código do time:</FieldLabel>
              <Input
                id="team-code"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                autoCapitalize="characters"
                spellCheck="false"
                required
                placeholder="NAVIGATORS-2026"
              />
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
              <FieldHint>Usaremos este dado para futuras notificações via WhatsApp.</FieldHint>
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
      </div>
    )
  }

  if (step === 'code') {
    return (
      <div className="auth-layout">
        <Card className="auth-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep('role')
            }}
          >
            <CardHeader className="auth-card__header">
              <CardTitle className="auth-card__title">Verifique seu e-mail</CardTitle>
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
              />
              {error && <FieldError>{error}</FieldError>}
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
              onClick={() => setStep('email')}
            >
              Reenviar código
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (step === 'role') {
    return (
      <div className="auth-layout">
        <Card className="auth-card">
          <CardHeader className="auth-card__header">
            <CardTitle className="auth-card__title">Como você participa do time?</CardTitle>
            <CardDescription className="auth-card__subtitle">
              Escolha seu papel para personalizar o acesso.
            </CardDescription>
          </CardHeader>

          <Button
            type="button"
            variant={role === 'jogador' ? 'default' : 'outline'}
            style={{ width: '100%', marginBottom: 'var(--space-3)', minHeight: '72px' }}
            aria-pressed={role === 'jogador'}
            onClick={() => {
              setRole('jogador')
              setStep('player-positions')
            }}
          >
            <span>
              <strong>JOGADOR</strong>
              <br />
              Jogo em campo, consulto o playbook e respondo a eventos.
            </span>
          </Button>

          <Button
            type="button"
            variant={role === 'staff' ? 'default' : 'outline'}
            style={{ width: '100%', minHeight: '72px' }}
            aria-pressed={role === 'staff'}
            onClick={() => {
              setRole('staff')
              void handleConfirmRole('staff')
            }}
          >
            <span>
              <strong>STAFF</strong>
              <br />
              Faço parte do staff técnico, edito playbook, eventos ou elenco.
            </span>
          </Button>
        </Card>
      </div>
    )
  }

  if (step === 'player-positions') {
    return (
      <div className="auth-layout">
        <Card className="auth-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleConfirmRole()
            }}
          >
            <CardHeader className="auth-card__header">
              <CardTitle className="auth-card__title">Suas posições</CardTitle>
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
                        variant={positions.includes(position) ? 'default' : 'outline'}
                        aria-pressed={positions.includes(position)}
                        onClick={() => togglePosition(position)}
                      >
                        {position}
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
                void handleConfirmRole('jogador')
              }}
            >
              Pular posições por agora
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      <Card className="auth-card" style={{ textAlign: 'center' }}>
        <CardHeader className="auth-card__header">
          <CardTitle className="auth-card__title">Cadastro pendente</CardTitle>
          <CardDescription className="auth-card__subtitle">
            Seu cadastro como staff está aguardando definição de um Admin ou Head Coach. Você
            receberá uma notificação quando for liberado.
          </CardDescription>
        </CardHeader>
        <Button variant="default" style={{ width: '100%' }} onClick={() => navigate('/')}>
          Ir para a tela inicial
        </Button>
      </Card>
    </div>
  )
}
