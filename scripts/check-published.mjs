import { readFile as lerArquivo } from 'node:fs/promises';
import { normalizarVariaveisAmbiente } from '../src/utils/ambiente.js';
const base = 'https://cp3-portifolio.vercel.app';
const verificacoes = [];
const registrar = (nome, correto, detalhe = '') => {
  verificacoes.push({
    nome,
    correto,
    detalhe,
  });
  console.log(`${correto ? 'PASS' : 'FAIL'} ${nome}${detalhe ? `: ${detalhe}` : ''}`);
};
const solicitacao = (url, opcoes = {}) =>
  fetch(url, {
    ...opcoes,
    signal: AbortSignal.timeout(25000),
  });
const ambiente = normalizarVariaveisAmbiente(
  Object.fromEntries(
    (await lerArquivo(new URL('../.env', import.meta.url), 'utf8'))
      .split(/\r?\n/)
      .filter((linha) => /^[A-Z_]+=/.test(linha))
      .map((linha) => {
        const posicaoIgual = linha.indexOf('=');
        return [
          linha.slice(0, posicaoIgual),
          linha
            .slice(posicaoIgual + 1)
            .trim()
            .replace(/^(['"])(.*)\1$/, '$2'),
        ];
      }),
  ),
);
const paginaInicial = await solicitacao(base);
const htmlPagina = await paginaInicial.text();
registrar('Home publicada', paginaInicial.status === 200 && htmlPagina.includes('id="root"'));
registrar(
  'Headers de segurança',
  paginaInicial.headers.get('x-content-type-options') === 'nosniff' &&
    paginaInicial.headers.get('x-frame-options') === 'DENY' &&
    Boolean(paginaInicial.headers.get('strict-transport-security')),
);
registrar(
  'Idioma e viewport',
  htmlPagina.includes('lang="pt-BR"') && htmlPagina.includes('name="viewport"'),
);
const caminhos = [
  '/sobre',
  '/projetos',
  '/projetos/cp3-portifolio',
  '/contato',
  '/login',
  '/dashboard',
  '/pagina-inexistente-auditoria',
];
await Promise.all(
  caminhos.map(async (caminho) => {
    const resposta = await solicitacao(base + caminho);
    registrar(
      `Acesso direto ${caminho}`,
      resposta.status === 200 && (await resposta.text()) === htmlPagina,
      'retorna o HTML da SPA; renderização e redirecionamento exigem navegador',
    );
  }),
);
const arquivosEstaticos = new Map();
const fila = [...htmlPagina.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css|svg))"/g)].map(
  (correspondencia) => new URL(correspondencia[1], base).href,
);
while (fila.length) {
  const url = fila.shift();
  if (arquivosEstaticos.has(url) || !url.startsWith(base + '/')) continue;
  const resposta = await solicitacao(url);
  const conteudoArquivo = await resposta.text();
  arquivosEstaticos.set(url, conteudoArquivo);
  registrar(
    `Arquivo ${new URL(url).pathname}`,
    resposta.status === 200 && !conteudoArquivo.startsWith('<!doctype html>'),
  );
  if (url.endsWith('.js')) {
    for (const correspondencia of conteudoArquivo.matchAll(
      /["'`]((?:\.?\/)?(?:assets\/)?[\w-]+\.(?:js|css))["'`]/g,
    )) {
      fila.push(
        new URL(
          correspondencia[1].startsWith('assets/') ? '/' + correspondencia[1] : correspondencia[1],
          url,
        ).href,
      );
    }
  }
}
const codigoCliente = [...arquivosEstaticos.values()].join('\n');
for (const chave of ['CHAVE_SECRETA_SUPABASE', 'CHAVE_API_RESEND']) {
  const segredo = ambiente[chave];
  registrar(
    `Chave privada ${chave} ausente nos arquivos públicos`,
    Boolean(segredo && segredo.length >= 16) && !codigoCliente.includes(segredo),
  );
}
for (const caminho of ['/.env', '/.env.example']) {
  const resposta = await solicitacao(base + caminho);
  const conteudoArquivo = await resposta.text();
  registrar(
    `Configuração privada não exposta em ${caminho}`,
    !/^(?:VITE_(?:SUPABASE|URL_SUPABASE|CHAVE_PUBLICA_SUPABASE)|SUPABASE_SECRET_KEY|RESEND_API_KEY|CHAVE_SECRETA_SUPABASE|CHAVE_API_RESEND)=/m.test(
      conteudoArquivo,
    ) &&
      !Object.values(ambiente)
        .filter(
          (valor) =>
            valor.length >= 20 && (valor.startsWith('sb_secret_') || valor.startsWith('re_')),
        )
        .some((valor) => conteudoArquivo.includes(valor)),
  );
}
const enviarRequisicao = async (corpo) => {
  const resposta = await solicitacao(base + '/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  });
  let resultado;
  try {
    resultado = await resposta.json();
  } catch {
    resultado = {
      error: 'Resposta não é JSON.',
    };
  }
  return {
    codigoStatus: resposta.status,
    resultado,
  };
};
const consultaContato = await solicitacao(base + '/api/contact');
registrar('API rejeita GET', consultaContato.status === 405);
const valido = {
  name: 'Teste de publicação',
  email: 'teste@example.com',
  subject: 'Teste técnico',
  message: 'Mensagem de teste técnico para conferir a publicação do portfólio.',
};
for (const [nome, corpo, campo] of [
  ['JSON inválido', '{', null],
  ['Campos vazios', {}, 'name'],
  [
    'E-mail inválido',
    {
      ...valido,
      email: 'email-invalido',
    },
    'email',
  ],
  [
    'Mensagem curta',
    {
      ...valido,
      message: 'curta',
    },
    'message',
  ],
  [
    'Mensagem longa',
    {
      ...valido,
      message: 'a'.repeat(5001),
    },
    'message',
  ],
]) {
  const { codigoStatus, resultado } = await enviarRequisicao(corpo);
  registrar(
    `API valida ${nome}`,
    codigoStatus === 400 && (!campo || Boolean(resultado.fields?.[campo])),
    `HTTP ${codigoStatus}`,
  );
}
const respostaGithub = await solicitacao(
  'https://api.github.com/users/kobaxzs/repos?sort=updated&per_page=100',
  {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  },
);
const repositorios = await respostaGithub.json();
registrar(
  'GitHub disponível',
  respostaGithub.status === 200 && Array.isArray(repositorios),
  Array.isArray(repositorios)
    ? `${repositorios.filter((repositorio) => !repositorio.fork).length} repositórios próprios`
    : `HTTP ${respostaGithub.status}`,
);
const configuracaoPublicaConfere =
  codigoCliente.includes(ambiente.VITE_URL_SUPABASE) &&
  codigoCliente.includes(ambiente.VITE_CHAVE_PUBLICA_SUPABASE);
registrar('Supabase publicado corresponde à configuração local', configuracaoPublicaConfere);
if (configuracaoPublicaConfere) {
  for (const [tabela, coluna, permitido] of [
    ['featured_projects', 'repo_name', true],
    ['messages', 'id', false],
    ['portfolio_owners', 'id', false],
  ]) {
    const resposta = await solicitacao(
      `${ambiente.VITE_URL_SUPABASE}/rest/v1/${tabela}?select=${coluna}&limit=1`,
      {
        headers: {
          apikey: ambiente.VITE_CHAVE_PUBLICA_SUPABASE,
        },
      },
    );
    registrar(
      `Acesso anônimo a ${tabela}`,
      permitido ? resposta.status === 200 : [401, 403].includes(resposta.status),
      `HTTP ${resposta.status}; ${permitido ? 'leitura pública esperada' : 'bloqueio esperado'}`,
    );
  }
}
if (process.argv.includes('--send-test')) {
  const assunto = 'Teste produção ' + new Date().toISOString();
  const { codigoStatus, resultado } = await enviarRequisicao({
    ...valido,
    subject: assunto,
  });
  registrar(
    'Envio real na produção',
    codigoStatus === 201 && resultado.saved === true && resultado.emailSent === true,
    `HTTP ${codigoStatus}; salva=${resultado.saved === true}; provedor aceitou e-mail=${resultado.emailSent === true}`,
  );
  console.log(`Identificação da mensagem: ${assunto}`);
  if (resultado.saved && configuracaoPublicaConfere) {
    const parametros = new URLSearchParams({
      select: 'id,email_sent',
      subject: 'eq.' + assunto,
    });
    const resposta = await solicitacao(`${ambiente.URL_SUPABASE}/rest/v1/messages?${parametros}`, {
      headers: {
        apikey: ambiente.CHAVE_SECRETA_SUPABASE,
      },
    });
    const registros = await resposta.json();
    registrar(
      'Mensagem real persistida no banco',
      resposta.ok &&
        Array.isArray(registros) &&
        registros.length === 1 &&
        registros[0].email_sent === true,
      `HTTP ${resposta.status}`,
    );
  }
}
console.log(
  `Resultado: ${verificacoes.filter((verificacao) => verificacao.correto).length}/${verificacoes.length} verificações passaram.`,
);
console.log(
  'Não verificado: layout, interações React, login autenticado, inbox, Lighthouse e deploy automático.',
);
process.exitCode = verificacoes.some((verificacao) => !verificacao.correto) ? 1 : 0;
