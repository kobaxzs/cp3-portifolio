import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { profile } from '../config.js';
import Icon from './Icon.jsx';

function getInitialTheme() {
  try {
    return localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function Layout() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      /* O tema continua funcionando sem armazenamento. */
    }
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    document.title = `${location.pathname === '/' ? 'Início' : location.pathname.split('/')[1]} — ${profile.shortName}`;
  }, [location.pathname]);

  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Lucas Kobayashi, início">
            <span className="brand-mark">
              lk<span>.</span>
            </span>
            <span className="brand-name">
              Lucas
              <br />
              Kobayashi
            </span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className={menuOpen ? 'nav is-open' : 'nav'}
            id="main-nav"
          >
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/projetos">Projetos</NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            <NavLink to="/contato">
              Contato <Icon name="arrow" size={15} />
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="icon-button menu-toggle"
              aria-controls="main-nav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo" className="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Link to="/" className="footer-signature">
            Lucas Kobayashi<span>© {new Date().getFullYear()}</span>
          </Link>
          <p>Feito com React, curiosidade e café.</p>
          <div className="footer-links">
            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer">
              GitHub <Icon name="arrow" size={14} />
            </a>
            <Link to="/login">Área do proprietário</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
