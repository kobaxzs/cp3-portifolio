import { perfil } from '../config.js';
import FormularioContato from '../components/ContactForm.jsx';
import Icone from '../components/Icon.jsx';
export default function PaginaContato() {
  return (
    <div className="container page section">
      <div className="page-heading">
        <p className="eyebrow">PORTFÓLIO / CONTATO</p>
        <h1>
          Boas ideias começam
          <br />
          com um <span>olá.</span>
        </h1>
        <p>
          Uma oportunidade, um projeto ou só uma troca de ideias. Fique à vontade para me chamar.
        </p>
      </div>
      <div className="contact-layout">
        <aside className="contact-aside">
          <Icone nome="asterisco" className="contact-asterisk" />
          <h2>Vamos conversar.</h2>
          <p>
            Prefere um contato direto?
            <br />
            Você também me encontra por aqui.
          </p>
          <a className="contact-channel" href={`mailto:${perfil.email}`}>
            <Icone nome="email" />
            <span>
              <small>E-MAIL</small>
              {perfil.email}
            </span>
            <Icone nome="seta" tamanho={17} />
          </a>
          <a
            className="contact-channel"
            href={`https://github.com/${perfil.usuarioGithub}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icone nome="github" />
            <span>
              <small>GITHUB</small>@{perfil.usuarioGithub}
            </span>
            <Icone nome="seta" tamanho={17} />
          </a>
          {perfil.linkedin && (
            <a className="contact-channel" href={perfil.linkedin} target="_blank" rel="noreferrer">
              <span>in</span>
              <span>
                <small>LINKEDIN</small>Meu perfil profissional
              </span>
              <Icone nome="seta" tamanho={17} />
            </a>
          )}
        </aside>
        <FormularioContato />
      </div>
    </div>
  );
}
