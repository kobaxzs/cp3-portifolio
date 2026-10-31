import { describe as descrever, expect as esperar, it as teste } from 'vitest';
import { normalizarContato, validarContato } from './validation.js';
const valido = {
  name: 'Pessoa de teste',
  email: 'pessoa@example.com',
  subject: 'Uma troca de ideias',
  message: 'Uma mensagem de teste com mais de vinte caracteres.',
};
descrever('validação do contato', () => {
  teste('aceita dados válidos e normaliza espaços', () => {
    esperar(validarContato(valido)).toEqual({});
    esperar(
      normalizarContato({
        ...valido,
        name: '  Ana  ',
        email: ' ANA@EXAMPLE.COM ',
      }),
    ).toMatchObject({
      name: 'Ana',
      email: 'ana@example.com',
    });
  });
  teste.each([
    '',
    'sem-arroba.com',
    'a@dominio',
    'a@@dominio.com',
    'a@.com',
    'a@dominio.',
    'a b@dominio.com',
  ])('rejeita o e-mail inválido %s', (email) => {
    esperar(
      validarContato({
        ...valido,
        email,
      }).email,
    ).toBeTruthy();
  });
  teste('valida o tamanho depois de remover espaços', () => {
    esperar(
      validarContato({
        ...valido,
        message: `  ${'a'.repeat(19)}  `,
      }).message,
    ).toBeTruthy();
    esperar(
      validarContato({
        ...valido,
        message: 'a'.repeat(20),
      }).message,
    ).toBeUndefined();
    esperar(
      validarContato({
        ...valido,
        message: 'a'.repeat(5001),
      }).message,
    ).toBeTruthy();
  });
  teste('rejeita campos ausentes, tipos inesperados e nome longo', () => {
    esperar(Object.keys(validarContato({}))).toHaveLength(4);
    esperar(
      validarContato({
        ...valido,
        name: 123,
      }).name,
    ).toBeTruthy();
    esperar(
      validarContato({
        ...valido,
        name: 'a'.repeat(81),
      }).name,
    ).toBeTruthy();
  });
});
