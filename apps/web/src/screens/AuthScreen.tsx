import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api, ApiClientError } from '../api/client'

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
      // Remove posições de unidades desmarcadas
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
      // Se o backend respondeu 302 manual, o fetch não segue; redirecionamos explicitamente.
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
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Playbook do Time</h1>
            <p className="auth-card__subtitle">Acesse o playbook, eventos e status do elenco do seu time.</p>
          </div>

          {error && (
            <div className="field-error-msg" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={handleGoogleLogin}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Conectando...' : 'Continuar com Google'}
          </button>

          <div style={{ textAlign: 'center', margin: 'var(--space-4) 0', color: 'var(--color-text-muted)' }}>
            ou
          </div>

          <button type="button" className="btn btn--primary btn--block" onClick={() => setStep('email')}>
            Entrar com código por e-mail
          </button>
        </div>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="auth-layout">
        <form className="auth-card" onSubmit={handleRequestCode}>
          <div className="auth-card__header">
            <h1 className="auth-card__title">Criar conta ou entrar</h1>
            <p className="auth-card__subtitle">Informe o código do time, seu nome e e-mail para receber um código de uso único.</p>
          </div>

          <div className="form-group">
            <label htmlFor="team-code" className="form-label">
              Código do time:
            </label>
            <input
              id="team-code"
              type="text"
              className="form-input mono"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              autoCapitalize="characters"
              spellCheck="false"
              required
              placeholder="NAVIGATORS-2026"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nome completo:
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail:
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="field-error-msg" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={loading} aria-busy={loading}>
            {loading ? 'Enviando código...' : 'Receber código de 6 dígitos'}
          </button>

          <button
            type="button"
            className="btn btn--secondary btn--block"
            style={{ marginTop: 'var(--space-3)' }}
            onClick={() => setStep('welcome')}
          >
            Voltar
          </button>
        </form>
      </div>
    )
  }

  if (step === 'code') {
    return (
      <div className="auth-layout">
        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault()
            setStep('role')
          }}
        >
          <div className="auth-card__header">
            <h1 className="auth-card__title">Verifique seu e-mail</h1>
            <p className="auth-card__subtitle">Digite o código de 6 dígitos enviado para {email}.</p>
          </div>

          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Código de verificação:
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="form-input mono"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              pattern="\d{6}"
              placeholder="000000"
              aria-invalid={Boolean(error)}
            />
            {error && (
              <div className="field-error-msg" role="alert">
                ⚠ {error}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={loading} aria-busy={loading}>
            Continuar
          </button>

          <button
            type="button"
            className="btn btn--secondary btn--block"
            style={{ marginTop: 'var(--space-3)' }}
            onClick={() => setStep('email')}
          >
            Reenviar código
          </button>
        </form>
      </div>
    )
  }

  if (step === 'role') {
    return (
      <div className="auth-layout">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Como você participa do time?</h1>
            <p className="auth-card__subtitle">Escolha seu papel para personalizar o acesso.</p>
          </div>

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
            <span className="role-option__desc">Jogo em campo, consulto o playbook e respondo a eventos.</span>
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
            <span className="role-option__desc">Faço parte do staff técnico, edito playbook, eventos ou elenco.</span>
          </button>
        </div>
      </div>
    )
  }

  if (step === 'player-units') {
    const availableUnits = ['ofensiva', 'defesa', 'special_teams']
    const availablePositions = Array.from(
      new Set(units.flatMap((u) => POSITIONS_BY_UNIT[u] || []).concat(POSITIONS_BY_UNIT.special_teams)),
    )

    return (
      <div className="auth-layout">
        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault()
            handleConfirmRole()
          }}
        >
          <div className="auth-card__header">
            <h1 className="auth-card__title">Unidades e Posições</h1>
            <p className="auth-card__subtitle">Escolha onde joga. Special teams é incluída automaticamente.</p>
          </div>

          {error && (
            <div className="field-error-msg" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
              ⚠ {error}
            </div>
          )}

          <div className="form-group">
            <span className="form-label">Unidades:</span>
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
          </div>

          {availablePositions.length > 0 && (
            <div className="form-group">
              <span className="form-label">Posições:</span>
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
                <span className="form-hint">Selecione pelo menos uma posição.</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={positions.length === 0 || loading}
            aria-disabled={positions.length === 0 || loading}
            aria-busy={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    )
  }

  if (step === 'staff-role') {
    return (
      <div className="auth-layout">
        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault()
            handleConfirmRole()
          }}
        >
          <div className="auth-card__header">
            <h1 className="auth-card__title">Subpapel do Staff</h1>
            <p className="auth-card__subtitle">Escolha sua função no staff.</p>
          </div>

          {error && (
            <div className="field-error-msg" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
              ⚠ {error}
            </div>
          )}

          <div className="form-group">
            <span className="form-label">Subpapel principal:</span>
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
          </div>

          <div className="form-group">
            <label className="role-option" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={alsoSt}
                onChange={(e) => setAlsoSt(e.target.checked)}
                style={{ marginRight: 'var(--space-2)' }}
              />
              <span>
                <span className="role-option__title">Acumulo também o subpapel de Coordenador de special teams</span>
              </span>
            </label>
          </div>

          <div
            className="card card--warning"
            style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}
          >
            Para proteger os dados de saúde, justificativas e sigilo do playbook, cadastros de staff ficam pendentes até
            aprovação de um Head Coach.
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={!staffRole || loading} aria-busy={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="auth-card__title">Cadastro pendente</h1>
        <p className="auth-card__subtitle">
          Seu cadastro como staff está aguardando aprovação de um Head Coach. Você receberá uma notificação quando for
          liberado.
        </p>
        <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/')}>
          Ir para a tela inicial
        </button>
      </div>
    </div>
  )
}
