import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

const wowsProxy: ProxyOptions = {
  target: 'https://vortex.worldofwarships.eu',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/wows-api/, ''),
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/wows-api': wowsProxy },
  },
  preview: {
    proxy: { '/wows-api': wowsProxy },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    css: false,
  },
} as Parameters<typeof defineConfig>[0]);
