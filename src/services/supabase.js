import { createClient } from '@supabase/supabase-js';
import { hasBackend, supabaseConfig } from '../config.js';

// Este módulo só é importado pela área administrativa, carregada sob demanda.
export const supabase = hasBackend ? createClient(supabaseConfig.url, supabaseConfig.key) : null;

export async function verifyOwner() {
  if (!supabase) return false;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    if (error.status === 400 || error.status === 401 || error.status === 403) return false;
    throw new Error('Não foi possível verificar sua sessão. Confira a conexão e tente novamente.');
  }
  if (!user) return false;
  const { data, error: ownerError } = await supabase
    .from('portfolio_owners')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();
  if (ownerError)
    throw new Error('Não foi possível verificar o acesso. Confira a configuração do banco.');
  return Boolean(data);
}

export async function signIn(email, password) {
  if (!supabase) throw new Error('Configure o Supabase para acessar o painel.');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Não foi possível entrar. Confira e-mail e senha e tente novamente.');
}

export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw new Error('Não foi possível encerrar a sessão. Tente novamente.');
}
