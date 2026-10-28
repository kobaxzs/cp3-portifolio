export function LoadingState({ text = 'Carregando…' }) {
  return (
    <div className="feedback" role="status">
      <span className="spinner" />
      {text}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="feedback feedback-error" role="alert">
      <h3>Não foi possível carregar</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="button button-small" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nada por aqui ainda', children }) {
  return (
    <div className="feedback empty-state">
      <span className="empty-symbol" aria-hidden="true">
        [ ]
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

export function ProjectSkeletons({ count = 3 }) {
  return (
    <div className="project-grid" role="status" aria-label="Carregando projetos">
      <span className="sr-only">Carregando projetos…</span>
      {[0, 1, 2, 3, 4, 5].slice(0, count).map((i) => (
        <div className="project-card skeleton-card" key={i} aria-hidden="true">
          <div className="project-art skeleton" />
          <div className="project-body">
            <div className="project-heading">
              <div className="skeleton skeleton-title" />
            </div>
            <p className="skeleton" />
            <div className="project-meta">
              <div className="skeleton skeleton-line" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
