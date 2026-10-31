import { Link as LinkInterno, useParams as useParametros } from 'react-router';
import useDados from '../hooks/useAsyncData.js';
import { obterRepositorios, validarUrlExterna } from '../services/github.js';
import { EstadoVazio, EstadoErro, EstadoCarregamento } from '../components/Feedback.jsx';
import { ArteProjeto } from '../components/ProjectCard.jsx';
import Icone from '../components/Icon.jsx';
export default function PaginaProjeto() {
  const { name: nome } = useParametros();
  const { dados: repositorios, carregando, erro, tentarNovamente } = useDados(obterRepositorios);
  if (carregando)
    return (
      <div className="container section">
        <EstadoCarregamento texto="Carregando detalhes do projeto…" />
      </div>
    );
  if (erro)
    return (
      <div className="container section">
        <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
      </div>
    );
  const repositorio = repositorios.find((item) => item.name === nome);
  if (!repositorio)
    return (
      <div className="container section">
        <EstadoVazio titulo="Projeto não encontrado">
          Este repositório pode ter sido renomeado, removido ou tornado privado.
        </EstadoVazio>
        <LinkInterno to="/projetos" className="button">
          Voltar aos projetos
        </LinkInterno>
      </div>
    );
  const urlPublicada = validarUrlExterna(repositorio.homepage);
  return (
    <article className="container page section">
      <LinkInterno to="/projetos" className="text-link back-link">
        ← Todos os projetos
      </LinkInterno>
      <div className="project-detail-heading">
        <div>
          <p className="eyebrow">DO MEU GITHUB / {repositorio.language || 'REPOSITÓRIO'}</p>
          <h1>
            {repositorio.name.replaceAll('-', ' ')}
            <span className="accent">.</span>
          </h1>
          <p className="lead">
            {repositorio.description ||
              'O autor ainda não adicionou uma descrição a este repositório no GitHub.'}
          </p>
        </div>
        <div className="detail-actions">
          <a href={repositorio.html_url} target="_blank" rel="noreferrer" className="button">
            <Icone nome="github" />
            Ver código <Icone nome="seta" tamanho={16} />
          </a>
          {urlPublicada && (
            <a
              href={urlPublicada}
              target="_blank"
              rel="noreferrer"
              className="button button-outline"
            >
              Abrir projeto <Icone nome="seta" tamanho={16} />
            </a>
          )}
        </div>
      </div>
      <ArteProjeto repositorio={repositorio} indice={repositorios.indexOf(repositorio)} grande />
      <div className="detail-grid">
        <section>
          <p className="eyebrow">SOBRE O REPOSITÓRIO</p>
          <h2>Código aberto para explorar.</h2>
          <p>
            Este projeto é carregado diretamente do GitHub. Lá você encontra os arquivos, o
            histórico de desenvolvimento e o README com as instruções disponíveis.
          </p>
          <div className="tag-list">
            {(repositorio.topics || []).map((topico) => (
              <span className="tag" key={topico}>
                {topico}
              </span>
            ))}
          </div>
        </section>
        <dl className="repo-facts">
          <div>
            <dt>Linguagem principal</dt>
            <dd>{repositorio.language || 'Não informada'}</dd>
          </div>
          <div>
            <dt>Criado em</dt>
            <dd>{new Date(repositorio.created_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Última atualização</dt>
            <dd>{new Date(repositorio.updated_at).toLocaleDateString('pt-BR')}</dd>
          </div>
          <div>
            <dt>Estrelas / Forks</dt>
            <dd>
              {repositorio.stargazers_count} / {repositorio.forks_count}
            </dd>
          </div>
          <div>
            <dt>Licença</dt>
            <dd>{repositorio.license?.name || 'Não informada'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
