import { useRouteError as useErroRota } from 'react-router';
export default function ErroRota() {
  const erro = useErroRota();
  return (
    <main className="container error-page">
      <p className="eyebrow">ERRO NA APLICAÇÃO</p>
      <h1>Algo interrompeu esta página.</h1>
      <p>Ocorreu uma falha ao abrir o conteúdo. Tente recarregar a página.</p>
      {import.meta.env.DEV && (
        <pre className="error-debug">{erro?.stack || erro?.message || String(erro)}</pre>
      )}
      <a href="/" className="button">
        Recarregar o início
      </a>
    </main>
  );
}
