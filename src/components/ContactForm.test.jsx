import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ContactForm from './ContactForm.jsx';

async function fillForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/seu nome/i), 'Pessoa de teste');
  await user.type(screen.getByLabelText(/seu e-mail/i), 'pessoa@example.com');
  await user.selectOptions(screen.getByLabelText(/sobre o que/i), 'Uma troca de ideias');
  await user.type(
    screen.getByLabelText(/sua mensagem/i),
    'Mensagem válida para testar o envio do formulário.',
  );
  return user;
}

describe('formulário de contato', () => {
  it('mostra erros específicos, foca o primeiro campo e não envia dados inválidos', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));
    expect(screen.getByText(/informe um nome entre/i)).toBeInTheDocument();
    expect(screen.getByText(/informe um e-mail válido/i)).toBeInTheDocument();
    expect(screen.getByText(/escreva uma mensagem entre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seu nome/i)).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('bloqueia duplicidade durante o envio e só confirma a resposta do servidor', async () => {
    let finish;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm />);
    const user = await fillForm();
    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }));
    expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
    fireEvent.submit(screen.getByRole('form'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    finish({ ok: true, json: async () => ({ saved: true, emailSent: true }) });
    expect(await screen.findByRole('status')).toHaveTextContent('Mensagem recebida');
    expect(screen.getByLabelText(/sua mensagem/i)).toHaveValue('');
  });
  it('mantém o texto se o servidor falhar', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue({ ok: false, json: async () => ({ error: 'Serviço indisponível.' }) }),
    );
    render(<ContactForm />);
    const user = await fillForm();
    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Serviço indisponível.');
    expect(screen.getByLabelText(/sua mensagem/i)).not.toHaveValue('');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeEnabled(),
    );
  });
});
