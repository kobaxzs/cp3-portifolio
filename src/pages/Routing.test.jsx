import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { router } from '../router.jsx';
import { getRepositories } from '../services/github.js';

vi.mock('../services/github.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getRepositories: vi.fn(),
}));
vi.mock('../services/featured.js', () => ({
  getFeaturedProjects: vi.fn(async () => ({ configured: false, names: [] })),
}));

// Repositório exclusivo dos testes, sem dados fictícios no site.
const repo = {
  id: 1,
  name: 'meu-app',
  description: 'Projeto utilizado apenas para conferir as rotas.',
  language: 'JavaScript',
  owner: { login: 'usuario-de-teste' },
  html_url: 'https://github.com/usuario-de-teste/meu-app',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-10-28T00:00:00Z',
  stargazers_count: 0,
  forks_count: 0,
};
let currentRouter;

function openPath(path) {
  // Usa as mesmas definições de rota da aplicação.
  currentRouter = createMemoryRouter(router.routes, { initialEntries: [path] });
  render(<RouterProvider router={currentRouter} />);
}

beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn());
  getRepositories.mockReset();
  getRepositories.mockResolvedValue([repo]);
});
afterEach(() => currentRouter?.dispose());
afterAll(() => router.dispose());

describe('rotas públicas', () => {
  it('abre um projeto diretamente pelo endereço individual', async () => {
    openPath('/projetos/meu-app');
    expect(await screen.findByRole('heading', { level: 1, name: /meu app/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver código/i })).toHaveAttribute(
      'href',
      repo.html_url,
    );
    expect(currentRouter.state.location.pathname).toBe('/projetos/meu-app');
  });

  it('mostra uma página 404 e permite voltar ao início', async () => {
    openPath('/pagina-inexistente');
    expect(await screen.findByRole('heading', { name: /saímos do caminho/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /voltar ao início/i }));
    expect(await screen.findByRole('heading', { name: /ideias em mente/i })).toBeInTheDocument();
    expect(currentRouter.state.location.pathname).toBe('/');
  });

  it('explica a falha de API e recupera o projeto ao tentar novamente', async () => {
    getRepositories.mockRejectedValueOnce(new Error('Não foi possível conectar ao GitHub.'));
    getRepositories.mockResolvedValueOnce([repo]);
    openPath('/projetos/meu-app');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao GitHub.',
    );
    expect(screen.queryByText(/saímos do caminho/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(await screen.findByRole('heading', { level: 1, name: /meu app/i })).toBeInTheDocument();
  });

  it('informa quando a URL identifica um projeto que não existe no GitHub', async () => {
    openPath('/projetos/projeto-removido');
    expect(
      await screen.findByRole('heading', { name: 'Projeto não encontrado' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar aos projetos/i })).toHaveAttribute(
      'href',
      '/projetos',
    );
  });
});
