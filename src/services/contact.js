export async function enviarContato(valores) {
  const resposta = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(valores),
  });
  let resultado;
  try {
    resultado = await resposta.json();
  } catch {
    throw new Error(
      'O serviço de contato não está disponível. Você também pode escrever diretamente para o meu e-mail.',
    );
  }
  if (!resposta.ok)
    throw new Error(resultado.error || 'Não foi possível enviar. Tente novamente mais tarde.');
  return resultado;
}
