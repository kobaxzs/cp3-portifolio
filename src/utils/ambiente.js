const nomesAnteriores = {
  VITE_USUARIO_GITHUB: 'VITE_GITHUB_USERNAME',
  VITE_EMAIL_CONTATO: 'VITE_CONTACT_EMAIL',
  VITE_URL_LINKEDIN: 'VITE_LINKEDIN_URL',
  VITE_URL_SUPABASE: 'VITE_SUPABASE_URL',
  VITE_CHAVE_PUBLICA_SUPABASE: 'VITE_SUPABASE_PUBLISHABLE_KEY',
  URL_SUPABASE: 'SUPABASE_URL',
  CHAVE_SECRETA_SUPABASE: 'SUPABASE_SECRET_KEY',
  CHAVE_API_RESEND: 'RESEND_API_KEY',
  EMAIL_DESTINATARIO_CONTATO: 'CONTACT_TO_EMAIL',
  EMAIL_REMETENTE_CONTATO: 'CONTACT_FROM_EMAIL',
};
export function normalizarVariaveisAmbiente(variaveis = {}) {
  const variaveisNormalizadas = {};
  for (const [nomeAtual, nomeAnterior] of Object.entries(nomesAnteriores)) {
    variaveisNormalizadas[nomeAtual] = variaveis[nomeAtual] || variaveis[nomeAnterior] || '';
  }
  return variaveisNormalizadas;
}
