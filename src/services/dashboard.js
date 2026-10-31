import { clienteSupabase } from './supabase.js';
import { limparCacheDestaques } from './featured.js';
export async function obterMensagens() {
  const { data: dados, error: erro } = await clienteSupabase
    .from('messages')
    .select('id,name,email,subject,message,responded,email_sent,created_at')
    .order('created_at', {
      ascending: false,
    });
  if (erro)
    throw new Error(
      'Não foi possível carregar as mensagens. Confira sua sessão e as regras do banco.',
    );
  return dados;
}
export async function marcarRespondida(identificador, respondida) {
  const { data: dados, error: erro } = await clienteSupabase
    .from('messages')
    .update({
      responded: respondida,
    })
    .eq('id', identificador)
    .select('id')
    .single();
  if (erro || !dados) throw new Error('Não foi possível atualizar a mensagem.');
}
export async function obterDestaquesDono() {
  const { data: dados, error: erro } = await clienteSupabase
    .from('featured_projects')
    .select('repo_name');
  if (erro) throw new Error('Não foi possível carregar os destaques.');
  return dados.map((item) => item.repo_name);
}
export async function alterarDestaque(nome, selecionado) {
  const resultado = selecionado
    ? await clienteSupabase.from('featured_projects').insert({
        repo_name: nome,
      })
    : await clienteSupabase.from('featured_projects').delete().eq('repo_name', nome);
  if (resultado.error) throw new Error('Não foi possível salvar o destaque.');
  limparCacheDestaques();
}
