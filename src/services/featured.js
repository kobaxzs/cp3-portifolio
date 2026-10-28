import { hasBackend, supabaseConfig } from '../config.js';

let pending;
let cached;

export function clearFeaturedCache() {
  cached = undefined;
}

export function getFeaturedProjects() {
  if (!hasBackend) return Promise.resolve({ configured: false, names: [] });
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = fetch(
    `${supabaseConfig.url}/rest/v1/featured_projects?select=repo_name&order=created_at.asc`,
    { headers: { apikey: supabaseConfig.key } },
  )
    .then(async (response) => {
      if (!response.ok) throw new Error('Não foi possível consultar os destaques.');
      const rows = await response.json();
      cached = { configured: true, names: rows.map((row) => row.repo_name) };
      return cached;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
