import { Link as LinkInterno } from 'react-router';
import Icone from './Icon.jsx';
export function ArteProjeto({ repositorio, indice = 0, grande = false }) {
  return (
    <div
      className={`project-art art-${indice % 4}${grande ? ' art-large' : ''}`}
      aria-hidden="true"
    >
      <img
        className="project-art-image"
        src={`/images/project-${indice % 4}.svg`}
        alt=""
        width="660"
        height="400"
        loading="lazy"
        decoding="async"
      />
      <span className="art-caption">{repositorio.language || 'REPOSITÓRIO'}</span>
      <div className="art-label">
        <span className="art-repo">{repositorio.name}</span>
        <span className="art-path">/{repositorio.owner?.login || 'projeto'}/</span>
      </div>
      <span className="art-index">{String(indice + 1).padStart(2, '0')}</span>
    </div>
  );
}
export default function CardProjeto({ repositorio, indice }) {
  return (
    <article className="project-card">
      <LinkInterno
        className="project-image-link"
        to={`/projetos/${encodeURIComponent(repositorio.name)}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArteProjeto repositorio={repositorio} indice={indice} />
      </LinkInterno>
      <div className="project-body">
        <div className="project-heading">
          <h3>
            <LinkInterno to={`/projetos/${encodeURIComponent(repositorio.name)}`}>
              {repositorio.name.replaceAll('-', ' ')}
            </LinkInterno>
          </h3>
          <Icone nome="seta" />
        </div>
        <p>
          {repositorio.description ||
            'Repositório público. Explore o código e os detalhes do projeto.'}
        </p>
        <div className="project-meta">
          <span>
            <i className={`language-dot language-${repositorio.language?.toLowerCase()}`} />
            {repositorio.language || 'Sem linguagem informada'}
          </span>
          <span>
            <Icone nome="estrela" tamanho={13} />
            {repositorio.stargazers_count}
          </span>
          <time dateTime={repositorio.updated_at}>
            {new Date(repositorio.updated_at).toLocaleDateString('pt-BR')}
          </time>
        </div>
      </div>
    </article>
  );
}
