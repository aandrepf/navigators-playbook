import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'
import { renderWithAuth } from '../test/test-utils'

function renderWithRouter(ui: React.ReactElement, route = '/') {
  return renderWithAuth(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, { route })
}

describe('Home', () => {
  it('renders headings and event cards for authenticated player', async () => {
    renderWithRouter(<Home />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /próximos eventos/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /novidades do playbook/i })).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="card"]').length).toBeGreaterThan(0)
    expect(document.querySelectorAll('[data-slot="badge"]').length).toBeGreaterThan(0)
  })
})
