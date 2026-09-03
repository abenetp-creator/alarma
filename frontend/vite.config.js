import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'safari >= 13', 'ios >= 13'],
    }),
  ],
  build: {
    target: ['es2015', 'safari13'],
  },
})
