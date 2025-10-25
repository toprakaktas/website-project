import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://4n7m63s3-8000.euw.devtunnels.ms',
        changeOrigin: true,
      }
    }
  }
});
