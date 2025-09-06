import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/bookstore/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  }
})
