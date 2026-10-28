import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '../hooks/AuthContext.js';
import ProtectedRoute from './ProtectedRoute.jsx';

function renderRoute(auth) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<h1>Entrar no painel</h1>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Mensagens privadas</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('acesso ao dashboard', () => {
  it('redireciona um visitante sem login e não monta conteúdo privado', async () => {
    renderRoute({ loading: false, owner: false, session: null });
    expect(await screen.findByRole('heading', { name: 'Entrar no painel' })).toBeInTheDocument();
    expect(screen.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  it('nega acesso a uma sessão que não pertence ao proprietário', async () => {
    renderRoute({ loading: false, owner: false, session: { user: { id: 'outro-usuario' } } });
    expect(await screen.findByText('Entrar no painel')).toBeInTheDocument();
  });
  it('espera a verificação antes de renderizar informações privadas', () => {
    renderRoute({ loading: true, owner: false });
    expect(screen.getByRole('status')).toHaveTextContent('Verificando acesso');
    expect(screen.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  it('libera o conteúdo para o proprietário verificado', () => {
    renderRoute({ loading: false, owner: true });
    expect(screen.getByText('Mensagens privadas')).toBeInTheDocument();
  });
});
