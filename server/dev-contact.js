import { Readable as FluxoLeitura } from 'node:stream';
import { tratarContato } from './contact.js';
export function pluginContatoLocal(ambiente) {
  return {
    name: 'portfolio-contact-api',
    apply: 'serve',
    configureServer(servidor) {
      servidor.middlewares.use(async (requisicaoRecebida, respostaServidor, continuar) => {
        if (requisicaoRecebida.url?.split('?')[0] !== '/api/contact') return continuar();
        try {
          const solicitacao = new Request(new URL(requisicaoRecebida.url, 'http://localhost'), {
            method: requisicaoRecebida.method,
            headers: requisicaoRecebida.headers,
            ...(requisicaoRecebida.method !== 'GET' && requisicaoRecebida.method !== 'HEAD'
              ? {
                  body: FluxoLeitura.toWeb(requisicaoRecebida),
                  duplex: 'half',
                }
              : {}),
          });
          const resposta = await tratarContato(solicitacao, ambiente);
          respostaServidor.writeHead(resposta.status, Object.fromEntries(resposta.headers));
          respostaServidor.end(Buffer.from(await resposta.arrayBuffer()));
        } catch {
          respostaServidor.writeHead(500, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          });
          respostaServidor.end(
            JSON.stringify({
              error: 'Não foi possível processar sua mensagem.',
            }),
          );
        }
      });
    },
  };
}
