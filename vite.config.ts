import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: Number(process.env.PORT ?? 4173),
    host: true,
    strictPort: false,
    allowedHosts: [
      'obel.ghisoni.com.ar',
      'roles-web-production.up.railway.app',
      '.railway.app',
      '.ghisoni.com.ar',
    ],
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    chunkSizeWarningLimit: 800,
  },
});
