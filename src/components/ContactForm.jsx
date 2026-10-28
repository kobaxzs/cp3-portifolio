import { useRef, useState } from 'react';
import { validateContact } from '../utils/validation.js';
import { sendContact } from '../services/contact.js';
import Icon from './Icon.jsx';

const initialValues = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const formRef = useRef(null);
  const busyRef = useRef(false);

  function change(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setFeedback(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (busyRef.current) return;
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    for (const field of ['name', 'email', 'subject', 'message']) {
      if (nextErrors[field]) {
        formRef.current.elements[field].focus();
        return;
      }
    }
    busyRef.current = true;
    setSending(true);
    setFeedback(null);
    try {
      const result = await sendContact(values);
      setValues(initialValues);
      setFeedback({
        type: result.emailSent ? 'success' : 'warning',
        text: result.emailSent
          ? 'Mensagem recebida! Ela foi salva e a notificação foi enviada ao meu e-mail.'
          : 'Sua mensagem foi salva no meu painel. A notificação por e-mail está pendente; não é necessário reenviar.',
      });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    } finally {
      busyRef.current = false;
      setSending(false);
    }
  }

  function fieldProps(name) {
    return {
      name,
      id: name,
      value: values[name],
      onChange: change,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
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
            {...fieldProps('name')}
            autoComplete="name"
            maxLength={80}
            placeholder="Como posso te chamar?"
            required
          />
          {errors.name && (
            <p className="field-error" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="email">
            Seu e-mail <span>*</span>
          </label>
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="voce@exemplo.com"
            required
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="subject">
          Sobre o que vamos conversar? <span>*</span>
        </label>
        <select {...fieldProps('subject')} required>
          <option value="">Selecione um assunto</option>
          <option>Uma oportunidade</option>
          <option>Um projeto ou colaboração</option>
          <option>Uma troca de ideias</option>
          <option>Outro assunto</option>
        </select>
        {errors.subject && (
          <p className="field-error" id="subject-error">
            {errors.subject}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="message">
          Sua mensagem <span>*</span>
        </label>
        <textarea
          {...fieldProps('message')}
          rows={6}
          minLength={20}
          maxLength={5000}
          placeholder="Me conte um pouco sobre sua ideia…"
          required
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
        <span className="field-hint">
          Mínimo de 20 caracteres · {values.message.trim().length}/5.000
        </span>
      </div>
      {feedback && (
        <p
          className={`form-feedback ${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.text}
        </p>
      )}
      <div className="form-bottom">
        <span>
          Seus dados serão usados apenas para
          <br />
          responder a esta conversa.
        </span>
        <button type="submit" className="button" disabled={sending}>
          {sending ? (
            <>
              <span className="spinner" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensagem <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
