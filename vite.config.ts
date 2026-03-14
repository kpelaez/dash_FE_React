import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve:{
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Opcional: configurar proxy para el backedn
    proxy:{
      // Shift schedules
      '/shift-schedules': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Business indicators
      '/api/business-indicators': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Assignment documents
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Inventario
      '/inventory': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Auth y usuarios
      '/token': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Health check
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  }
})
