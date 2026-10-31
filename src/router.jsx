import { lazy as carregarSobDemanda, Suspense as AguardarCarregamento } from 'react';
import { createBrowserRouter as criarRotasNavegador } from 'react-router';
import EstruturaPagina from './components/Layout.jsx';
import PaginaInicial from './pages/HomePage.jsx';
import PaginaProjetos from './pages/ProjectsPage.jsx';
import PaginaProjeto from './pages/ProjectPage.jsx';
import PaginaSobre from './pages/AboutPage.jsx';
import PaginaContato from './pages/ContactPage.jsx';
import PaginaNaoEncontrada from './pages/NotFoundPage.jsx';
import ErroRota from './pages/RouteError.jsx';
import { EstadoCarregamento } from './components/Feedback.jsx';

// O import dinâmico mantém autenticação e painel fora do pacote inicial.
const AreaAdministrativa = carregarSobDemanda(() => import('./pages/admin/AdminArea.jsx'));
export const rotas = criarRotasNavegador([
  {
    path: '/',
    element: <EstruturaPagina />,
    errorElement: <ErroRota />,
    children: [
      {
        index: true,
        element: <PaginaInicial />,
      },
      {
        path: 'projetos',
        element: <PaginaProjetos />,
      },
      {
        path: 'projetos/:name',
        element: <PaginaProjeto />,
      },
      {
        path: 'sobre',
        element: <PaginaSobre />,
      },
      {
        path: 'contato',
        element: <PaginaContato />,
      },
      {
        path: 'login',
        element: (
          <AguardarCarregamento
            fallback={<EstadoCarregamento texto="Carregando acesso do proprietário…" />}
          >
            <AreaAdministrativa />
          </AguardarCarregamento>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <AguardarCarregamento fallback={<EstadoCarregamento texto="Carregando painel…" />}>
            <AreaAdministrativa painel />
          </AguardarCarregamento>
        ),
      },
      {
        path: '*',
        element: <PaginaNaoEncontrada />,
      },
    ],
  },
]);
