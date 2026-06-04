import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',     // forwards /api calls to backend
      '/icons': 'http://localhost:3001'    // forwards icon requests too
    }
  }
})
