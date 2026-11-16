import { http, HttpResponse } from 'msw'
import type { User } from '../api/client'

export const mockUser: User = {
  id: 'usr-1',
  email: 'jogador@navigators.fa',
  name: 'Rafael Costa',
  phone: null,
  role: 'jogador',
  approvalState: 'ativo',
  isAdmin: false,
  subRoles: [],
  positions: [{ unit: 'ofensiva', position: 'WR', approvalState: 'aprovada' }],
  units: ['ofensiva'],
}

export const mockStaff: User = {
  id: 'usr-2',
  email: 'coach@navigators.fa',
  name: 'Carlos Eduardo',
  phone: null,
  role: 'staff',
  approvalState: 'ativo',
  isAdmin: false,
  subRoles: ['head_coach'],
  positions: [],
  units: [],
}

export const mockPendingStaff: User = {
  id: 'usr-3',
  email: 'pendente@navigators.fa',
  name: 'Marcos Viana',
  phone: null,
  role: 'staff',
  approvalState: 'pendente',
  isAdmin: false,
  subRoles: [],
  positions: [],
  units: [],
}

export const handlers = [
  http.get('/auth/session', () => {
    return HttpResponse.json({ user: mockUser })
  }),

  http.post('/auth/email/request', async () => {
    return HttpResponse.json({ ok: true }, { status: 202 })
  }),

  http.post('/auth/email/verify', async ({ request }) => {
    const body = (await request.json()) as {
      role: 'jogador' | 'staff'
      positions?: string[]
    }

    const user: User =
      body.role === 'staff'
        ? {
            id: 'usr-new',
            email: 'novo@navigators.fa',
            name: 'Novo Usuário',
            phone: null,
            role: 'staff',
            approvalState: 'pendente',
            isAdmin: false,
            subRoles: [],
            positions: [],
            units: [],
          }
        : mockUser

    return HttpResponse.json({ user })
  }),

  http.post('/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/auth/google', ({ request }) => {
    const forceError = new URL(request.url).searchParams.get('forceError')
    if (forceError === '503') {
      return HttpResponse.json({ error: 'Login com Google não configurado' }, { status: 503 })
    }
    return HttpResponse.json(null, { status: 302, headers: { Location: '/auth/google/callback?code=abc' } })
  }),

  http.get('/staff/pending', () => {
    return HttpResponse.json({
      staff: [
        {
          id: 'pend-1',
          email: 'pendente@navigators.fa',
          name: 'Marcos Viana',
          createdAt: new Date().toISOString(),
        },
      ],
    })
  }),
]
