import { Navigate } from 'react-router';
import { useAuth } from '../hooks/AuthContext.js';
import { ErrorState, LoadingState } from './Feedback.jsx';

export default function ProtectedRoute({ children }) {
  const { loading, owner, error, retry } = useAuth();
  if (loading) return <LoadingState text="Verificando acesso…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!owner) return <Navigate to="/login" replace />;
  return children;
}
