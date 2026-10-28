import { describe, expect, it, vi } from 'vitest';

describe('API do GitHub', () => {
  it('explica uma falha de conexão em português', async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const { getRepositories } = await import('./github.js');
    await expect(getRepositories()).rejects.toThrow('Não foi possível conectar ao GitHub');
  });
  it('reutiliza a requisição e mantém o cache ao navegar, mesmo após cinco minutos', async () => {
    vi.resetModules();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
      json: async () => [{ id: 1, name: 'teste', fork: false, updated_at: '2026-01-01' }],
    });
    vi.stubGlobal('fetch', fetchMock);
    const { getRepositories } = await import('./github.js');
    const [first, second] = await Promise.all([getRepositories(), getRepositories()]);
    expect(first).toEqual(second);
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10 * 60 * 1000);
    await getRepositories();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('distingue limite de requisições e permite tentar novamente', async () => {
    vi.resetModules();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 403 })
      .mockResolvedValueOnce({ ok: true, headers: new Headers(), json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);
    const { getRepositories } = await import('./github.js');
    await expect(getRepositories()).rejects.toThrow(/limite de consultas/i);
    await expect(getRepositories()).resolves.toEqual([]);
  });
});
