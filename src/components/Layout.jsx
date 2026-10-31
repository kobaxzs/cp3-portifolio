import { useEffect as useEfeito, useState as useEstado } from 'react';
import {
  Link as LinkInterno,
  NavLink as LinkNavegacao,
  Outlet as ConteudoRota,
  useLocation as useLocalizacao,
} from 'react-router';
import { perfil } from '../config.js';
import Icone from './Icon.jsx';
function obterTemaInicial() {
  try {
    return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}
export default function EstruturaPagina() {
  const [tema, definirTema] = useEstado(obterTemaInicial);
  const [menuAberto, definirMenuAberto] = useEstado(false);
  const localizacao = useLocalizacao();
  useEfeito(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem('portfolio-theme', tema);
    } catch {
      /* O tema continua funcionando sem armazenamento. */
    }
  }, [tema]);
  useEfeito(() => {
    definirMenuAberto(false);
    window.scrollTo(0, 0);
    document.title = `${localizacao.pathname === '/' ? 'Início' : localizacao.pathname.split('/')[1]} — ${perfil.nomeCurto}`;
  }, [localizacao.pathname]);
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <LinkInterno to="/" className="brand" aria-label="Lucas Kobayashi, início">
            <span className="brand-mark">
              lk<span>.</span>
            </span>
            <span className="brand-name">
              Lucas
              <br />
              Kobayashi
            </span>
          </LinkInterno>
          <nav
            aria-label="Navegação principal"
            className={menuAberto ? 'nav is-open' : 'nav'}
            id="main-nav"
          >
            <LinkNavegacao to="/" end>
              Início
            </LinkNavegacao>
            <LinkNavegacao to="/projetos">Projetos</LinkNavegacao>
            <LinkNavegacao to="/sobre">Sobre</LinkNavegacao>
            <LinkNavegacao to="/contato">
              Contato <Icone nome="seta" tamanho={15} />
            </LinkNavegacao>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => definirTema(tema === 'light' ? 'dark' : 'light')}
              aria-label={tema === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
            >
              <Icone nome={tema === 'light' ? 'lua' : 'sol'} />
            </button>
            <button
              className="icon-button menu-toggle"
              aria-controls="main-nav"
              aria-expanded={menuAberto}
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => definirMenuAberto(!menuAberto)}
            >
              <Icone nome={menuAberto ? 'fechar' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo" className="main" tabIndex={-1}>
        <ConteudoRota />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <LinkInterno to="/" className="footer-signature">
            Lucas Kobayashi<span>© {new Date().getFullYear()}</span>
          </LinkInterno>
          <p>Feito com React, curiosidade e café.</p>
          <div className="footer-links">
            <a href={`https://github.com/${perfil.usuarioGithub}`} target="_blank" rel="noreferrer">
              GitHub <Icone nome="seta" tamanho={14} />
            </a>
            <LinkInterno to="/login">Área do proprietário</LinkInterno>
          </div>
        </div>
      </footer>
    </>
  );
}
