/**
 * Cliente HTTP único do Playbook do Time.
 *
 * Único lugar do frontend que conhece URLs, métodos e formato de erro da API.
 * Todas as chamadas são relative ao mesmo origin pois o backend serve o
 * frontend e usa cookie de sessão httpOnly.
 */

export type ApiError = {
  error: string
}

export type User = {
  id: string
  email: string
  name: string | null
  role: 'jogador' | 'staff'
  approvalState: 'ativo' | 'pendente' | 'recusado'
  subRoles: Array<
    'head_coach' | 'coordenador_ofensivo' | 'coordenador_defensivo' | 'coordenador_special_teams'
  >
}

export type PendingStaff = {
  id: string
  email: string
  name: string | null
  requestedSubrole:
    | 'coordenador_ofensivo'
    | 'coordenador_defensivo'
    | 'coordenador_special_teams'
  createdAt: string
}

const API_BASE = ''

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  let fetchBody: BodyInit | undefined
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    fetchBody = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: fetchBody,
    credentials: 'same-origin',
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = (await response.json().catch(() => ({}))) as T | ApiError

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && data.error) ||
      `Erro ${response.status}`
    throw new ApiClientError(message, response.status)
  }

  return data as T
}

export class ApiClientError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
  }
}

export const api = {
  auth: {
    requestEmailCode: (email: string) =>
      request<{ ok: true }>('POST', '/auth/email/request', { email }),

    verifyEmailCode: (payload: {
      email: string
      code: string
      teamCode: string
      name?: string
      role: 'jogador' | 'staff'
      staffRole?:
        | 'coordenador_ofensivo'
        | 'coordenador_defensivo'
        | 'coordenador_special_teams'
    }) => request<{ user: User }>('POST', '/auth/email/verify', payload),

    getSession: () => request<{ user: User }>('GET', '/auth/session'),

    logout: () => request<void>('POST', '/auth/logout'),

    googleLogin: () => request<void>('GET', '/auth/google'),

    checkGoogleLogin: async (forceError?: string | null) => {
      const query = forceError ? `?forceError=${forceError}` : ''
      const response = await fetch(`${API_BASE}/auth/google${query}`, {
        method: 'GET',
        redirect: 'manual',
        credentials: 'same-origin',
      })
      if (response.status === 503) {
        const data = (await response.json().catch(() => ({}))) as ApiError
        throw new ApiClientError(data.error || 'Login com Google não configurado', 503)
      }
      return response
    },
  },

  staff: {
    listPending: () =>
      request<{ staff: PendingStaff[] }>('GET', '/staff/pending'),
  },
}
