import { Link, useParams } from 'react-router';
import useAsyncData from '../hooks/useAsyncData.js';
import { getRepositories, safeExternalUrl } from '../services/github.js';
import { EmptyState, ErrorState, LoadingState } from '../components/Feedback.jsx';
import { ProjectArt } from '../components/ProjectCard.jsx';
import Icon from '../components/Icon.jsx';

export default function ProjectPage() {
  const { name } = useParams();
  const { data: repos, loading, error, retry } = useAsyncData(getRepositories);
  if (loading)
    return (
      <div className="container section">
        <LoadingState text="Carregando detalhes do projeto…" />
      </div>
    );
  if (error)
    return (
      <div className="container section">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  const repo = repos.find((item) => item.name === name);
  if (!repo)
    return (
      <div className="container section">
        <EmptyState title="Projeto não encontrado">
          Este repositório pode ter sido renomeado, removido ou tornado privado.
        </EmptyState>
        <Link to="/projetos" className="button">
          Voltar aos projetos
        </Link>
      </div>
    );
  const liveUrl = safeExternalUrl(repo.homepage);

  return (
    <article className="container page section">
      <Link to="/projetos" className="text-link back-link">
        ← Todos os projetos
      </Link>
      <div className="project-detail-heading">
        <div>
          <p className="eyebrow">DO MEU GITHUB / {repo.language || 'REPOSITÓRIO'}</p>
          <h1>
            {repo.name.replaceAll('-', ' ')}
            <span className="accent">.</span>
          </h1>
          <p className="lead">
            {repo.description ||
              'O autor ainda não adicionou uma descrição a este repositório no GitHub.'}
          </p>
        </div>
        <div className="detail-actions">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="button">
            <Icon name="github" />
            Ver código <Icon name="arrow" size={16} />
          </a>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="button button-outline">
              Abrir projeto <Icon name="arrow" size={16} />
            </a>
          )}
        </div>
      </div>
      <ProjectArt repo={repo} index={repos.indexOf(repo)} large />
      <div className="detail-grid">
        <section>
          <p className="eyebrow">SOBRE O REPOSITÓRIO</p>
          <h2>Código aberto para explorar.</h2>
          <p>
            Este projeto é carregado diretamente do GitHub. Lá você encontra os arquivos, o
            histórico de desenvolvimento e o README com as instruções disponíveis.
          </p>
          <div className="tag-list">
            {(repo.topics || []).map((topic) => (
              <span className="tag" key={topic}>
                {topic}
              </span>
            ))}
          </div>
        </section>
        <dl className="repo-facts">
          <div>
            <dt>Linguagem principal</dt>
            <dd>{repo.language || 'Não informada'}</dd>
          </div>
          <div>
            <dt>Criado em</dt>
            <dd>{new Date(repo.created_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Última atualização</dt>
            <dd>{new Date(repo.updated_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Estrelas / Forks</dt>
            <dd>
              {repo.stargazers_count} / {repo.forks_count}
            </dd>
          </div>
          <div>
            <dt>Licença</dt>
            <dd>{repo.license?.name || 'Não informada'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
