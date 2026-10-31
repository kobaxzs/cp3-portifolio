import ProvedorAutenticacao from '../../components/AuthProvider.jsx';
import RotaProtegida from '../../components/ProtectedRoute.jsx';
import PaginaLogin from './LoginPage.jsx';
import PaginaPainel from './DashboardPage.jsx';
export default function AreaAdministrativa({ painel = false }) {
  return (
    <div className="container page section admin-area">
      <ProvedorAutenticacao>
        {painel ? (
          <RotaProtegida>
            <PaginaPainel />
          </RotaProtegida>
        ) : (
          <PaginaLogin />
        )}
      </ProvedorAutenticacao>
    </div>
  );
}
