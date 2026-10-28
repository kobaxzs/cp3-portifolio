// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { handleContact } from './contact.js';

const env = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SECRET_KEY: 'test-server-key',
  RESEND_API_KEY: 'test-email-key',
  CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'portfolio@example.com',
};
const data = {
  name: 'Pessoa de teste',
  email: 'pessoa@example.com',
  subject: 'Uma troca de ideias',
  message: 'Mensagem válida de teste com mais de vinte caracteres.',
};
function request(body = data) {
  return new Request('https://portfolio.example.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('servidor de contato', () => {
  it('não simula sucesso sem configuração', async () => {
    expect((await handleContact(request(), {})).status).toBe(503);
  });
  it('rejeita dados inválidos sem chamar serviços', async () => {
    const mock = vi.fn();
    vi.stubGlobal('fetch', mock);
    expect((await handleContact(request({ ...data, message: 'curta' }), env)).status).toBe(400);
    expect(mock).not.toHaveBeenCalled();
  });
  it('não envia e-mail se o banco não salvar a mensagem', async () => {
    const mock = vi.fn().mockResolvedValue(new Response('{}', { status: 500 }));
    vi.stubGlobal('fetch', mock);
    expect((await handleContact(request(), env)).status).toBe(502);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it('grava antes de enviar e-mail e registra a notificação', async () => {
    const mock = vi
      .fn()
      .mockResolvedValueOnce(Response.json([{ id: 'message-id' }]))
      .mockResolvedValueOnce(Response.json({ id: 'email-id' }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', mock);
    const response = await handleContact(request(), env);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ saved: true, emailSent: true });
    expect(mock.mock.calls[0][0]).toContain('/messages?select=id');
    expect(mock.mock.calls[1][0]).toBe('https://api.resend.com/emails');
    expect(JSON.parse(mock.mock.calls[1][1].body).reply_to).toBe(data.email);
    expect(mock.mock.calls[2][1].method).toBe('PATCH');
    expect(JSON.parse(mock.mock.calls[0][1].body)).toEqual(data);
  });
  it('informa salvamento parcial quando o provedor de e-mail falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(Response.json([{ id: 'message-id' }]))
        .mockResolvedValueOnce(new Response('{}', { status: 503 })),
    );
    expect(await (await handleContact(request(), env)).json()).toEqual({
      saved: true,
      emailSent: false,
    });
  });
});
