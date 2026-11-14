import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'

function getGoogleErrorMessage(errorParam: string | null) {
  if (!errorParam) return null
  if (errorParam === 'access_denied') {
    return 'Você cancelou o login com Google. Tente novamente ou use o código por e-mail.'
  }
  return `Não foi possível entrar com Google (${errorParam}). Tente o código por e-mail.`
}

export function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [sessionError, setSessionError] = useState<string | null>(null)

  const errorParam = searchParams.get('error')
  const code = searchParams.get('code')
  const initialError = getGoogleErrorMessage(errorParam)

  useEffect(() => {
    if (initialError || !code) return

    let cancelled = false
    refresh()
      .then(() => {
        if (!cancelled) navigate('/')
      })
      .catch(() => {
        if (!cancelled) {
          setSessionError(
            'Não foi possível confirmar a sessão após o login com Google. Tente o código por e-mail.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [initialError, code, refresh, navigate])

  const error = initialError || sessionError

  if (error) {
    return (
      <div className="auth-layout">
        <div className="auth-card">
          <ErrorState message={error} onRetry={() => navigate('/login')} />
        </div>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <LoadingState label="Confirmando login com Google" />
      </div>
    </div>
  )
}
