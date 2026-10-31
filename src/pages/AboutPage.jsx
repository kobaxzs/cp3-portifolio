import { Link as LinkInterno } from 'react-router';
import { perfil } from '../config.js';
import Icone from '../components/Icon.jsx';
const estudos = [
  {
    numero: '01',
    titulo: 'Fundamentos primeiro',
    texto:
      'Lógica, funções, arrays e objetos em JavaScript: entender a base para construir com mais clareza.',
    etiquetas: ['JavaScript', 'Lógica', 'DOM'],
  },
  {
    numero: '02',
    titulo: 'Interfaces em componentes',
    texto:
      'Estudando como organizar interfaces em React, conectar dados de APIs e lidar com estados e navegação.',
    etiquetas: ['React', 'JSX', 'APIs', 'CSS'],
  },
  {
    numero: '03',
    titulo: 'Além do código',
    texto:
      'Praticando versionamento, organização e documentação para tornar cada projeto mais fácil de entender e evoluir.',
    etiquetas: ['Git', 'GitHub', 'Documentação'],
  },
];
export default function PaginaSobre() {
  return (
    <div className="container page section">
      <div className="page-heading">
        <p className="eyebrow">PORTFÓLIO / SOBRE MIM</p>
        <h1>
          Em construção.
          <br />
          <span>E em movimento.</span>
        </h1>
        <p>
          Sou {perfil.nome}, estudante de Engenharia de Software na FIAP. Este é o espaço onde reúno
          minha jornada, meus estudos e os projetos que vou colocando no mundo.
        </p>
      </div>
      <div className="about-statement">
        <span className="statement-symbol" aria-hidden="true">
          {'{ }'}
        </span>
        <div>
          <p className="eyebrow">A IDEIA POR TRÁS DESTE ESPAÇO</p>
          <h2>
            Aprender também é<br />
            mostrar o processo.
          </h2>
          <p>
            Mais do que uma coleção de resultados, este portfólio é parte do meu aprendizado. Cada
            funcionalidade é uma oportunidade de entender uma ferramenta, fazer escolhas e melhorar
            o próximo projeto.
          </p>
          <p>
            Na FIAP, estou explorando os fundamentos do desenvolvimento web e a organização de
            software. Os projetos publicados no meu GitHub mostram essa evolução na prática.
          </p>
          <a
            href={`https://github.com/${perfil.usuarioGithub}`}
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            Acompanhar no GitHub <Icone nome="seta" tamanho={18} />
          </a>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">O QUE ESTOU ESTUDANDO</p>
            <h2>
              Minha caixa de ferramentas<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="study-grid">
          {estudos.map((estudo) => (
            <article className="study-card" key={estudo.numero}>
              <span className="study-number">/{estudo.numero}</span>
              <h3>{estudo.titulo}</h3>
              <p>{estudo.texto}</p>
              <div className="tag-list">
                {estudo.etiquetas.map((etiqueta) => (
                  <span className="tag" key={etiqueta}>
                    {etiqueta}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="small-cta">
        <h2>Tem algo para compartilhar?</h2>
        <LinkInterno to="/contato" className="button">
          Vamos conversar <Icone nome="seta" tamanho={18} />
        </LinkInterno>
      </section>
    </div>
  );
}
