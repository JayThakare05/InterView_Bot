import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/session': 'http://localhost:3001',
      '/topics': 'http://localhost:3001',
      '/history': 'http://localhost:3001',
      '/health': 'http://localhost:3001',
    },
  },
});
