import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api, type User, ApiClientError } from '../api/client'
import { AuthContext } from './useAuth'

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: string }

export type AuthContextValue = {
  state: AuthState
  refresh: () => Promise<void>
  loginWithEmail: (payload: {
    email: string
    code: string
    teamCode: string
    name?: string
    role: 'jogador' | 'staff'
    staffRole?:
      | 'coordenador_ofensivo'
      | 'coordenador_defensivo'
      | 'coordenador_special_teams'
  }) => Promise<User>
  requestEmailCode: (email: string) => Promise<void>
  logout: () => Promise<void>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  const refresh = useCallback(async () => {
    try {
      const { user } = await api.auth.getSession()
      setState({ status: 'authenticated', user })
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        setState({ status: 'unauthenticated' })
      } else {
        setState({
          status: 'error',
          error:
            error instanceof ApiClientError
              ? `Não foi possível verificar a sessão: ${error.message}.`
              : 'Não foi possível verificar a sessão.',
        })
      }
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const requestEmailCode = useCallback(async (email: string) => {
    await api.auth.requestEmailCode(email)
  }, [])

  const loginWithEmail = useCallback(
    async (payload: Parameters<AuthContextValue['loginWithEmail']>[0]) => {
      const { user } = await api.auth.verifyEmailCode(payload)
      setState({ status: 'authenticated', user })
      return user
    },
    [],
  )

  const logout = useCallback(async () => {
    await api.auth.logout()
    setState({ status: 'unauthenticated' })
  }, [])

  const value = useMemo(
    () => ({
      state,
      refresh,
      loginWithEmail,
      requestEmailCode,
      logout,
    }),
    [state, refresh, loginWithEmail, requestEmailCode, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
