import { temConfiguracaoBanco, configuracaoSupabase } from '../config.js';
let consultaPendente;
let dadosGuardados;
export function limparCacheDestaques() {
  dadosGuardados = undefined;
}
export function obterProjetosDestaque() {
  if (!temConfiguracaoBanco)
    return Promise.resolve({
      configurado: false,
      nomes: [],
    });
  if (dadosGuardados) return Promise.resolve(dadosGuardados);
  if (consultaPendente) return consultaPendente;
  consultaPendente = fetch(
    `${configuracaoSupabase.url}/rest/v1/featured_projects?select=repo_name&order=created_at.asc`,
    {
      headers: {
        apikey: configuracaoSupabase.chave,
      },
    },
  )
    .then(async (resposta) => {
      if (!resposta.ok) throw new Error('Não foi possível consultar os destaques.');
      const registros = await resposta.json();
      dadosGuardados = {
        configurado: true,
        nomes: registros.map((registro) => registro.repo_name),
      };
      return dadosGuardados;
    })
    .finally(() => {
      consultaPendente = null;
    });
  return consultaPendente;
}
