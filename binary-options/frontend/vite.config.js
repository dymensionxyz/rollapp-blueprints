import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // Polyfill para global
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: 'crypto-browserify', // Polyfill para crypto
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});