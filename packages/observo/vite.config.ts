import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './src/frontend',
  base: '/',
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true,
  },
  server: {
    port: 5000,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  }
});
