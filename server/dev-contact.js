import { Readable } from 'node:stream';
import { handleContact } from './contact.js';

export function contactDevPlugin(env) {
  return {
    name: 'portfolio-contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/contact') return next();

        try {
          const request = new Request(new URL(req.url, 'http://localhost'), {
            method: req.method,
            headers: req.headers,
            ...(req.method !== 'GET' && req.method !== 'HEAD'
              ? { body: Readable.toWeb(req), duplex: 'half' }
              : {}),
          });
          const response = await handleContact(request, env);
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          res.writeHead(500, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          });
          res.end(JSON.stringify({ error: 'Não foi possível processar sua mensagem.' }));
        }
      });
    },
  };
}
