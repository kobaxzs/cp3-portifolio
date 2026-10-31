import useDados from '../hooks/useAsyncData.js';
import { obterRepositorios } from '../services/github.js';
import CardProjeto from '../components/ProjectCard.jsx';
import { EstadoVazio, EstadoErro, EsqueletosProjetos } from '../components/Feedback.jsx';
import { perfil } from '../config.js';
import Icone from '../components/Icon.jsx';
export default function PaginaProjetos() {
  const { dados: repositorios, carregando, erro, tentarNovamente } = useDados(obterRepositorios);
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
          href={`https://github.com/${perfil.usuarioGithub}`}
          target="_blank"
          rel="noreferrer"
        >
          Visitar meu GitHub <Icone nome="seta" tamanho={17} />
        </a>
      </div>
      {carregando ? (
        <EsqueletosProjetos quantidade={6} />
      ) : erro ? (
        <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
      ) : repositorios.length ? (
        <div className="project-grid">
          {repositorios.map((repositorio, indice) => (
            <CardProjeto repositorio={repositorio} indice={indice} key={repositorio.id} />
          ))}
        </div>
      ) : (
        <EstadoVazio titulo="Ainda não há projetos públicos">
          Os repositórios aparecerão aqui quando forem publicados no GitHub.
        </EstadoVazio>
      )}
      <p className="source-note">
        Fonte: API pública do GitHub · Repositórios próprios, ordenados pela última atualização.
      </p>
    </div>
  );
}
