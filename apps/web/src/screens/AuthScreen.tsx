import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api, ApiClientError } from '../api/client'
import {
  Button,
  Card,
  CardContent,
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
  | 'player-units'
  | 'staff-role'
  | 'pending'

const POSITIONS_BY_UNIT: Record<string, string[]> = {
  ofensiva: ['QB', 'RB', 'FB', 'WR', 'TE', 'OL'],
  defesa: ['DL', 'LB', 'CB', 'S'],
  special_teams: ['K', 'P', 'LS', 'KR/PR', 'Gunner'],
}

const STAFF_ROLES = [
  {
    value: 'coordenador_ofensivo',
    label: 'Coordenador Ofensivo',
    description: 'Edita jogadas da unidade ofensiva.',
  },
  {
    value: 'coordenador_defensivo',
    label: 'Coordenador Defensivo',
    description: 'Edita jogadas da unidade defensiva.',
  },
] as const

export function AuthScreen() {
  const { requestEmailCode, loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const googleErrorFlag = searchParams.get('forceError')

  const [step, setStep] = useState<Step>('welcome')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [teamCode, setTeamCode] = useState('')
  const [role, setRole] = useState<'jogador' | 'staff' | null>(null)
  const [staffRole, setStaffRole] = useState<
    'coordenador_ofensivo' | 'coordenador_defensivo' | 'coordenador_special_teams' | ''
  >('')
  const [alsoSt, setAlsoSt] = useState(false)
  const [units, setUnits] = useState<string[]>([])
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

  async function handleConfirmRole() {
    if (!role) return
    setLoading(true)
    setError(null)

    const payload: Parameters<typeof loginWithEmail>[0] = {
      email,
      code,
      teamCode,
      name,
      role,
    }

    if (role === 'staff') {
      const subRoles: Array<
        'coordenador_ofensivo' | 'coordenador_defensivo' | 'coordenador_special_teams'
      > = []
      if (staffRole) subRoles.push(staffRole)
      if (alsoSt) subRoles.push('coordenador_special_teams')
      payload.staffRole = subRoles[0]
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

  function handleUnitChange(unit: string) {
    setUnits((prev) => {
      const next = prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
      setPositions((pos) =>
        pos.filter((p) =>
          next.some(
            (u) => POSITIONS_BY_UNIT[u]?.includes(p) || POSITIONS_BY_UNIT.special_teams.includes(p),
          ),
        ),
      )
      return next
    })
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

          <button
            type="button"
            className="role-option"
            aria-pressed={role === 'jogador'}
            onClick={() => {
              setRole('jogador')
              setStep('player-units')
            }}
          >
            <span className="role-option__title">JOGADOR</span>
            <span className="role-option__desc">
              Jogo em campo, consulto o playbook e respondo a eventos.
            </span>
          </button>

          <button
            type="button"
            className="role-option"
            aria-pressed={role === 'staff'}
            onClick={() => {
              setRole('staff')
              setStep('staff-role')
            }}
          >
            <span className="role-option__title">STAFF</span>
            <span className="role-option__desc">
              Faço parte do staff técnico, edito playbook, eventos ou elenco.
            </span>
          </button>
        </Card>
      </div>
    )
  }

  if (step === 'player-units') {
    const availableUnits = ['ofensiva', 'defesa', 'special_teams']
    const availablePositions = Array.from(
      new Set(
        units.flatMap((u) => POSITIONS_BY_UNIT[u] || []).concat(POSITIONS_BY_UNIT.special_teams),
      ),
    )

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
              <CardTitle className="auth-card__title">Unidades e Posições</CardTitle>
              <CardDescription className="auth-card__subtitle">
                Escolha onde joga. Special teams é incluída automaticamente.
              </CardDescription>
            </CardHeader>

            {error && (
              <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
            )}

            <Field>
              <FieldLabel>Unidades:</FieldLabel>
              <div className="chip-bar" role="group" aria-label="Unidades de atuação">
                {availableUnits.map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    className="chip"
                    aria-pressed={units.includes(unit)}
                    onClick={() => handleUnitChange(unit)}
                  >
                    {unit === 'ofensiva' && 'Ofensiva'}
                    {unit === 'defesa' && 'Defesa'}
                    {unit === 'special_teams' && 'Special teams'}
                  </button>
                ))}
              </div>
            </Field>

            {availablePositions.length > 0 && (
              <Field>
                <FieldLabel>Posições:</FieldLabel>
                <div className="chip-bar" role="group" aria-label="Posições">
                  {availablePositions.map((position) => (
                    <button
                      key={position}
                      type="button"
                      className="chip"
                      aria-pressed={positions.includes(position)}
                      onClick={() => togglePosition(position)}
                    >
                      {position}
                    </button>
                  ))}
                </div>
                {positions.length === 0 && (
                  <FieldHint>Selecione pelo menos uma posição.</FieldHint>
                )}
              </Field>
            )}

            <Button
              type="submit"
              variant="default"
              style={{ width: '100%' }}
              disabled={positions.length === 0 || loading}
              loading={loading}
              loadingLabel="Criando conta..."
            >
              Criar conta
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (step === 'staff-role') {
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
              <CardTitle className="auth-card__title">Subpapel do Staff</CardTitle>
              <CardDescription className="auth-card__subtitle">
                Escolha sua função no staff.
              </CardDescription>
            </CardHeader>

            {error && (
              <FieldError style={{ marginBottom: 'var(--space-3)' }}>{error}</FieldError>
            )}

            <Field>
              <FieldLabel>Subpapel principal:</FieldLabel>
              {STAFF_ROLES.map((option) => (
                <label key={option.value} className="role-option" style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name="staff-role"
                    value={option.value}
                    checked={staffRole === option.value}
                    onChange={(e) => setStaffRole(e.target.value as typeof staffRole)}
                    style={{ marginRight: 'var(--space-2)' }}
                  />
                  <span className="role-option__title">{option.label}</span>
                  <span className="role-option__desc">{option.description}</span>
                </label>
              ))}
            </Field>

            <Field>
              <label className="role-option" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={alsoSt}
                  onChange={(e) => setAlsoSt(e.target.checked)}
                  style={{ marginRight: 'var(--space-2)' }}
                />
                <span>
                  <span className="role-option__title">
                    Acumulo também o subpapel de Coordenador de special teams
                  </span>
                </span>
              </label>
            </Field>

            <Card
              variant="warning"
              style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}
            >
              <CardContent>
                Para proteger os dados de saúde, justificativas e sigilo do playbook, cadastros de
                staff ficam pendentes até aprovação de um Head Coach.
              </CardContent>
            </Card>

            <Button
              type="submit"
              variant="default"
              style={{ width: '100%' }}
              disabled={!staffRole || loading}
              loading={loading}
              loadingLabel="Criando conta..."
            >
              Criar conta
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
            Seu cadastro como staff está aguardando aprovação de um Head Coach. Você receberá uma
            notificação quando for liberado.
          </CardDescription>
        </CardHeader>
        <Button variant="default" style={{ width: '100%' }} onClick={() => navigate('/')}>
          Ir para a tela inicial
        </Button>
      </Card>
    </div>
  )
}
