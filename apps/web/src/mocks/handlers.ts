import { http, HttpResponse } from 'msw'
import type { User } from '../api/client'

export const mockUser: User = {
  id: 'usr-1',
  email: 'jogador@navigators.fa',
  name: 'Rafael Costa',
  role: 'jogador',
  approvalState: 'ativo',
  subRoles: [],
}

export const mockStaff: User = {
  id: 'usr-2',
  email: 'coach@navigators.fa',
  name: 'Carlos Eduardo',
  role: 'staff',
  approvalState: 'ativo',
  subRoles: ['head_coach'],
}

export const mockPendingStaff: User = {
  id: 'usr-3',
  email: 'pendente@navigators.fa',
  name: 'Marcos Viana',
  role: 'staff',
  approvalState: 'pendente',
  subRoles: ['coordenador_defensivo'],
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
      staffRole?: string
    }

    const user: User =
      body.role === 'staff'
        ? {
            id: 'usr-new',
            email: 'novo@navigators.fa',
            name: 'Novo Usuário',
            role: 'staff',
            approvalState: 'pendente',
            subRoles: body.staffRole ? [body.staffRole as User['subRoles'][number]] : [],
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
          requestedSubrole: 'coordenador_defensivo',
          createdAt: new Date().toISOString(),
        },
      ],
    })
  }),
]
