import { normalizarVariaveisAmbiente } from './utils/ambiente.js';

const variaveisAmbiente = normalizarVariaveisAmbiente(import.meta.env);

export const perfil = {
  nome: 'Lucas Figueiredo Kobayashi',
  nomeCurto: 'Lucas Kobayashi',
  usuarioGithub: variaveisAmbiente.VITE_USUARIO_GITHUB || 'kobaxzs',
  email: variaveisAmbiente.VITE_EMAIL_CONTATO || 'lucasfkobayashi19@gmail.com',
  linkedin: variaveisAmbiente.VITE_URL_LINKEDIN || '',
};
export const configuracaoSupabase = {
  url: variaveisAmbiente.VITE_URL_SUPABASE || '',
  chave: variaveisAmbiente.VITE_CHAVE_PUBLICA_SUPABASE || '',
};
export const temConfiguracaoBanco = Boolean(configuracaoSupabase.url && configuracaoSupabase.chave);
