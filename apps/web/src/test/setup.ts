// Loaded by Vitest before every test file (see `test.setupFiles` in vite.config.ts).
// Registers the jest-dom matchers (`toBeInTheDocument`, `toHaveTextContent`, …) and,
// because `test.globals` is enabled, React Testing Library cleans up after each test.
import '@testing-library/jest-dom/vitest'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' } as Parameters<typeof server.listen>[0]))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
})

// Polyfill HTMLDialogElement methods for jsdom (used by <Dialog> primitive tests).
if (!window.HTMLDialogElement.prototype.showModal) {
  Object.defineProperty(window.HTMLDialogElement.prototype, 'showModal', {
    writable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
}

if (!window.HTMLDialogElement.prototype.close) {
  Object.defineProperty(window.HTMLDialogElement.prototype, 'close', {
    writable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    },
  })
}
