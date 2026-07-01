import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import moduleFederationConfig from './module-federation.config.ts'

// https://vite.dev/config/
export default defineConfig({
  base: 'http://localhost:5173/',
  plugins: [react(), federation(moduleFederationConfig)],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'http://localhost:5173',
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  build: {
    target: 'chrome89',
  },
})
