export async function sendContact(values) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(
      'O serviço de contato não está disponível. Você também pode escrever diretamente para o meu e-mail.',
    );
  }
  if (!response.ok)
    throw new Error(result.error || 'Não foi possível enviar. Tente novamente mais tarde.');
  return result;
}
