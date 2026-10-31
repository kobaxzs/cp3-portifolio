export function EstadoCarregamento({ texto = 'Carregando…' }) {
  return (
    <div className="feedback" role="status">
      <span className="spinner" />
      {texto}
    </div>
  );
}
export function EstadoErro({ mensagem, aoTentarNovamente }) {
  return (
    <div className="feedback feedback-error" role="alert">
      <h3>Não foi possível carregar</h3>
      <p>{mensagem}</p>
      {aoTentarNovamente && (
        <button className="button button-small" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
export function EstadoVazio({ titulo = 'Nada por aqui ainda', children: conteudo }) {
  return (
    <div className="feedback empty-state">
      <span className="empty-symbol" aria-hidden="true">
        [ ]
      </span>
      <h3>{titulo}</h3>
      {conteudo && <p>{conteudo}</p>}
    </div>
  );
}
export function EsqueletosProjetos({ quantidade = 3 }) {
  return (
    <div className="project-grid" role="status" aria-label="Carregando projetos">
      <span className="sr-only">Carregando projetos…</span>
      {[0, 1, 2, 3, 4, 5].slice(0, quantidade).map((numero) => (
        <div className="project-card skeleton-card" key={numero} aria-hidden="true">
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
