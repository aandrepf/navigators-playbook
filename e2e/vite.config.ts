// Servidor do web para a suíte E2E.
//
// Reaproveita o projeto `apps/web` sem alterá-lo e adiciona o proxy de /auth e
// /staff para a API. O app chama a API por caminho relativo (mesmo origin,
// cookie httpOnly), então em dev o proxy é o que faz o browser falar com a API.
// Sem este proxy o Vite responde o index.html para /auth/session.

import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { API_URL, WEB_PORT } from './support/constants.mjs'

export default defineConfig({
  root: fileURLToPath(new URL('../apps/web', import.meta.url)),
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: WEB_PORT,
    strictPort: true,
    proxy: {
      '/auth': { target: API_URL, changeOrigin: false },
      '/staff': { target: API_URL, changeOrigin: false },
      '/health': { target: API_URL, changeOrigin: false },
    },
  },
})
