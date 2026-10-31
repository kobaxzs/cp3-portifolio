import '@testing-library/jest-dom/vitest';
import { afterEach as depoisDeCadaTeste, vi } from 'vitest';
import { cleanup as limparTela } from '@testing-library/react';
depoisDeCadaTeste(() => {
  limparTela();
  vi.unstubAllGlobals();
});
