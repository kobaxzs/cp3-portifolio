import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/AuthContext.js';
import { hasBackend } from '../../config.js';
import { signIn, signOut } from '../../services/supabase.js';
import { LoadingState, ErrorState } from '../../components/Feedback.jsx';
import Icon from '../../components/Icon.jsx';

export default function LoginPage() {
  const { loading, owner, session, error, retry } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function exit() {
    try {
      await signOut();
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) return <LoadingState text="Verificando sessão…" />;
  if (owner) return <Navigate to="/dashboard" replace />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className="login-card">
      <span className="login-mark">
        <Icon name="code" size={28} />
      </span>
      <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
      <h1>
        Bem-vindo de volta<span className="accent">.</span>
      </h1>
      <p>Entre para organizar mensagens e escolher os projetos em destaque.</p>
      {!hasBackend && (
        <div className="notice" role="status">
          O acesso ainda não foi configurado. Preencha as variáveis do Supabase e siga a seção de
          configuração do README.
        </div>
      )}
      {session && !owner ? (
        <div className="notice">
          <p>
            Esta conta não tem acesso ao portfólio. Somente o proprietário cadastrado no banco pode
            abrir o painel.
          </p>
          <button className="button button-outline" onClick={exit}>
            Sair desta conta
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {message && (
            <p role="alert" className="form-feedback error">
              {message}
            </p>
          )}
          <button type="submit" className="button button-full" disabled={!hasBackend || submitting}>
            {submitting ? (
              <>
                <span className="spinner" />
                Entrando…
              </>
            ) : (
              <>
                Entrar no painel <Icon name="arrow" size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
