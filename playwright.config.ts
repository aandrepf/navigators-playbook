import { defineConfig, devices } from '@playwright/test'
import { API_URL, WEB_URL } from './e2e/support/constants.mjs'

// Suíte E2E: ver e2e/README.md. Um comando: `npm run test:e2e`.
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './e2e/specs',
  outputDir: './e2e/.results',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  // Retry só na CI e só para absorver falha de infra; um teste que precisou de
  // retry aparece como flaky no relatório e deve ser corrigido, não ignorado.
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: './e2e/.report', open: 'never' }],
  ],
  use: {
    baseURL: WEB_URL,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: [
    {
      command: 'node e2e/scripts/start-api.mjs',
      url: `${API_URL}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      // Não reaproveitamos um `npm run dev` já rodando: ele não tem o proxy de
      // /auth para a API de testes, e os testes falhariam de forma confusa.
      command: 'npx vite --config e2e/vite.config.ts',
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
})
