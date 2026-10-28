import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AuthContext } from '../hooks/AuthContext.js';
import HomePage from './HomePage.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import DashboardPage from './admin/DashboardPage.jsx';
import { getRepositories } from '../services/github.js';
import { getFeaturedProjects } from '../services/featured.js';
import { getMessages, getOwnerFeatured, toggleFeatured } from '../services/dashboard.js';

vi.mock('../services/github.js', () => ({ getRepositories: vi.fn() }));
vi.mock('../services/featured.js', () => ({ getFeaturedProjects: vi.fn() }));
vi.mock('../services/dashboard.js', () => ({
  getMessages: vi.fn(),
  getOwnerFeatured: vi.fn(),
  toggleFeatured: vi.fn(),
  setResponded: vi.fn(),
}));
vi.mock('../services/supabase.js', () => ({ signOut: vi.fn() }));

// Dados usados somente nos testes; nenhuma conta externa é acessada.
const repo = {
  id: 1,
  name: 'projeto-teste',
  language: 'JavaScript',
  owner: { login: 'teste' },
  updated_at: '2026-10-28T00:00:00Z',
  stargazers_count: 0,
};

function renderPage(page) {
  return render(
    <AuthContext.Provider value={{ session: { user: { email: 'pessoa@example.com' } } }}>
      <MemoryRouter>{page}</MemoryRouter>
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  getRepositories.mockResolvedValue([repo]);
  getFeaturedProjects.mockResolvedValue({ configured: true, names: [] });
  getMessages.mockResolvedValue([]);
  getOwnerFeatured.mockResolvedValue([]);
});

describe('estados dos dados de API', () => {
  it('exibe skeleton e depois lista vazia quando o GitHub não tem projetos', async () => {
    let finish;
    getRepositories.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    renderPage(<ProjectsPage />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando projetos');
    await act(async () => {
      finish([]);
    });
    expect(
      await screen.findByRole('heading', { name: 'Ainda não há projetos públicos' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('mantém a home em carregamento enquanto consulta os destaques', async () => {
    let finish;
    getFeaturedProjects.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    renderPage(<HomePage />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Carregando projetos');
    await act(async () => {
      finish({ configured: true, names: [] });
    });
    expect(await screen.findByRole('link', { name: 'projeto teste' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('avisa da falha nos destaques e mantém os projetos recentes disponíveis', async () => {
    getFeaturedProjects.mockRejectedValue(new Error('Falha na consulta dos destaques.'));
    renderPage(<HomePage />);
    expect(await screen.findByRole('link', { name: 'projeto teste' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Os destaques estão indisponíveis');
  });

  it('distingue destaques indisponíveis de ausência de repositórios', async () => {
    getFeaturedProjects.mockResolvedValue({ configured: true, names: ['projeto-removido'] });
    renderPage(<HomePage />);
    expect(
      await screen.findByRole('heading', { name: 'Nenhum destaque disponível' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Ainda não há repositórios públicos para mostrar.'),
    ).not.toBeInTheDocument();
  });

  it('mostra carregamento e estados vazios das listas do painel', async () => {
    let finish;
    getMessages.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    getRepositories.mockResolvedValue([]);
    renderPage(<DashboardPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando painel');
    await act(async () => {
      finish([]);
    });
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma mensagem nesta lista' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Projetos em destaque' }));
    expect(
      await screen.findByRole('heading', { name: 'Nenhum projeto disponível' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/sem seleção, a página inicial/i)).toBeInTheDocument();
  });

  it('mostra erro de consulta do painel e permite tentar novamente', async () => {
    getOwnerFeatured.mockRejectedValueOnce(new Error('Não foi possível carregar os destaques.'));
    renderPage(<DashboardPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os destaques.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma mensagem nesta lista' }),
    ).toBeInTheDocument();
  });

  it('indica salvamento e bloqueia o destaque até a resposta da API', async () => {
    let finish;
    toggleFeatured.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    getOwnerFeatured.mockResolvedValueOnce([]).mockResolvedValueOnce([repo.name]);
    renderPage(<DashboardPage />);
    await screen.findByRole('heading', { name: 'Nenhuma mensagem nesta lista' });
    await userEvent.click(screen.getByRole('button', { name: 'Projetos em destaque' }));
    await userEvent.click(screen.getByRole('checkbox', { name: `Destacar ${repo.name}` }));
    expect(screen.getByText('Salvando…')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await act(async () => {
      finish();
    });
    expect(await screen.findByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox')).toBeEnabled();
  });
});
