import { describe, expect, it, vi } from 'vitest';
import { verifyOwner } from './supabase.js';

const client = vi.hoisted(() => ({ auth: { getUser: vi.fn() } }));
vi.mock('../config.js', () => ({
  hasBackend: true,
  supabaseConfig: { url: 'https://teste.supabase.co', key: 'chave-publica-de-teste' },
}));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => client }));

describe('verificação da sessão', () => {
  it('informa erro de conexão em vez de apresentar falta de autorização', async () => {
    client.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { status: 0 } });
    await expect(verifyOwner()).rejects.toThrow('Não foi possível verificar sua sessão');
  });
  it('mantém o acesso negado para uma sessão inválida', async () => {
    client.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: { status: 401 } });
    await expect(verifyOwner()).resolves.toBe(false);
  });
});
