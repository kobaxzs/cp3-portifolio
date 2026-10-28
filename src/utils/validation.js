export function normalizeContact(values = {}) {
  return {
    name: typeof values.name === 'string' ? values.name.trim() : '',
    email: typeof values.email === 'string' ? values.email.trim().toLowerCase() : '',
    subject: typeof values.subject === 'string' ? values.subject.trim() : '',
    message: typeof values.message === 'string' ? values.message.trim() : '',
  };
}

export function validateContact(values) {
  const data = normalizeContact(values);
  const errors = {};
  if (data.name.length < 2 || data.name.length > 80)
    errors.name = 'Informe um nome entre 2 e 80 caracteres.';
  const at = data.email.indexOf('@');
  const domain = data.email.slice(at + 1);
  let hasWhitespace = false;
  for (const character of [' ', '\t', '\n', '\r']) {
    if (data.email.includes(character)) hasWhitespace = true;
  }
  if (
    at < 1 ||
    data.email.indexOf('@', at + 1) !== -1 ||
    !domain.includes('.') ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    hasWhitespace ||
    data.email.length > 254
  )
    errors.email = 'Informe um e-mail válido, como nome@dominio.com.';
  if (!data.subject || data.subject.length > 120)
    errors.subject = 'Escolha um assunto de até 120 caracteres.';
  if (data.message.length < 20 || data.message.length > 5000)
    errors.message = 'Escreva uma mensagem entre 20 e 5.000 caracteres.';
  return errors;
}
