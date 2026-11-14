import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the playbook title', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Navigators Playbook' }),
    ).toBeInTheDocument()
  })
})
