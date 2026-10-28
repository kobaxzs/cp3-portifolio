import useAsyncData from '../hooks/useAsyncData.js';
import { getRepositories } from '../services/github.js';
import ProjectCard from '../components/ProjectCard.jsx';
import { EmptyState, ErrorState, ProjectSkeletons } from '../components/Feedback.jsx';
import { profile } from '../config.js';
import Icon from '../components/Icon.jsx';

export default function ProjectsPage() {
  const { data: repos, loading, error, retry } = useAsyncData(getRepositories);

  return (
    <div className="container page section">
      <div className="page-heading">
        <p className="eyebrow">PORTFÓLIO / PROJETOS</p>
        <h1>
          Aprendizado que
          <br />
          vira <span>construção.</span>
        </h1>
        <p>
          Cada repositório, uma etapa da jornada. Explore meus projetos públicos e acompanhe o
          código.
        </p>
        <a
          className="text-link"
          href={`https://github.com/${profile.github}`}
          target="_blank"
          rel="noreferrer"
        >
          Visitar meu GitHub <Icon name="arrow" size={17} />
        </a>
      </div>
      {loading ? (
        <ProjectSkeletons count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : repos.length ? (
        <div className="project-grid">
          {repos.map((repo, index) => (
            <ProjectCard repo={repo} index={index} key={repo.id} />
          ))}
        </div>
      ) : (
        <EmptyState title="Ainda não há projetos públicos">
          Os repositórios aparecerão aqui quando forem publicados no GitHub.
        </EmptyState>
      )}
      <p className="source-note">
        Fonte: API pública do GitHub · Repositórios próprios, ordenados pela última atualização.
      </p>
    </div>
  );
}
