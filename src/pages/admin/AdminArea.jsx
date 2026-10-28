import AuthProvider from '../../components/AuthProvider.jsx';
import ProtectedRoute from '../../components/ProtectedRoute.jsx';
import LoginPage from './LoginPage.jsx';
import DashboardPage from './DashboardPage.jsx';

export default function AdminArea({ dashboard = false }) {
  return (
    <div className="container page section admin-area">
      <AuthProvider>
        {dashboard ? (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ) : (
          <LoginPage />
        )}
      </AuthProvider>
    </div>
  );
}
