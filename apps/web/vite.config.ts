import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'API_')
  const apiTarget = env.API_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/auth': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/staff': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      restoreMocks: true,
    },
  }
})
