import { profile } from '../config.js';

let cachedRepos;
let pendingRequest;

async function requestRepos() {
  let repos = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    let response;
    try {
      response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(profile.github)}/repos?sort=updated&per_page=100&page=${page}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
    } catch {
      throw new Error(
        'Não foi possível conectar ao GitHub. Confira sua conexão e tente novamente.',
      );
    }
    if (!response.ok) {
      if (response.status === 403 || response.status === 429)
        throw new Error(
          'O limite de consultas do GitHub foi atingido. Aguarde alguns minutos e tente novamente.',
        );
      if (response.status === 404) throw new Error('O perfil do GitHub não foi encontrado.');
      throw new Error('O GitHub não respondeu como esperado. Tente novamente mais tarde.');
    }
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('O GitHub retornou um formato inesperado.');
    repos = [...repos, ...batch];
    hasNextPage = (response.headers.get('link') || '').includes('rel="next"');
    page += 1;
  }
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export function getRepositories() {
  // Reutiliza os dados enquanto esta aba estiver aberta, inclusive após cinco minutos.
  if (cachedRepos) return Promise.resolve(cachedRepos);
  if (pendingRequest) return pendingRequest;
  pendingRequest = requestRepos()
    .then((repos) => {
      cachedRepos = repos;
      return repos;
    })
    .finally(() => {
      pendingRequest = null;
    });
  return pendingRequest;
}

export function safeExternalUrl(value) {
  if (typeof value !== 'string') return '';
  return value.startsWith('https://') || value.startsWith('http://') ? value : '';
}
