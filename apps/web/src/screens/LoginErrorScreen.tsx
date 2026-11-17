import { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { AuthMain } from '../components/AuthMain'

export function LoginErrorScreen() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const motivo = searchParams.get('motivo')

  const message = useMemo(() => {
    if (motivo === 'access_denied') {
      return 'Você cancelou o login com Google. Tente novamente ou use o código por e-mail.'
    }
    if (motivo) {
      return `Não foi possível entrar com Google (${motivo}). Tente o código por e-mail.`
    }
    return 'Não foi possível fazer login. Tente novamente ou use o código por e-mail.'
  }, [motivo])

  return (
    <AuthMain>
      <div className="auth-card" data-slot="card">
        <ErrorState message={message} onRetry={() => navigate('/login')} />
      </div>
    </AuthMain>
  )
}
