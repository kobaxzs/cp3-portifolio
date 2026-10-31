import { useRef as useReferencia, useState as useEstado } from 'react';
import { validarContato } from '../utils/validation.js';
import { enviarContato } from '../services/contact.js';
import Icone from './Icon.jsx';
const valoresIniciais = {
  name: '',
  email: '',
  subject: '',
  message: '',
};
export default function FormularioContato() {
  const [valores, definirValores] = useEstado(valoresIniciais);
  const [errosCampos, definirErros] = useEstado({});
  const [enviando, definirEnviando] = useEstado(false);
  const [retorno, definirRetorno] = useEstado(null);
  const referenciaFormulario = useReferencia(null);
  const referenciaEnvio = useReferencia(false);
  function alterarCampo(evento) {
    const { name: nome, value: valor } = evento.target;
    definirValores({
      ...valores,
      [nome]: valor,
    });
    definirErros({
      ...errosCampos,
      [nome]: '',
    });
    definirRetorno(null);
  }
  async function enviarFormulario(evento) {
    evento.preventDefault();
    if (referenciaEnvio.current) return;
    const novosErros = validarContato(valores);
    definirErros(novosErros);
    for (const campo of ['name', 'email', 'subject', 'message']) {
      if (novosErros[campo]) {
        referenciaFormulario.current.elements[campo].focus();
        return;
      }
    }
    referenciaEnvio.current = true;
    definirEnviando(true);
    definirRetorno(null);
    try {
      const resultado = await enviarContato(valores);
      definirValores(valoresIniciais);
      definirRetorno({
        tipo: resultado.emailSent ? 'success' : 'warning',
        texto: resultado.emailSent
          ? 'Mensagem recebida! Ela foi salva e a notificação foi enviada ao meu e-mail.'
          : 'Sua mensagem foi salva no meu painel. A notificação por e-mail está pendente; não é necessário reenviar.',
      });
    } catch (erro) {
      definirRetorno({
        tipo: 'error',
        texto: erro.message,
      });
    } finally {
      referenciaEnvio.current = false;
      definirEnviando(false);
    }
  }
  function propriedadesCampo(nome) {
    return {
      name: nome,
      id: nome,
      value: valores[nome],
      onChange: alterarCampo,
      'aria-invalid': Boolean(errosCampos[nome]),
      'aria-describedby': errosCampos[nome] ? `${nome}-error` : undefined,
    };
  }
  return (
    <form
      ref={referenciaFormulario}
      onSubmit={enviarFormulario}
      noValidate
      className="contact-form"
      aria-label="Formulário de contato"
    >
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">
            Seu nome <span>*</span>
          </label>
          <input
            {...propriedadesCampo('name')}
            autoComplete="name"
            maxLength={80}
            placeholder="Como posso te chamar?"
            required
          />
          {errosCampos.name && (
            <p className="field-error" id="name-error">
              {errosCampos.name}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="email">
            Seu e-mail <span>*</span>
          </label>
          <input
            {...propriedadesCampo('email')}
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="voce@exemplo.com"
            required
          />
          {errosCampos.email && (
            <p className="field-error" id="email-error">
              {errosCampos.email}
            </p>
          )}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="subject">
          Sobre o que vamos conversar? <span>*</span>
        </label>
        <select {...propriedadesCampo('subject')} required>
          <option value="">Selecione um assunto</option>
          <option>Uma oportunidade</option>
          <option>Um projeto ou colaboração</option>
          <option>Uma troca de ideias</option>
          <option>Outro assunto</option>
        </select>
        {errosCampos.subject && (
          <p className="field-error" id="subject-error">
            {errosCampos.subject}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="message">
          Sua mensagem <span>*</span>
        </label>
        <textarea
          {...propriedadesCampo('message')}
          rows={6}
          minLength={20}
          maxLength={5000}
          placeholder="Me conte um pouco sobre sua ideia…"
          required
        />
        {errosCampos.message && (
          <p className="field-error" id="message-error">
            {errosCampos.message}
          </p>
        )}
        <span className="field-hint">
          Mínimo de 20 caracteres · {valores.message.trim().length}/5.000
        </span>
      </div>
      {retorno && (
        <p
          className={`form-feedback ${retorno.tipo}`}
          role={retorno.tipo === 'error' ? 'alert' : 'status'}
        >
          {retorno.texto}
        </p>
      )}
      <div className="form-bottom">
        <span>
          Seus dados serão usados apenas para
          <br />
          responder a esta conversa.
        </span>
        <button type="submit" className="button" disabled={enviando}>
          {enviando ? (
            <>
              <span className="spinner" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensagem <Icone nome="seta" tamanho={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
