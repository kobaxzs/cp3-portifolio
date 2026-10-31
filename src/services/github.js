import { perfil } from '../config.js';
let repositoriosGuardados;
let requisicaoPendente;
async function consultarRepositorios() {
  let repositorios = [];
  let pagina = 1;
  let temProximaPagina = true;
  while (temProximaPagina) {
    let resposta;
    try {
      resposta = await fetch(
        `https://api.github.com/users/${encodeURIComponent(perfil.usuarioGithub)}/repos?sort=updated&per_page=100&page=${pagina}`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        },
      );
    } catch {
      throw new Error(
        'Não foi possível conectar ao GitHub. Confira sua conexão e tente novamente.',
      );
    }
    if (!resposta.ok) {
      if (resposta.status === 403 || resposta.status === 429)
        throw new Error(
          'O limite de consultas do GitHub foi atingido. Aguarde alguns minutos e tente novamente.',
        );
      if (resposta.status === 404) throw new Error('O perfil do GitHub não foi encontrado.');
      throw new Error('O GitHub não respondeu como esperado. Tente novamente mais tarde.');
    }
    const lote = await resposta.json();
    if (!Array.isArray(lote)) throw new Error('O GitHub retornou um formato inesperado.');
    repositorios = [...repositorios, ...lote];
    temProximaPagina = (resposta.headers.get('link') || '').includes('rel="next"');
    pagina += 1;
  }
  return repositorios
    .filter((repositorio) => !repositorio.fork)
    .sort(
      (primeiroRepositorio, segundoRepositorio) =>
        new Date(segundoRepositorio.updated_at) - new Date(primeiroRepositorio.updated_at),
    );
}
export function obterRepositorios() {
  // Reutiliza os dados enquanto esta aba estiver aberta, inclusive após cinco minutos.
  if (repositoriosGuardados) return Promise.resolve(repositoriosGuardados);
  if (requisicaoPendente) return requisicaoPendente;
  requisicaoPendente = consultarRepositorios()
    .then((repositorios) => {
      repositoriosGuardados = repositorios;
      return repositorios;
    })
    .finally(() => {
      requisicaoPendente = null;
    });
  return requisicaoPendente;
}
export function validarUrlExterna(valor) {
  if (typeof valor !== 'string') return '';
  return valor.startsWith('https://') || valor.startsWith('http://') ? valor : '';
}
