import { render as rtlRender } from '@testing-library/react'
import { AuthProvider } from '../hooks/AuthProvider'
import { server } from './server'

export { server }

export function renderWithAuth(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)
  return rtlRender(<AuthProvider>{ui}</AuthProvider>)
}
