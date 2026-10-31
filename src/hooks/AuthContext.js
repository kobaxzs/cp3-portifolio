import { createContext as criarContexto, useContext as useContexto } from 'react';
export const ContextoAutenticacao = criarContexto({
  carregando: true,
  dono: false,
  sessao: null,
  erro: '',
});
export function useAutenticacao() {
  return useContexto(ContextoAutenticacao);
}
