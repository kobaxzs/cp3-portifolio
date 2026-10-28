import { supabase } from './supabase.js';
import { clearFeaturedCache } from './featured.js';

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('id,name,email,subject,message,responded,email_sent,created_at')
    .order('created_at', { ascending: false });
  if (error)
    throw new Error(
      'Não foi possível carregar as mensagens. Confira sua sessão e as regras do banco.',
    );
  return data;
}

export async function setResponded(id, responded) {
  const { data, error } = await supabase
    .from('messages')
    .update({ responded })
    .eq('id', id)
    .select('id')
    .single();
  if (error || !data) throw new Error('Não foi possível atualizar a mensagem.');
}

export async function getOwnerFeatured() {
  const { data, error } = await supabase.from('featured_projects').select('repo_name');
  if (error) throw new Error('Não foi possível carregar os destaques.');
  return data.map((item) => item.repo_name);
}

export async function toggleFeatured(name, selected) {
  const result = selected
    ? await supabase.from('featured_projects').insert({ repo_name: name })
    : await supabase.from('featured_projects').delete().eq('repo_name', name);
  if (result.error) throw new Error('Não foi possível salvar o destaque.');
  clearFeaturedCache();
}
