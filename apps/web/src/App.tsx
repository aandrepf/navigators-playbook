import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { AppShell } from './components/AppShell'
import { AuthScreen } from './screens/AuthScreen'
import { GoogleCallback } from './screens/GoogleCallback'
import { LoginErrorScreen } from './screens/LoginErrorScreen'
import { Home } from './screens/Home'
import { Evento } from './screens/Evento'
import { Playbook } from './screens/Playbook'
import { Jogo } from './screens/Jogo'
import { Elenco } from './screens/Elenco'
import { Perfil } from './screens/Perfil'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const [searchParams] = useSearchParams()

  if (state.status === 'loading') {
    return (
      <div className="auth-layout">
        <LoadingState label="Verificando sessão" />
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="auth-layout">
        <ErrorState message={state.error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (state.status === 'unauthenticated') {
    if (searchParams.get('login') === 'erro') {
      return <LoginErrorScreen />
    }
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/evento" element={<Evento />} />
        <Route path="/playbook" element={<Playbook />} />
        <Route path="/jogo" element={<Jogo />} />
        <Route path="/elenco" element={<Elenco />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}
