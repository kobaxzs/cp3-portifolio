import { createClient as criarCliente } from '@supabase/supabase-js';
import { temConfiguracaoBanco, configuracaoSupabase } from '../config.js';

// Este módulo só é importado pela área administrativa, carregada sob demanda.
export const clienteSupabase = temConfiguracaoBanco
  ? criarCliente(configuracaoSupabase.url, configuracaoSupabase.chave)
  : null;
export async function verificarDono() {
  if (!clienteSupabase) return false;
  const {
    data: { user: usuario },
    error: erro,
  } = await clienteSupabase.auth.getUser();
  if (erro) {
    if (erro.status === 400 || erro.status === 401 || erro.status === 403) return false;
    throw new Error('Não foi possível verificar sua sessão. Confira a conexão e tente novamente.');
  }
  if (!usuario) return false;
  const { data: dados, error: erroPermissao } = await clienteSupabase
    .from('portfolio_owners')
    .select('id')
    .eq('id', usuario.id)
    .maybeSingle();
  if (erroPermissao)
    throw new Error('Não foi possível verificar o acesso. Confira a configuração do banco.');
  return Boolean(dados);
}
export async function entrarNaConta(email, senha) {
  if (!clienteSupabase) throw new Error('Configure o Supabase para acessar o painel.');
  const { error: erro } = await clienteSupabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (erro) throw new Error('Não foi possível entrar. Confira e-mail e senha e tente novamente.');
}
export async function encerrarSessao() {
  const { error: erro } = await clienteSupabase.auth.signOut({
    scope: 'local',
  });
  if (erro) throw new Error('Não foi possível encerrar a sessão. Tente novamente.');
}
