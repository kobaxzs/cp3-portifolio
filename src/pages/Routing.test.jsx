import {
  afterAll as depoisDeTodosTestes,
  afterEach as depoisDeCadaTeste,
  beforeEach as antesDeCadaTeste,
  describe as descrever,
  expect as esperar,
  it as teste,
  vi,
} from 'vitest';
import { render as renderizar, screen as tela } from '@testing-library/react';
import eventosUsuario from '@testing-library/user-event';
import {
  createMemoryRouter as criarRotasMemoria,
  RouterProvider as ProvedorRotas,
} from 'react-router';
import { rotas } from '../router.jsx';
import { obterRepositorios } from '../services/github.js';
vi.mock('../services/github.js', async (importarOriginal) => ({
  ...(await importarOriginal()),
  obterRepositorios: vi.fn(),
}));
vi.mock('../services/featured.js', () => ({
  obterProjetosDestaque: vi.fn(async () => ({
    configurado: false,
    nomes: [],
  })),
}));

// Repositório exclusivo dos testes, sem dados fictícios no site.
const repositorio = {
  id: 1,
  name: 'meu-app',
  description: 'Projeto utilizado apenas para conferir as rotas.',
  language: 'JavaScript',
  owner: {
    login: 'usuario-de-teste',
  },
  html_url: 'https://github.com/usuario-de-teste/meu-app',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-10-28T00:00:00Z',
  stargazers_count: 0,
  forks_count: 0,
};
let rotasAtuais;
function abrirCaminho(caminho) {
  // Usa as mesmas definições de rota da aplicação.
  rotasAtuais = criarRotasMemoria(rotas.routes, {
    initialEntries: [caminho],
  });
  renderizar(<ProvedorRotas router={rotasAtuais} />);
}
antesDeCadaTeste(() => {
  vi.stubGlobal('scrollTo', vi.fn());
  obterRepositorios.mockReset();
  obterRepositorios.mockResolvedValue([repositorio]);
});
depoisDeCadaTeste(() => rotasAtuais?.dispose());
depoisDeTodosTestes(() => rotas.dispose());
descrever('rotas públicas', () => {
  teste('abre um projeto diretamente pelo endereço individual', async () => {
    abrirCaminho('/projetos/meu-app');
    esperar(
      await tela.findByRole('heading', {
        level: 1,
        name: /meu app/i,
      }),
    ).toBeInTheDocument();
    esperar(
      tela.getByRole('link', {
        name: /ver código/i,
      }),
    ).toHaveAttribute('href', repositorio.html_url);
    esperar(rotasAtuais.state.location.pathname).toBe('/projetos/meu-app');
  });
  teste('mostra uma página 404 e permite voltar ao início', async () => {
    abrirCaminho('/pagina-inexistente');
    esperar(
      await tela.findByRole('heading', {
        name: /saímos do caminho/i,
      }),
    ).toBeInTheDocument();
    await eventosUsuario.click(
      tela.getByRole('link', {
        name: /voltar ao início/i,
      }),
    );
    esperar(
      await tela.findByRole('heading', {
        name: /ideias em mente/i,
      }),
    ).toBeInTheDocument();
    esperar(rotasAtuais.state.location.pathname).toBe('/');
  });
  teste('explica a falha de API e recupera o projeto ao tentar novamente', async () => {
    obterRepositorios.mockRejectedValueOnce(new Error('Não foi possível conectar ao GitHub.'));
    obterRepositorios.mockResolvedValueOnce([repositorio]);
    abrirCaminho('/projetos/meu-app');
    esperar(await tela.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao GitHub.',
    );
    esperar(tela.queryByText(/saímos do caminho/i)).not.toBeInTheDocument();
    await eventosUsuario.click(
      tela.getByRole('button', {
        name: /tentar novamente/i,
      }),
    );
    esperar(
      await tela.findByRole('heading', {
        level: 1,
        name: /meu app/i,
      }),
    ).toBeInTheDocument();
  });
  teste('informa quando a URL identifica um projeto que não existe no GitHub', async () => {
    abrirCaminho('/projetos/projeto-removido');
    esperar(
      await tela.findByRole('heading', {
        name: 'Projeto não encontrado',
      }),
    ).toBeInTheDocument();
    esperar(
      tela.getByRole('link', {
        name: /voltar aos projetos/i,
      }),
    ).toHaveAttribute('href', '/projetos');
  });
});
