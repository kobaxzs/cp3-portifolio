import { normalizeContact, validateContact } from '../src/utils/validation.js';

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function databaseRequest(env, path, body, method = 'POST') {
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: env.SUPABASE_SECRET_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
}

export async function handleContact(request, env = process.env) {
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const required = [
    'SUPABASE_URL',
    'SUPABASE_SECRET_KEY',
    'RESEND_API_KEY',
    'CONTACT_TO_EMAIL',
    'CONTACT_FROM_EMAIL',
  ];
  for (const key of required) {
    if (!env[key])
      return json(
        {
          error:
            'O formulário ainda não foi configurado. Entre em contato pelo e-mail exibido na página.',
        },
        503,
      );
  }

  let body;
  try {
    body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body))
      throw new Error('Dados inválidos.');
  } catch {
    return json({ error: 'Os dados enviados são inválidos.' }, 400);
  }
  const errors = validateContact(body);
  if (errors.name || errors.email || errors.subject || errors.message)
    return json({ error: 'Confira os campos do formulário.', fields: errors }, 400);
  const contact = normalizeContact(body);

  try {
    const saved = await databaseRequest(env, 'messages?select=id', contact);
    if (!saved.ok)
      return json(
        { error: 'Não foi possível salvar sua mensagem. Tente novamente mais tarde.' },
        502,
      );
    const messages = await saved.json();
    const id = messages[0].id;

    let emailSent = false;
    try {
      const email = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: contact.email,
          subject: `Portfólio: ${contact.subject}`,
          text: `Nova mensagem de ${contact.name}\nE-mail: ${contact.email}\n\n${contact.message}`,
        }),
      });
      emailSent = email.ok;
      if (emailSent)
        await databaseRequest(env, `messages?id=eq.${id}`, { email_sent: true }, 'PATCH');
    } catch {
      // A mensagem permanece salva se o envio do e-mail falhar.
    }
    return json({ saved: true, emailSent }, 201);
  } catch {
    return json(
      {
        error:
          'O serviço de mensagens está temporariamente indisponível. Tente novamente mais tarde.',
      },
      502,
    );
  }
}
