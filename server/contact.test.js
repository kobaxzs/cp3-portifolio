// @vitest-environment node
import { describe as descrever, expect as esperar, it as teste, vi } from 'vitest';
import { tratarContato } from './contact.js';
const ambiente = {
  URL_SUPABASE: 'https://test.supabase.co',
  CHAVE_SECRETA_SUPABASE: 'test-server-key',
  CHAVE_API_RESEND: 'test-email-key',
  EMAIL_DESTINATARIO_CONTATO: 'owner@example.com',
  EMAIL_REMETENTE_CONTATO: 'portfolio@example.com',
};
const dados = {
  name: 'Pessoa de teste',
  email: 'pessoa@example.com',
  subject: 'Uma troca de ideias',
  message: 'Mensagem válida de teste com mais de vinte caracteres.',
};
function solicitacao(corpo = dados) {
  return new Request('https://portfolio.example.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(corpo),
  });
}
descrever('servidor de contato', () => {
  teste('não simula sucesso sem configuração', async () => {
    esperar((await tratarContato(solicitacao(), {})).status).toBe(503);
  });
  teste('mantém o contato compatível com as variáveis antigas da Vercel', async () => {
    const ambienteAnterior = {
      SUPABASE_URL: ambiente.URL_SUPABASE,
      SUPABASE_SECRET_KEY: ambiente.CHAVE_SECRETA_SUPABASE,
      RESEND_API_KEY: ambiente.CHAVE_API_RESEND,
      CONTACT_TO_EMAIL: ambiente.EMAIL_DESTINATARIO_CONTATO,
      CONTACT_FROM_EMAIL: ambiente.EMAIL_REMETENTE_CONTATO,
    };
    const buscaSimulada = vi.fn().mockResolvedValue(new Response('{}', { status: 500 }));
    vi.stubGlobal('fetch', buscaSimulada);

    const resposta = await tratarContato(solicitacao(), ambienteAnterior);

    esperar(resposta.status).toBe(502);
    esperar(buscaSimulada).toHaveBeenCalledTimes(1);
    esperar(buscaSimulada.mock.calls[0][0]).toBe(
      'https://test.supabase.co/rest/v1/messages?select=id',
    );
  });
  teste('rejeita dados inválidos sem chamar serviços', async () => {
    const simulacao = vi.fn();
    vi.stubGlobal('fetch', simulacao);
    esperar(
      (
        await tratarContato(
          solicitacao({
            ...dados,
            message: 'curta',
          }),
          ambiente,
        )
      ).status,
    ).toBe(400);
    esperar(simulacao).not.toHaveBeenCalled();
  });
  teste('não envia e-mail se o banco não salvar a mensagem', async () => {
    const simulacao = vi.fn().mockResolvedValue(
      new Response('{}', {
        status: 500,
      }),
    );
    vi.stubGlobal('fetch', simulacao);
    esperar((await tratarContato(solicitacao(), ambiente)).status).toBe(502);
    esperar(simulacao).toHaveBeenCalledTimes(1);
  });
  teste('grava antes de enviar e-mail e registra a notificação', async () => {
    const simulacao = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            id: 'message-id',
          },
        ]),
      )
      .mockResolvedValueOnce(
        Response.json({
          id: 'email-id',
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      );
    vi.stubGlobal('fetch', simulacao);
    const resposta = await tratarContato(solicitacao(), ambiente);
    esperar(resposta.status).toBe(201);
    esperar(await resposta.json()).toEqual({
      saved: true,
      emailSent: true,
    });
    esperar(simulacao.mock.calls[0][0]).toContain('/messages?select=id');
    esperar(simulacao.mock.calls[1][0]).toBe('https://api.resend.com/emails');
    esperar(JSON.parse(simulacao.mock.calls[1][1].body).reply_to).toBe(dados.email);
    esperar(simulacao.mock.calls[2][1].method).toBe('PATCH');
    esperar(JSON.parse(simulacao.mock.calls[0][1].body)).toEqual(dados);
  });
  teste('informa salvamento parcial quando o provedor de e-mail falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json([
            {
              id: 'message-id',
            },
          ]),
        )
        .mockResolvedValueOnce(
          new Response('{}', {
            status: 503,
          }),
        ),
    );
    esperar(await (await tratarContato(solicitacao(), ambiente)).json()).toEqual({
      saved: true,
      emailSent: false,
    });
  });
});
