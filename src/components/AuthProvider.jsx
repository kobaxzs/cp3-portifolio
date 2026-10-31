import { useEffect as useEfeito, useState as useEstado } from 'react';
import { ContextoAutenticacao } from '../hooks/AuthContext.js';
import { clienteSupabase, verificarDono } from '../services/supabase.js';
export default function ProvedorAutenticacao({ children: conteudo }) {
  const [sessao, definirSessao] = useEstado(undefined);
  const [tentativa, definirTentativa] = useEstado(0);
  const [acesso, definirAcesso] = useEstado({
    carregando: true,
    dono: false,
    erro: '',
  });
  useEfeito(() => {
    if (!clienteSupabase) {
      definirSessao(null);
      return;
    }
    const { data: dados } = clienteSupabase.auth.onAuthStateChange((_evento, proximaSessao) => {
      // Callback síncrono: a verificação de rede acontece no efeito abaixo.
      definirAcesso({
        carregando: true,
        dono: false,
        erro: '',
      });
      definirSessao(proximaSessao);
    });
    return () => dados.subscription.unsubscribe();
  }, []);
  useEfeito(() => {
    let ativo = true;
    if (sessao === undefined) return;
    if (!sessao) {
      definirAcesso({
        carregando: false,
        dono: false,
        erro: '',
      });
      return;
    }
    definirAcesso({
      carregando: true,
      dono: false,
      erro: '',
    });
    verificarDono()
      .then((dono) => {
        if (ativo)
          definirAcesso({
            carregando: false,
            dono,
            erro: '',
          });
      })
      .catch((erro) => {
        if (ativo)
          definirAcesso({
            carregando: false,
            dono: false,
            erro: erro.message,
          });
      });
    return () => {
      ativo = false;
    };
  }, [sessao, tentativa]);
  return (
    <ContextoAutenticacao.Provider
      value={{
        ...acesso,
        sessao,
        tentarNovamente: () => definirTentativa(tentativa + 1),
      }}
    >
      {conteudo}
    </ContextoAutenticacao.Provider>
  );
}
