import { useEffect as useEfeito, useState as useEstado } from 'react';

// Evita repetir loading/erro/dados em cada página. O cache fica nos services.
export default function useDados(carregar) {
  const [estado, definirEstado] = useEstado({
    carregando: true,
    dados: null,
    erro: '',
  });
  const [tentativa, definirTentativa] = useEstado(0);
  useEfeito(() => {
    let ativo = true;
    definirEstado({
      carregando: true,
      dados: null,
      erro: '',
    });
    carregar()
      .then((dados) => {
        if (ativo)
          definirEstado({
            carregando: false,
            dados,
            erro: '',
          });
      })
      .catch((erro) => {
        if (ativo)
          definirEstado({
            carregando: false,
            dados: null,
            erro: erro.message,
          });
      });
    return () => {
      ativo = false;
    };
  }, [carregar, tentativa]);
  return {
    ...estado,
    tentarNovamente: () => definirTentativa(tentativa + 1),
  };
}
