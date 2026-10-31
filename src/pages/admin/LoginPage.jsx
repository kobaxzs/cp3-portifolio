import { useState as useEstado } from 'react';
import { Navigate as Redirecionar } from 'react-router';
import { useAutenticacao } from '../../hooks/AuthContext.js';
import { temConfiguracaoBanco } from '../../config.js';
import { entrarNaConta, encerrarSessao } from '../../services/supabase.js';
import { EstadoCarregamento, EstadoErro } from '../../components/Feedback.jsx';
import Icone from '../../components/Icon.jsx';
export default function PaginaLogin() {
  const { carregando, dono, sessao, erro, tentarNovamente } = useAutenticacao();
  const [email, definirEmail] = useEstado('');
  const [senha, definirSenha] = useEstado('');
  const [entrando, definirEntrando] = useEstado(false);
  const [mensagem, definirMensagem] = useEstado('');
  async function enviarFormulario(evento) {
    evento.preventDefault();
    if (entrando) return;
    definirEntrando(true);
    definirMensagem('');
    try {
      await entrarNaConta(email.trim(), senha);
    } catch (erroCapturado) {
      definirMensagem(erroCapturado.message);
    } finally {
      definirEntrando(false);
    }
  }
  async function sairDaConta() {
    try {
      await encerrarSessao();
    } catch (erroCapturado) {
      definirMensagem(erroCapturado.message);
    }
  }
  if (carregando) return <EstadoCarregamento texto="Verificando sessão…" />;
  if (dono) return <Redirecionar to="/dashboard" replace />;
  if (erro) return <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />;
  return (
    <div className="login-card">
      <span className="login-mark">
        <Icone nome="codigo" tamanho={28} />
      </span>
      <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
      <h1>
        Acesso restrito
        <span className="accent">.</span>
      </h1>
      <p>Apenas o proprietário tem acesso a esta área.</p>
      {!temConfiguracaoBanco && (
        <div className="notice" role="status">
          O acesso ainda não foi configurado. Preencha as variáveis do Supabase e siga a seção de
          configuração do README.
        </div>
      )}
      {sessao && !dono ? (
        <div className="notice">
          <p>
            Esta conta não tem permissão para abrir o painel. Saia e entre com a conta do
            proprietário.
          </p>
          <button className="button button-outline" onClick={sairDaConta}>
            Sair desta conta
          </button>
        </div>
      ) : (
        <form onSubmit={enviarFormulario}>
          <div className="form-field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(evento) => definirEmail(evento.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(evento) => definirSenha(evento.target.value)}
            />
          </div>
          {mensagem && (
            <p role="alert" className="form-feedback error">
              {mensagem}
            </p>
          )}
          <button
            type="submit"
            className="button button-full"
            disabled={!temConfiguracaoBanco || entrando}
          >
            {entrando ? (
              <>
                <span className="spinner" />
                Entrando…
              </>
            ) : (
              <>
                Entrar no painel <Icone nome="seta" tamanho={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
