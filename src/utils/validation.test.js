import { describe, expect, it } from 'vitest';
import { normalizeContact, validateContact } from './validation.js';

const valid = {
  name: 'Pessoa de teste',
  email: 'pessoa@example.com',
  subject: 'Uma troca de ideias',
  message: 'Uma mensagem de teste com mais de vinte caracteres.',
};

describe('validação do contato', () => {
  it('aceita dados válidos e normaliza espaços', () => {
    expect(validateContact(valid)).toEqual({});
    expect(
      normalizeContact({ ...valid, name: '  Ana  ', email: ' ANA@EXAMPLE.COM ' }),
    ).toMatchObject({ name: 'Ana', email: 'ana@example.com' });
  });
  it.each([
    '',
    'sem-arroba.com',
    'a@dominio',
    'a@@dominio.com',
    'a@.com',
    'a@dominio.',
    'a b@dominio.com',
  ])('rejeita o e-mail inválido %s', (email) => {
    expect(validateContact({ ...valid, email }).email).toBeTruthy();
  });
  it('valida o tamanho depois de remover espaços', () => {
    expect(validateContact({ ...valid, message: `  ${'a'.repeat(19)}  ` }).message).toBeTruthy();
    expect(validateContact({ ...valid, message: 'a'.repeat(20) }).message).toBeUndefined();
    expect(validateContact({ ...valid, message: 'a'.repeat(5001) }).message).toBeTruthy();
  });
  it('rejeita campos ausentes, tipos inesperados e nome longo', () => {
    expect(Object.keys(validateContact({}))).toHaveLength(4);
    expect(validateContact({ ...valid, name: 123 }).name).toBeTruthy();
    expect(validateContact({ ...valid, name: 'a'.repeat(81) }).name).toBeTruthy();
  });
});
