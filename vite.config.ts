import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built dist/ also opens from the file system.
export default defineConfig({
  plugins: [react()],
  base: './',
});
