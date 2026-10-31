import { normalizarContato, validarContato } from '../src/utils/validation.js';
import { normalizarVariaveisAmbiente } from '../src/utils/ambiente.js';
function responderJson(corpo, codigoStatus = 200) {
  return Response.json(corpo, {
    status: codigoStatus,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
async function consultarBanco(ambiente, caminho, corpo, metodo = 'POST') {
  return fetch(`${ambiente.URL_SUPABASE}/rest/v1/${caminho}`, {
    method: metodo,
    headers: {
      apikey: ambiente.CHAVE_SECRETA_SUPABASE,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(corpo),
  });
}
export async function tratarContato(solicitacao, ambiente = process.env) {
  ambiente = normalizarVariaveisAmbiente(ambiente);
  if (solicitacao.method !== 'POST')
    return responderJson(
      {
        error: 'Método não permitido.',
      },
      405,
    );
  const obrigatorias = [
    'URL_SUPABASE',
    'CHAVE_SECRETA_SUPABASE',
    'CHAVE_API_RESEND',
    'EMAIL_DESTINATARIO_CONTATO',
    'EMAIL_REMETENTE_CONTATO',
  ];
  for (const chave of obrigatorias) {
    if (!ambiente[chave])
      return responderJson(
        {
          error:
            'O formulário ainda não foi configurado. Entre em contato pelo e-mail exibido na página.',
        },
        503,
      );
  }
  let corpo;
  try {
    corpo = await solicitacao.json();
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo))
      throw new Error('Dados inválidos.');
  } catch {
    return responderJson(
      {
        error: 'Os dados enviados são inválidos.',
      },
      400,
    );
  }
  const errosCampos = validarContato(corpo);
  if (errosCampos.name || errosCampos.email || errosCampos.subject || errosCampos.message)
    return responderJson(
      {
        error: 'Confira os campos do formulário.',
        fields: errosCampos,
      },
      400,
    );
  const contato = normalizarContato(corpo);
  try {
    const mensagemSalva = await consultarBanco(ambiente, 'messages?select=id', contato);
    if (!mensagemSalva.ok)
      return responderJson(
        {
          error: 'Não foi possível salvar sua mensagem. Tente novamente mais tarde.',
        },
        502,
      );
    const mensagens = await mensagemSalva.json();
    const identificador = mensagens[0].id;
    let emailEnviado = false;
    try {
      const email = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ambiente.CHAVE_API_RESEND}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: ambiente.EMAIL_REMETENTE_CONTATO,
          to: [ambiente.EMAIL_DESTINATARIO_CONTATO],
          reply_to: contato.email,
          subject: `Portfólio: ${contato.subject}`,
          text: `Nova mensagem de ${contato.name}\nE-mail: ${contato.email}\n\n${contato.message}`,
        }),
      });
      emailEnviado = email.ok;
      if (emailEnviado)
        await consultarBanco(
          ambiente,
          `messages?id=eq.${identificador}`,
          {
            email_sent: true,
          },
          'PATCH',
        );
    } catch {
      // A mensagem permanece salva se o envio do e-mail falhar.
    }
    return responderJson(
      {
        saved: true,
        emailSent: emailEnviado,
      },
      201,
    );
  } catch {
    return responderJson(
      {
        error:
          'O serviço de mensagens está temporariamente indisponível. Tente novamente mais tarde.',
      },
      502,
    );
  }
}
