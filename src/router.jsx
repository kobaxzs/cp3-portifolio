import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RouteError from './pages/RouteError.jsx';
import { LoadingState } from './components/Feedback.jsx';

// O import dinâmico mantém autenticação e painel fora do pacote inicial.
const AdminArea = lazy(() => import('./pages/admin/AdminArea.jsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      { path: 'projetos/:name', element: <ProjectPage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contato', element: <ContactPage /> },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingState text="Carregando acesso do proprietário…" />}>
            <AdminArea />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingState text="Carregando painel…" />}>
            <AdminArea dashboard />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
