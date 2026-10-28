import { Link } from 'react-router';
import Icon from './Icon.jsx';

export function ProjectArt({ repo, index = 0, large = false }) {
  return (
    <div className={`project-art art-${index % 4}${large ? ' art-large' : ''}`} aria-hidden="true">
      <img
        className="project-art-image"
        src={`/images/project-${index % 4}.svg`}
        alt=""
        width="660"
        height="400"
        loading="lazy"
        decoding="async"
      />
      <span className="art-caption">{repo.language || 'REPOSITÓRIO'}</span>
      <div className="art-label">
        <span className="art-repo">{repo.name}</span>
        <span className="art-path">/{repo.owner?.login || 'projeto'}/</span>
      </div>
      <span className="art-index">{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

export default function ProjectCard({ repo, index }) {
  return (
    <article className="project-card">
      <Link
        className="project-image-link"
        to={`/projetos/${encodeURIComponent(repo.name)}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectArt repo={repo} index={index} />
      </Link>
      <div className="project-body">
        <div className="project-heading">
          <h3>
            <Link to={`/projetos/${encodeURIComponent(repo.name)}`}>
              {repo.name.replaceAll('-', ' ')}
            </Link>
          </h3>
          <Icon name="arrow" />
        </div>
        <p>
          {repo.description || 'Repositório público. Explore o código e os detalhes do projeto.'}
        </p>
        <div className="project-meta">
          <span>
            <i className={`language-dot language-${repo.language?.toLowerCase()}`} />
            {repo.language || 'Sem linguagem informada'}
          </span>
          <span>
            <Icon name="star" size={13} />
            {repo.stargazers_count}
          </span>
          <time dateTime={repo.updated_at}>
            {new Date(repo.updated_at).toLocaleDateString('pt-BR')}
          </time>
        </div>
      </div>
    </article>
  );
}
