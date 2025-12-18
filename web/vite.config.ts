import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/imposte-locali/',
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, '../src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from parent directory (dati/prospetti)
      allow: ['..'],
    },
  },
  // Copy prospetti data to build output
  publicDir: 'public',
})
