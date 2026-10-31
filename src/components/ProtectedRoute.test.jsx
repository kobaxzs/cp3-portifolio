import { render as renderizar, screen as tela } from '@testing-library/react';
import { MemoryRouter as RotasMemoria, Route as Rota, Routes as Rotas } from 'react-router';
import { describe as descrever, expect as esperar, it as teste } from 'vitest';
import { ContextoAutenticacao } from '../hooks/AuthContext.js';
import RotaProtegida from './ProtectedRoute.jsx';
function renderizarRota(autenticacao) {
  return renderizar(
    <ContextoAutenticacao.Provider value={autenticacao}>
      <RotasMemoria initialEntries={['/dashboard']}>
        <Rotas>
          <Rota path="/login" element={<h1>Entrar no painel</h1>} />
          <Rota
            path="/dashboard"
            element={
              <RotaProtegida>
                <h1>Mensagens privadas</h1>
              </RotaProtegida>
            }
          />
        </Rotas>
      </RotasMemoria>
    </ContextoAutenticacao.Provider>,
  );
}
descrever('acesso ao dashboard', () => {
  teste('redireciona um visitante sem login e não monta conteúdo privado', async () => {
    renderizarRota({
      carregando: false,
      dono: false,
      sessao: null,
    });
    esperar(
      await tela.findByRole('heading', {
        name: 'Entrar no painel',
      }),
    ).toBeInTheDocument();
    esperar(tela.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  teste('nega acesso a uma sessão que não pertence ao proprietário', async () => {
    renderizarRota({
      carregando: false,
      dono: false,
      sessao: {
        user: {
          id: 'outro-usuario',
        },
      },
    });
    esperar(await tela.findByText('Entrar no painel')).toBeInTheDocument();
  });
  teste('espera a verificação antes de renderizar informações privadas', () => {
    renderizarRota({
      carregando: true,
      dono: false,
    });
    esperar(tela.getByRole('status')).toHaveTextContent('Verificando acesso');
    esperar(tela.queryByText('Mensagens privadas')).not.toBeInTheDocument();
  });
  teste('libera o conteúdo para o proprietário verificado', () => {
    renderizarRota({
      carregando: false,
      dono: true,
    });
    esperar(tela.getByText('Mensagens privadas')).toBeInTheDocument();
  });
});
