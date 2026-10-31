import {
  beforeEach as antesDeCadaTeste,
  describe as descrever,
  expect as esperar,
  it as teste,
  vi,
} from 'vitest';
import { act as agir, render as renderizar, screen as tela } from '@testing-library/react';
import eventosUsuario from '@testing-library/user-event';
import { MemoryRouter as RotasMemoria } from 'react-router';
import { ContextoAutenticacao } from '../hooks/AuthContext.js';
import PaginaInicial from './HomePage.jsx';
import PaginaProjetos from './ProjectsPage.jsx';
import PaginaPainel from './admin/DashboardPage.jsx';
import { obterRepositorios } from '../services/github.js';
import { obterProjetosDestaque } from '../services/featured.js';
import { obterMensagens, obterDestaquesDono, alterarDestaque } from '../services/dashboard.js';
vi.mock('../services/github.js', () => ({
  obterRepositorios: vi.fn(),
}));
vi.mock('../services/featured.js', () => ({
  obterProjetosDestaque: vi.fn(),
}));
vi.mock('../services/dashboard.js', () => ({
  obterMensagens: vi.fn(),
  obterDestaquesDono: vi.fn(),
  alterarDestaque: vi.fn(),
  marcarRespondida: vi.fn(),
}));
vi.mock('../services/supabase.js', () => ({
  encerrarSessao: vi.fn(),
}));

// Dados usados somente nos testes; nenhuma conta externa é acessada.
const repositorio = {
  id: 1,
  name: 'projeto-teste',
  language: 'JavaScript',
  dono: {
    login: 'teste',
  },
  updated_at: '2026-10-28T00:00:00Z',
  stargazers_count: 0,
};
function renderizarPagina(pagina) {
  return renderizar(
    <ContextoAutenticacao.Provider
      value={{
        sessao: {
          user: {
            email: 'pessoa@example.com',
          },
        },
      }}
    >
      <RotasMemoria>{pagina}</RotasMemoria>
    </ContextoAutenticacao.Provider>,
  );
}
antesDeCadaTeste(() => {
  vi.resetAllMocks();
  obterRepositorios.mockResolvedValue([repositorio]);
  obterProjetosDestaque.mockResolvedValue({
    configurado: true,
    nomes: [],
  });
  obterMensagens.mockResolvedValue([]);
  obterDestaquesDono.mockResolvedValue([]);
});
descrever('estados dos dados de API', () => {
  teste('exibe skeleton e depois lista vazia quando o GitHub não tem projetos', async () => {
    let concluir;
    obterRepositorios.mockReturnValue(
      new Promise((resolver) => {
        concluir = resolver;
      }),
    );
    renderizarPagina(<PaginaProjetos />);
    esperar(tela.getByRole('status')).toHaveAttribute('aria-label', 'Carregando projetos');
    await agir(async () => {
      concluir([]);
    });
    esperar(
      await tela.findByRole('heading', {
        name: 'Ainda não há projetos públicos',
      }),
    ).toBeInTheDocument();
    esperar(tela.queryByRole('status')).not.toBeInTheDocument();
  });
  teste('mantém a home em carregamento enquanto consulta os destaques', async () => {
    let concluir;
    obterProjetosDestaque.mockReturnValue(
      new Promise((resolver) => {
        concluir = resolver;
      }),
    );
    renderizarPagina(<PaginaInicial />);
    esperar(tela.getByRole('status')).toHaveAttribute('aria-label', 'Carregando projetos');
    await agir(async () => {
      concluir({
        configurado: true,
        nomes: [],
      });
    });
    esperar(
      await tela.findByRole('link', {
        name: 'projeto teste',
      }),
    ).toBeInTheDocument();
    esperar(tela.queryByRole('status')).not.toBeInTheDocument();
  });
  teste('avisa da falha nos destaques e mantém os projetos recentes disponíveis', async () => {
    obterProjetosDestaque.mockRejectedValue(new Error('Falha na consulta dos destaques.'));
    renderizarPagina(<PaginaInicial />);
    esperar(
      await tela.findByRole('link', {
        name: 'projeto teste',
      }),
    ).toBeInTheDocument();
    esperar(tela.getByRole('status')).toHaveTextContent('Os destaques estão indisponíveis');
  });
  teste('distingue destaques indisponíveis de ausência de repositórios', async () => {
    obterProjetosDestaque.mockResolvedValue({
      configurado: true,
      nomes: ['projeto-removido'],
    });
    renderizarPagina(<PaginaInicial />);
    esperar(
      await tela.findByRole('heading', {
        name: 'Nenhum destaque disponível',
      }),
    ).toBeInTheDocument();
    esperar(
      tela.queryByText('Ainda não há repositórios públicos para mostrar.'),
    ).not.toBeInTheDocument();
  });
  teste('mostra carregamento e estados vazios das listas do painel', async () => {
    let concluir;
    obterMensagens.mockReturnValue(
      new Promise((resolver) => {
        concluir = resolver;
      }),
    );
    obterRepositorios.mockResolvedValue([]);
    renderizarPagina(<PaginaPainel />);
    esperar(tela.getByRole('status')).toHaveTextContent('Carregando painel');
    await agir(async () => {
      concluir([]);
    });
    esperar(
      await tela.findByRole('heading', {
        name: 'Nenhuma mensagem nesta lista',
      }),
    ).toBeInTheDocument();
    await eventosUsuario.click(
      tela.getByRole('button', {
        name: 'Projetos em destaque',
      }),
    );
    esperar(
      await tela.findByRole('heading', {
        name: 'Nenhum projeto disponível',
      }),
    ).toBeInTheDocument();
    esperar(tela.getByText(/sem seleção, a página inicial/i)).toBeInTheDocument();
  });
  teste('mostra erro de consulta do painel e permite tentar novamente', async () => {
    obterDestaquesDono.mockRejectedValueOnce(new Error('Não foi possível carregar os destaques.'));
    renderizarPagina(<PaginaPainel />);
    esperar(await tela.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os destaques.',
    );
    await eventosUsuario.click(
      tela.getByRole('button', {
        name: 'Tentar novamente',
      }),
    );
    esperar(
      await tela.findByRole('heading', {
        name: 'Nenhuma mensagem nesta lista',
      }),
    ).toBeInTheDocument();
  });
  teste('indica salvamento e bloqueia o destaque até a resposta da API', async () => {
    let concluir;
    alterarDestaque.mockImplementation(
      () =>
        new Promise((resolver) => {
          concluir = resolver;
        }),
    );
    obterDestaquesDono.mockResolvedValueOnce([]).mockResolvedValueOnce([repositorio.name]);
    renderizarPagina(<PaginaPainel />);
    await tela.findByRole('heading', {
      name: 'Nenhuma mensagem nesta lista',
    });
    await eventosUsuario.click(
      tela.getByRole('button', {
        name: 'Projetos em destaque',
      }),
    );
    await eventosUsuario.click(
      tela.getByRole('checkbox', {
        name: `Destacar ${repositorio.name}`,
      }),
    );
    esperar(tela.getByText('Salvando…')).toBeInTheDocument();
    esperar(tela.getByRole('checkbox')).toBeDisabled();
    await agir(async () => {
      concluir();
    });
    esperar(await tela.findByRole('checkbox')).toBeChecked();
    esperar(tela.getByRole('checkbox')).toBeEnabled();
  });
});
