export function normalizarContato(valores = {}) {
  return {
    name: typeof valores.name === 'string' ? valores.name.trim() : '',
    email: typeof valores.email === 'string' ? valores.email.trim().toLowerCase() : '',
    subject: typeof valores.subject === 'string' ? valores.subject.trim() : '',
    message: typeof valores.message === 'string' ? valores.message.trim() : '',
  };
}
export function validarContato(valores) {
  const dados = normalizarContato(valores);
  const errosCampos = {};
  if (dados.name.length < 2 || dados.name.length > 80)
    errosCampos.name = 'Informe um nome entre 2 e 80 caracteres.';
  const posicaoArroba = dados.email.indexOf('@');
  const dominio = dados.email.slice(posicaoArroba + 1);
  let temEspaco = false;
  for (const caractere of [' ', '\t', '\n', '\r']) {
    if (dados.email.includes(caractere)) temEspaco = true;
  }
  if (
    posicaoArroba < 1 ||
    dados.email.indexOf('@', posicaoArroba + 1) !== -1 ||
    !dominio.includes('.') ||
    dominio.startsWith('.') ||
    dominio.endsWith('.') ||
    temEspaco ||
    dados.email.length > 254
  )
    errosCampos.email = 'Informe um e-mail válido, como nome@dominio.com.';
  if (!dados.subject || dados.subject.length > 120)
    errosCampos.subject = 'Escolha um assunto de até 120 caracteres.';
  if (dados.message.length < 20 || dados.message.length > 5000)
    errosCampos.message = 'Escreva uma mensagem entre 20 e 5.000 caracteres.';
  return errosCampos;
}
