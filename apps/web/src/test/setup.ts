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
