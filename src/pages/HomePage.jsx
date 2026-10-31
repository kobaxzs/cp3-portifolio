import { Link as LinkInterno } from 'react-router';
import { perfil } from '../config.js';
import Icone from '../components/Icon.jsx';
import CardProjeto from '../components/ProjectCard.jsx';
import { EstadoVazio, EstadoErro, EsqueletosProjetos } from '../components/Feedback.jsx';
import useDados from '../hooks/useAsyncData.js';
import { obterRepositorios } from '../services/github.js';
import { obterProjetosDestaque } from '../services/featured.js';
async function carregarInicio() {
  const repositorios = await obterRepositorios();
  let destaques;
  try {
    destaques = await obterProjetosDestaque();
  } catch (erro) {
    destaques = {
      nomes: [],
      erro: erro.message,
    };
  }
  return {
    repositorios,
    destaques,
  };
}
export default function PaginaInicial() {
  const { dados, carregando, erro, tentarNovamente } = useDados(carregarInicio);
  const selecionado = dados?.destaques.nomes.length
    ? dados.repositorios.filter((repositorio) => dados.destaques.nomes.includes(repositorio.name))
    : dados?.repositorios.slice(0, 3);
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            ESTUDANTE DE ENGENHARIA DE SOFTWARE
          </p>
          <h1>
            Ideias em mente.
            <br />
            Código <span>na tela.</span>
          </h1>
          <p className="hero-intro">
            Oi, sou o Lucas{' '}
            <span className="wave" aria-hidden="true">
              ↗
            </span>
          </p>
          <p className="hero-description">
            Estudo Engenharia de Software na FIAP e estou construindo meu caminho no
            desenvolvimento. Aqui, compartilho o que aprendo e o que transformo em projeto.
          </p>
          <div className="hero-buttons">
            <LinkInterno to="/projetos" className="button">
              Explorar projetos <Icone nome="direita" tamanho={18} />
            </LinkInterno>
            <LinkInterno to="/contato" className="text-link">
              Vamos conversar <Icone nome="seta" tamanho={17} />
            </LinkInterno>
          </div>
          <div className="hero-footnote">
            <span>APRENDER. CONSTRUIR. EVOLUIR.</span>
            <span className="hero-line" />
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Ilustração em código da minha jornada de aprendizado"
        >
          <div className="visual-label">
            <span>DIÁRIO DE CONSTRUÇÃO</span>
            <Icone nome="seta" tamanho={18} />
          </div>
          <div className="code-window">
            <div className="code-window-bar">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span>lucas.jsx</span>
              <span>JSX</span>
            </div>
            <div className="code-content">
              <span className="code-comment">// Um projeto de cada vez.</span>
              <p>
                <span className="code-purple">const</span>{' '}
                <span className="code-orange">desenvolvedor</span> = {'{'}
              </p>
              <div className="code-indent">
                <p>
                  nome: <span className="code-green">'Lucas Kobayashi'</span>,
                </p>
                <p>
                  formação: <span className="code-green">'Eng. de Software'</span>,
                </p>
                <p>
                  instituição: <span className="code-green">'FIAP'</span>,
                </p>
                <p>
                  foco: [<span className="code-green">'aprender'</span>,{' '}
                  <span className="code-green">'criar'</span>],
                </p>
                <p>
                  próximoPasso: <span className="code-purple">() =&gt;</span>{' '}
                  <span className="code-orange">evoluir</span>()
                </p>
              </div>
              <p>{'}'};</p>
              <p className="code-last">
                <span className="code-purple">export default</span> desenvolvedor;
                <span className="code-cursor" />
              </p>
            </div>
            <div className="code-status">
              <span>
                <span className="status-dot" />
                Em constante desenvolvimento
              </span>
              <span>UTF-8</span>
            </div>
          </div>
          <div className="floating-label">
            <span className="floating-icon">
              <Icone nome="ramificacao" tamanho={22} />
            </span>
            <div>
              Da ideia ao primeiro commit.<small>O aprendizado acontece construindo.</small>
            </div>
          </div>
          <Icone nome="asterisco" className="visual-cross" />
        </div>
      </section>
      <div className="tech-strip">
        <div className="container tech-strip-inner">
          <span>NA MINHA JORNADA</span>
          {['JavaScript', 'React', 'HTML & CSS', 'Git & GitHub'].map((habilidade, indice) => (
            <span className="tech-strip-item" key={habilidade}>
              {indice > 0 && <Icone nome="asterisco" className="strip-star" />}
              <strong>{habilidade}</strong>
            </span>
          ))}
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / DA TEORIA À PRÁTICA</p>
            <h2>
              {dados?.destaques.nomes.length ? 'Projetos em destaque' : 'Projetos recentes'}
              <span className="accent">.</span>
            </h2>
          </div>
          <LinkInterno className="text-link" to="/projetos">
            Ver todos os projetos <Icone nome="seta" tamanho={18} />
          </LinkInterno>
        </div>
        <p className="section-description">
          Código real, aprendizado contínuo. Projetos carregados diretamente do meu GitHub.
        </p>
        {carregando ? (
          <EsqueletosProjetos />
        ) : erro ? (
          <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
        ) : selecionado.length ? (
          <div className="project-grid">
            {selecionado.map((repositorio, indice) => (
              <CardProjeto repositorio={repositorio} indice={indice} key={repositorio.id} />
            ))}
          </div>
        ) : (
          <EstadoVazio
            titulo={
              dados?.repositorios.length
                ? 'Nenhum destaque disponível'
                : 'Os próximos projetos começam aqui'
            }
          >
            {dados?.repositorios.length
              ? 'Os projetos destacados não estão disponíveis no GitHub. Você pode consultar todos os projetos.'
              : 'Ainda não há repositórios públicos para mostrar.'}
          </EstadoVazio>
        )}
        {dados?.destaques.erro && (
          <p className="notice" role="status">
            Os destaques estão indisponíveis. Exibindo os projetos mais recentes do GitHub.
          </p>
        )}
      </section>
      <section className="container about-preview">
        <div>
          <p className="eyebrow">02 / POR TRÁS DO CÓDIGO</p>
          <h2>
            Curiosidade é o<br />
            meu ponto de partida.
          </h2>
        </div>
        <div>
          <p>
            Sou {perfil.nome}, estudante de Engenharia de Software na FIAP. Estou explorando como
            transformar problemas em interfaces e soluções que façam sentido.
          </p>
          <p>
            Este portfólio faz parte dessa jornada: um lugar para reunir meus projetos, praticar o
            que estudo e acompanhar minha evolução.
          </p>
          <LinkInterno className="text-link" to="/sobre">
            Um pouco mais sobre mim <Icone nome="seta" tamanho={18} />
          </LinkInterno>
        </div>
      </section>
      <section className="container contact-banner">
        <div>
          <p className="eyebrow">O PRÓXIMO PASSO PODE SER UMA CONVERSA</p>
          <h2>
            Vamos construir
            <br />
            uma conexão?
          </h2>
        </div>
        <LinkInterno className="round-link" to="/contato" aria-label="Ir para contato">
          <Icone nome="seta" tamanho={38} />
        </LinkInterno>
      </section>
    </>
  );
}
