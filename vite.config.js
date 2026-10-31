import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { contactDevPlugin } from './server/dev-contact.js';

export default defineConfig(({ mode }) => ({
  plugins: [react(), contactDevPlugin(loadEnv(mode, process.cwd(), ''))],
  server: {
    host: '127.0.0.1',
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}', 'server/**/*.test.js'],
    restoreMocks: true,
  },
}));
