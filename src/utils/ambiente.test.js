import { describe as descrever, expect as esperar, it as teste } from 'vitest';
import { normalizarVariaveisAmbiente } from './ambiente.js';

descrever('compatibilidade das variáveis de ambiente', () => {
  teste('aceita os nomes antigos usados no deploy existente', () => {
    const configuracao = normalizarVariaveisAmbiente({
      VITE_SUPABASE_URL: 'https://teste.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'chave-publica-teste',
      SUPABASE_URL: 'https://teste.supabase.co',
      SUPABASE_SECRET_KEY: 'chave-servidor-teste',
      RESEND_API_KEY: 'chave-email-teste',
      CONTACT_FROM_EMAIL: 'remetente@example.com',
      CONTACT_TO_EMAIL: 'destinatario@example.com',
    });

    esperar(configuracao).toMatchObject({
      VITE_URL_SUPABASE: 'https://teste.supabase.co',
      VITE_CHAVE_PUBLICA_SUPABASE: 'chave-publica-teste',
      URL_SUPABASE: 'https://teste.supabase.co',
      CHAVE_SECRETA_SUPABASE: 'chave-servidor-teste',
      CHAVE_API_RESEND: 'chave-email-teste',
      EMAIL_REMETENTE_CONTATO: 'remetente@example.com',
      EMAIL_DESTINATARIO_CONTATO: 'destinatario@example.com',
    });
  });

  teste('dá preferência aos nomes em português quando os dois existem', () => {
    const configuracao = normalizarVariaveisAmbiente({
      VITE_USUARIO_GITHUB: 'usuario-atual',
      VITE_GITHUB_USERNAME: 'usuario-antigo',
      CHAVE_API_RESEND: 'chave-atual',
      RESEND_API_KEY: 'chave-antiga',
    });

    esperar(configuracao.VITE_USUARIO_GITHUB).toBe('usuario-atual');
    esperar(configuracao.CHAVE_API_RESEND).toBe('chave-atual');
  });
});
