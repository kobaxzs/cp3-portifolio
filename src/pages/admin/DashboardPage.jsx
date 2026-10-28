import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/AuthContext.js';
import { signOut } from '../../services/supabase.js';
import {
  getMessages,
  getOwnerFeatured,
  setResponded,
  toggleFeatured,
} from '../../services/dashboard.js';
import { getRepositories } from '../../services/github.js';
import useAsyncData from '../../hooks/useAsyncData.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/Feedback.jsx';
import Icon from '../../components/Icon.jsx';

async function loadDashboard() {
  const messages = await getMessages();
  const featured = await getOwnerFeatured();
  const repos = await getRepositories();
  return { messages, featured, repos };
}

export default function DashboardPage() {
  const { session } = useAuth();
  const { data, loading, error, retry } = useAsyncData(loadDashboard);
  const [tab, setTab] = useState('messages');
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState('');
  const [feedback, setFeedback] = useState('');

  async function updateMessage(item) {
    setSaving(item.id);
    setFeedback('');
    try {
      await setResponded(item.id, !item.responded);
      retry();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSaving('');
    }
  }
  async function updateFeatured(name, selected) {
    setSaving(name);
    setFeedback('');
    try {
      await toggleFeatured(name, selected);
      retry();
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSaving('');
    }
  }
  async function exit() {
    try {
      await signOut();
    } catch (err) {
      setFeedback(err.message);
    }
  }

  const messages = (data?.messages || []).filter(
    (item) => filter === 'all' || (filter === 'pending' ? !item.responded : item.responded),
  );

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
          <h1>
            Seu espaço de controle<span className="accent">.</span>
          </h1>
          <p className="muted">{session.user.email}</p>
        </div>
        <button className="button button-outline button-small" onClick={exit}>
          Sair da conta <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="dashboard-tabs" role="group" aria-label="Seções do painel">
        <button aria-pressed={tab === 'messages'} onClick={() => setTab('messages')}>
          Mensagens {data && <span>{data.messages.filter((item) => !item.responded).length}</span>}
        </button>
        <button aria-pressed={tab === 'featured'} onClick={() => setTab('featured')}>
          Projetos em destaque
        </button>
      </div>
      {feedback && (
        <p className="form-feedback error" role="alert">
          {feedback}
        </p>
      )}
      {loading ? (
        <LoadingState text="Carregando painel…" />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : tab === 'messages' ? (
        <section>
          <div className="panel-section-heading">
            <h2>Conversas recebidas</h2>
            <label className="inline-label">
              Exibir
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="answered">Respondidas</option>
              </select>
            </label>
          </div>
          {messages.length ? (
            <div className="message-list">
              {messages.map((item) => (
                <article className="message-card" key={item.id}>
                  <div className="message-header">
                    <div>
                      <h3>{item.name}</h3>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </div>
                    <time dateTime={item.created_at}>
                      {new Date(item.created_at).toLocaleString('pt-BR')}
                    </time>
                  </div>
                  <span className={`tag ${item.responded ? 'tag-success' : ''}`}>
                    {item.responded ? 'Respondida' : 'Pendente'}
                  </span>
                  {!item.email_sent && (
                    <span className="tag tag-warning">Notificação de e-mail pendente</span>
                  )}
                  <h4>{item.subject}</h4>
                  <p className="message-content">{item.message}</p>
                  <div className="message-actions">
                    <a
                      className="text-link"
                      href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}
                    >
                      Responder por e-mail <Icon name="arrow" size={16} />
                    </a>
                    <button
                      disabled={Boolean(saving)}
                      className="button button-small button-outline"
                      onClick={() => updateMessage(item)}
                    >
                      {saving === item.id
                        ? 'Salvando…'
                        : item.responded
                          ? 'Marcar como pendente'
                          : 'Marcar como respondida'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhuma mensagem nesta lista">
              As mensagens enviadas pelo formulário serão exibidas aqui.
            </EmptyState>
          )}
        </section>
      ) : (
        <section>
          <div className="panel-section-heading">
            <div>
              <h2>Destaques da página inicial</h2>
              <p className="muted">
                As alterações são salvas no banco e ficam visíveis para os visitantes.
              </p>
            </div>
            <Link to="/" className="text-link">
              Ver início <Icon name="arrow" size={16} />
            </Link>
          </div>
          {!data.featured.length && (
            <p className="notice">
              Sem seleção, a página inicial mostra os três repositórios mais recentes.
            </p>
          )}
          {data.repos.length ? (
            <div className="featured-list">
              {data.repos.map((repo) => (
                <label className="featured-option" key={repo.id}>
                  <span>
                    <strong>{repo.name}</strong>
                    <small aria-live="polite">
                      {saving === repo.name
                        ? 'Salvando…'
                        : repo.language || 'Sem linguagem informada'}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    aria-label={`Destacar ${repo.name}`}
                    checked={data.featured.includes(repo.name)}
                    disabled={Boolean(saving)}
                    onChange={(event) => updateFeatured(repo.name, event.target.checked)}
                  />
                </label>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum projeto disponível">
              Publique seus repositórios no GitHub para selecioná-los.
            </EmptyState>
          )}
        </section>
      )}
    </>
  );
}
