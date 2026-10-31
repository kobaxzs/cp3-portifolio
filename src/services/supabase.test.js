import { describe as descrever, expect as esperar, it as teste, vi } from 'vitest';
import { verificarDono } from './supabase.js';
const clienteTeste = vi.hoisted(() => ({
  auth: {
    getUser: vi.fn(),
  },
}));
vi.mock('../config.js', () => ({
  temConfiguracaoBanco: true,
  configuracaoSupabase: {
    url: 'https://teste.supabase.co',
    chave: 'chave-publica-de-teste',
  },
}));
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => clienteTeste,
}));
descrever('verificação da sessão', () => {
  teste('informa erro de conexão em vez de apresentar falta de autorização', async () => {
    clienteTeste.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: {
        status: 0,
      },
    });
    await esperar(verificarDono()).rejects.toThrow('Não foi possível verificar sua sessão');
  });
  teste('mantém o acesso negado para uma sessão inválida', async () => {
    clienteTeste.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
      error: {
        status: 401,
      },
    });
    await esperar(verificarDono()).resolves.toBe(false);
  });
});
