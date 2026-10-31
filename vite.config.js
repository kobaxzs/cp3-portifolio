import { defineConfig as definirConfiguracao, loadEnv as carregarAmbiente } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginContatoLocal } from './server/dev-contact.js';
export default definirConfiguracao(({ mode: modo }) => ({
  plugins: [pluginReact(), pluginContatoLocal(carregarAmbiente(modo, process.cwd(), ''))],
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
