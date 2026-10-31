import { useState as useEstado } from 'react';
import { Link as LinkInterno } from 'react-router';
import { useAutenticacao } from '../../hooks/AuthContext.js';
import { encerrarSessao } from '../../services/supabase.js';
import {
  obterMensagens,
  obterDestaquesDono,
  marcarRespondida,
  alterarDestaque,
} from '../../services/dashboard.js';
import { obterRepositorios } from '../../services/github.js';
import useDados from '../../hooks/useAsyncData.js';
import { EstadoVazio, EstadoErro, EstadoCarregamento } from '../../components/Feedback.jsx';
import Icone from '../../components/Icon.jsx';
async function carregarPainel() {
  const mensagens = await obterMensagens();
  const destaques = await obterDestaquesDono();
  const repositorios = await obterRepositorios();
  return {
    mensagens,
    destaques,
    repositorios,
  };
}
export default function PaginaPainel() {
  const { sessao } = useAutenticacao();
  const { dados, carregando, erro, tentarNovamente } = useDados(carregarPainel);
  const [aba, definirAba] = useEstado('messages');
  const [filtro, definirFiltro] = useEstado('all');
  const [salvando, definirSalvando] = useEstado('');
  const [retorno, definirRetorno] = useEstado('');
  async function atualizarMensagem(item) {
    definirSalvando(item.id);
    definirRetorno('');
    try {
      await marcarRespondida(item.id, !item.responded);
      tentarNovamente();
    } catch (erroCapturado) {
      definirRetorno(erroCapturado.message);
    } finally {
      definirSalvando('');
    }
  }
  async function atualizarDestaque(nome, selecionado) {
    definirSalvando(nome);
    definirRetorno('');
    try {
      await alterarDestaque(nome, selecionado);
      tentarNovamente();
    } catch (erroCapturado) {
      definirRetorno(erroCapturado.message);
    } finally {
      definirSalvando('');
    }
  }
  async function sairDaConta() {
    try {
      await encerrarSessao();
    } catch (erroCapturado) {
      definirRetorno(erroCapturado.message);
    }
  }
  const mensagens = (dados?.mensagens || []).filter(
    (item) => filtro === 'all' || (filtro === 'pending' ? !item.responded : item.responded),
  );
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">ÁREA DO PROPRIETÁRIO</p>
          <h1>
            Seu espaço de controle<span className="accent">.</span>
          </h1>
          <p className="muted">{sessao.user.email}</p>
        </div>
        <button className="button button-outline button-small" onClick={sairDaConta}>
          Sair da conta <Icone nome="seta" tamanho={16} />
        </button>
      </div>
      <div className="dashboard-tabs" role="group" aria-label="Seções do painel">
        <button aria-pressed={aba === 'messages'} onClick={() => definirAba('messages')}>
          Mensagens{' '}
          {dados && <span>{dados.mensagens.filter((item) => !item.responded).length}</span>}
        </button>
        <button aria-pressed={aba === 'featured'} onClick={() => definirAba('featured')}>
          Projetos em destaque
        </button>
      </div>
      {retorno && (
        <p className="form-feedback error" role="alert">
          {retorno}
        </p>
      )}
      {carregando ? (
        <EstadoCarregamento texto="Carregando painel…" />
      ) : erro ? (
        <EstadoErro mensagem={erro} aoTentarNovamente={tentarNovamente} />
      ) : aba === 'messages' ? (
        <section>
          <div className="panel-section-heading">
            <h2>Conversas recebidas</h2>
            <label className="inline-label">
              Exibir
              <select value={filtro} onChange={(evento) => definirFiltro(evento.target.value)}>
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="answered">Respondidas</option>
              </select>
            </label>
          </div>
          {mensagens.length ? (
            <div className="message-list">
              {mensagens.map((item) => (
                <article className="message-card" key={item.id}>
                  <div className="message-header">
                    <div>
                      <h3>{item.name}</h3>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </div>
                    <time dateTime={item.created_at}>
                      {new Date(item.created_at).toLocaleString('pt-BR')}
                    </time>
                  </div>
                  <span className={`tag ${item.responded ? 'tag-success' : ''}`}>
                    {item.responded ? 'Respondida' : 'Pendente'}
                  </span>
                  {!item.email_sent && (
                    <span className="tag tag-warning">Notificação de e-mail pendente</span>
                  )}
                  <h4>{item.subject}</h4>
                  <p className="message-content">{item.message}</p>
                  <div className="message-actions">
                    <a
                      className="text-link"
                      href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}
                    >
                      Responder por e-mail <Icone nome="seta" tamanho={16} />
                    </a>
                    <button
                      disabled={Boolean(salvando)}
                      className="button button-small button-outline"
                      onClick={() => atualizarMensagem(item)}
                    >
                      {salvando === item.id
                        ? 'Salvando…'
                        : item.responded
                          ? 'Marcar como pendente'
                          : 'Marcar como respondida'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVazio titulo="Nenhuma mensagem nesta lista">
              As mensagens enviadas pelo formulário serão exibidas aqui.
            </EstadoVazio>
          )}
        </section>
      ) : (
        <section>
          <div className="panel-section-heading">
            <div>
              <h2>Destaques da página inicial</h2>
              <p className="muted">
                As alterações são salvas no banco e ficam visíveis para os visitantes.
              </p>
            </div>
            <LinkInterno to="/" className="text-link">
              Ver início <Icone nome="seta" tamanho={16} />
            </LinkInterno>
          </div>
          {!dados.destaques.length && (
            <p className="notice">
              Sem seleção, a página inicial mostra os três repositórios mais recentes.
            </p>
          )}
          {dados.repositorios.length ? (
            <div className="featured-list">
              {dados.repositorios.map((repositorio) => (
                <label className="featured-option" key={repositorio.id}>
                  <span>
                    <strong>{repositorio.name}</strong>
                    <small aria-live="polite">
                      {salvando === repositorio.name
                        ? 'Salvando…'
                        : repositorio.language || 'Sem linguagem informada'}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    aria-label={`Destacar ${repositorio.name}`}
                    checked={dados.destaques.includes(repositorio.name)}
                    disabled={Boolean(salvando)}
                    onChange={(evento) =>
                      atualizarDestaque(repositorio.name, evento.target.checked)
                    }
                  />
                </label>
              ))}
            </div>
          ) : (
            <EstadoVazio titulo="Nenhum projeto disponível">
              Publique seus repositórios no GitHub para selecioná-los.
            </EstadoVazio>
          )}
        </section>
      )}
    </>
  );
}
