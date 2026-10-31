import { describe as descrever, expect as esperar, it as teste, vi } from 'vitest';
descrever('API do GitHub', () => {
  teste('explica uma falha de conexão em português', async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const { obterRepositorios } = await import('./github.js');
    await esperar(obterRepositorios()).rejects.toThrow('Não foi possível conectar ao GitHub');
  });
  teste(
    'reutiliza a requisição e mantém o cache ao navegar, mesmo após cinco minutos',
    async () => {
      vi.resetModules();
      const buscaSimulada = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: async () => [
          {
            id: 1,
            name: 'teste',
            fork: false,
            updated_at: '2026-01-01',
          },
        ],
      });
      vi.stubGlobal('fetch', buscaSimulada);
      const { obterRepositorios } = await import('./github.js');
      const [primeiroResultado, segundoResultado] = await Promise.all([
        obterRepositorios(),
        obterRepositorios(),
      ]);
      esperar(primeiroResultado).toEqual(segundoResultado);
      vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10 * 60 * 1000);
      await obterRepositorios();
      esperar(buscaSimulada).toHaveBeenCalledTimes(1);
    },
  );
  teste('distingue limite de requisições e permite tentar novamente', async () => {
    vi.resetModules();
    const buscaSimulada = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        json: async () => [],
      });
    vi.stubGlobal('fetch', buscaSimulada);
    const { obterRepositorios } = await import('./github.js');
    await esperar(obterRepositorios()).rejects.toThrow(/limite de consultas/i);
    await esperar(obterRepositorios()).resolves.toEqual([]);
  });
});
