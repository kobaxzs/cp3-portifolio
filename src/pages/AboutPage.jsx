import { Link } from 'react-router';
import { profile } from '../config.js';
import Icon from '../components/Icon.jsx';

const studies = [
  {
    number: '01',
    title: 'Fundamentos primeiro',
    text: 'Lógica, funções, arrays e objetos em JavaScript: entender a base para construir com mais clareza.',
    tags: ['JavaScript', 'Lógica', 'DOM'],
  },
  {
    number: '02',
    title: 'Interfaces em componentes',
    text: 'Estudando como organizar interfaces em React, conectar dados de APIs e lidar com estados e navegação.',
    tags: ['React', 'JSX', 'APIs', 'CSS'],
  },
  {
    number: '03',
    title: 'Além do código',
    text: 'Praticando versionamento, organização e documentação para tornar cada projeto mais fácil de entender e evoluir.',
    tags: ['Git', 'GitHub', 'Documentação'],
  },
];

export default function AboutPage() {
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
          Sou {profile.name}, estudante de Engenharia de Software na FIAP. Este é o espaço onde
          reúno minha jornada, meus estudos e os projetos que vou colocando no mundo.
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
            href={`https://github.com/${profile.github}`}
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            Acompanhar no GitHub <Icon name="arrow" size={18} />
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
          {studies.map((study) => (
            <article className="study-card" key={study.number}>
              <span className="study-number">/{study.number}</span>
              <h3>{study.title}</h3>
              <p>{study.text}</p>
              <div className="tag-list">
                {study.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="small-cta">
        <h2>Tem algo para compartilhar?</h2>
        <Link to="/contato" className="button">
          Vamos conversar <Icon name="arrow" size={18} />
        </Link>
      </section>
    </div>
  );
}
