import {
  fireEvent as dispararEvento,
  render as renderizar,
  screen as tela,
  waitFor as aguardar,
} from '@testing-library/react';
import eventosUsuario from '@testing-library/user-event';
import { describe as descrever, expect as esperar, it as teste, vi } from 'vitest';
import FormularioContato from './ContactForm.jsx';
async function preencherFormulario() {
  const usuario = eventosUsuario.setup();
  await usuario.type(tela.getByLabelText(/seu nome/i), 'Pessoa de teste');
  await usuario.type(tela.getByLabelText(/seu e-mail/i), 'pessoa@example.com');
  await usuario.selectOptions(tela.getByLabelText(/sobre o que/i), 'Uma troca de ideias');
  await usuario.type(
    tela.getByLabelText(/sua mensagem/i),
    'Mensagem válida para testar o envio do formulário.',
  );
  return usuario;
}
descrever('formulário de contato', () => {
  teste('mostra erros específicos, foca o primeiro campo e não envia dados inválidos', async () => {
    const buscaSimulada = vi.fn();
    vi.stubGlobal('fetch', buscaSimulada);
    renderizar(<FormularioContato />);
    await eventosUsuario.click(
      tela.getByRole('button', {
        name: /enviar mensagem/i,
      }),
    );
    esperar(tela.getByText(/informe um nome entre/i)).toBeInTheDocument();
    esperar(tela.getByText(/informe um e-mail válido/i)).toBeInTheDocument();
    esperar(tela.getByText(/escreva uma mensagem entre/i)).toBeInTheDocument();
    esperar(tela.getByLabelText(/seu nome/i)).toHaveFocus();
    esperar(buscaSimulada).not.toHaveBeenCalled();
  });
  teste('bloqueia duplicidade durante o envio e só confirma a resposta do servidor', async () => {
    let concluir;
    const buscaSimulada = vi.fn(
      () =>
        new Promise((resolver) => {
          concluir = resolver;
        }),
    );
    vi.stubGlobal('fetch', buscaSimulada);
    renderizar(<FormularioContato />);
    const usuario = await preencherFormulario();
    await usuario.click(
      tela.getByRole('button', {
        name: /enviar mensagem/i,
      }),
    );
    esperar(
      tela.getByRole('button', {
        name: /enviando/i,
      }),
    ).toBeDisabled();
    dispararEvento.submit(tela.getByRole('form'));
    esperar(buscaSimulada).toHaveBeenCalledTimes(1);
    concluir({
      ok: true,
      json: async () => ({
        saved: true,
        emailSent: true,
      }),
    });
    esperar(await tela.findByRole('status')).toHaveTextContent('Mensagem recebida');
    esperar(tela.getByLabelText(/sua mensagem/i)).toHaveValue('');
  });
  teste('mantém o texto se o servidor falhar', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: 'Serviço indisponível.',
        }),
      }),
    );
    renderizar(<FormularioContato />);
    const usuario = await preencherFormulario();
    await usuario.click(
      tela.getByRole('button', {
        name: /enviar mensagem/i,
      }),
    );
    esperar(await tela.findByRole('alert')).toHaveTextContent('Serviço indisponível.');
    esperar(tela.getByLabelText(/sua mensagem/i)).not.toHaveValue('');
    await aguardar(() =>
      esperar(
        tela.getByRole('button', {
          name: /enviar mensagem/i,
        }),
      ).toBeEnabled(),
    );
  });
});
