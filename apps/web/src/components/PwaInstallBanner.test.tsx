import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PwaInstallBanner } from './PwaInstallBanner'

describe('PwaInstallBanner', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'matchMedia',
      () =>
        ({
          matches: false,
          media: '',
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders PWA install banner with data-slot', () => {
    render(<PwaInstallBanner />)

    expect(document.querySelector('[data-slot="banner"]')).toBeInTheDocument()
    expect(screen.getByText(/instale o snapin/i)).toBeInTheDocument()
  })

  it('dismisses banner when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    render(<PwaInstallBanner />)

    await user.click(screen.getByRole('button', { name: /não mostrar novamente/i }))
    expect(document.querySelector('[data-slot="banner"]')).not.toBeInTheDocument()
  })
})
