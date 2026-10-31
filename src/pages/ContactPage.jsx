import { profile } from '../config.js';
import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';

export default function ContactPage() {
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
          <Icon name="asterisk" className="contact-asterisk" />
          <h2>Vamos conversar.</h2>
          <p>
            Prefere um contato direto?
            <br />
            Você também me encontra por aqui.
          </p>
          <a className="contact-channel" href={`mailto:${profile.email}`}>
            <Icon name="mail" />
            <span>
              <small>E-MAIL</small>
              {profile.email}
            </span>
            <Icon name="arrow" size={17} />
          </a>
          <a
            className="contact-channel"
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" />
            <span>
              <small>GITHUB</small>@{profile.github}
            </span>
            <Icon name="arrow" size={17} />
          </a>
          {profile.linkedin && (
            <a className="contact-channel" href={profile.linkedin} target="_blank" rel="noreferrer">
              <span>in</span>
              <span>
                <small>LINKEDIN</small>Meu perfil profissional
              </span>
              <Icon name="arrow" size={17} />
            </a>
          )}
        </aside>
        <ContactForm />
      </div>
    </div>
  );
}
