import { readFile } from 'node:fs/promises';

const base = 'https://cp3-portifolio.vercel.app';
const checks = [];
const record = (name, ok, detail = '') => {
  checks.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
};
const request = (url, options = {}) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(25000) });
const env = Object.fromEntries(
  (await readFile(new URL('../.env', import.meta.url), 'utf8'))
    .split(/\r?\n/)
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => {
      const split = line.indexOf('=');
      return [
        line.slice(0, split),
        line
          .slice(split + 1)
          .trim()
          .replace(/^(['"])(.*)\1$/, '$2'),
      ];
    }),
);

const home = await request(base);
const html = await home.text();
record('Home publicada', home.status === 200 && html.includes('id="root"'));
record(
  'Headers de segurança',
  home.headers.get('x-content-type-options') === 'nosniff' &&
    home.headers.get('x-frame-options') === 'DENY' &&
    Boolean(home.headers.get('strict-transport-security')),
);
record('Idioma e viewport', html.includes('lang="pt-BR"') && html.includes('name="viewport"'));

const paths = [
  '/sobre',
  '/projetos',
  '/projetos/cp3-portifolio',
  '/contato',
  '/login',
  '/dashboard',
  '/pagina-inexistente-auditoria',
];
await Promise.all(
  paths.map(async (path) => {
    const response = await request(base + path);
    record(
      `Acesso direto ${path}`,
      response.status === 200 && (await response.text()) === html,
      'retorna o HTML da SPA; renderização e redirecionamento exigem navegador',
    );
  }),
);

const assets = new Map();
const queue = [...html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css|svg))"/g)].map(
  (match) => new URL(match[1], base).href,
);
while (queue.length) {
  const url = queue.shift();
  if (assets.has(url) || !url.startsWith(base + '/')) continue;
  const response = await request(url);
  const content = await response.text();
  assets.set(url, content);
  record(
    `Arquivo ${new URL(url).pathname}`,
    response.status === 200 && !content.startsWith('<!doctype html>'),
  );
  if (url.endsWith('.js')) {
    for (const match of content.matchAll(
      /["'`]((?:\.?\/)?(?:assets\/)?[\w-]+\.(?:js|css))["'`]/g,
    )) {
      queue.push(new URL(match[1].startsWith('assets/') ? '/' + match[1] : match[1], url).href);
    }
  }
}
const clientCode = [...assets.values()].join('\n');
for (const key of ['SUPABASE_SECRET_KEY', 'RESEND_API_KEY']) {
  const secret = env[key];
  record(
    `Chave privada ${key} ausente nos arquivos públicos`,
    Boolean(secret && secret.length >= 16) && !clientCode.includes(secret),
  );
}
for (const path of ['/.env', '/.env.example']) {
  const response = await request(base + path);
  const content = await response.text();
  record(
    `Configuração privada não exposta em ${path}`,
    !/^(?:VITE_SUPABASE|SUPABASE_SECRET_KEY|RESEND_API_KEY)=/m.test(content) &&
      !Object.values(env)
        .filter(
          (value) =>
            value.length >= 20 && (value.startsWith('sb_secret_') || value.startsWith('re_')),
        )
        .some((value) => content.includes(value)),
  );
}

const post = async (body) => {
  const response = await request(base + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    result = { error: 'Resposta não é JSON.' };
  }
  return { status: response.status, result };
};
const getContact = await request(base + '/api/contact');
record('API rejeita GET', getContact.status === 405);
const valid = {
  name: 'Teste de publicação',
  email: 'teste@example.com',
  subject: 'Teste técnico',
  message: 'Mensagem de teste técnico para conferir a publicação do portfólio.',
};
for (const [name, body, field] of [
  ['JSON inválido', '{', null],
  ['Campos vazios', {}, 'name'],
  ['E-mail inválido', { ...valid, email: 'email-invalido' }, 'email'],
  ['Mensagem curta', { ...valid, message: 'curta' }, 'message'],
  ['Mensagem longa', { ...valid, message: 'a'.repeat(5001) }, 'message'],
]) {
  const { status, result } = await post(body);
  record(
    `API valida ${name}`,
    status === 400 && (!field || Boolean(result.fields?.[field])),
    `HTTP ${status}`,
  );
}

const github = await request(
  'https://api.github.com/users/kobaxzs/repos?sort=updated&per_page=100',
  { headers: { Accept: 'application/vnd.github+json' } },
);
const repos = await github.json();
record(
  'GitHub disponível',
  github.status === 200 && Array.isArray(repos),
  Array.isArray(repos)
    ? `${repos.filter((repo) => !repo.fork).length} repositórios próprios`
    : `HTTP ${github.status}`,
);

const publicConfigMatches =
  clientCode.includes(env.VITE_SUPABASE_URL) &&
  clientCode.includes(env.VITE_SUPABASE_PUBLISHABLE_KEY);
record('Supabase publicado corresponde à configuração local', publicConfigMatches);
if (publicConfigMatches) {
  for (const [table, column, allowed] of [
    ['featured_projects', 'repo_name', true],
    ['messages', 'id', false],
    ['portfolio_owners', 'id', false],
  ]) {
    const response = await request(
      `${env.VITE_SUPABASE_URL}/rest/v1/${table}?select=${column}&limit=1`,
      { headers: { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY } },
    );
    record(
      `Acesso anônimo a ${table}`,
      allowed ? response.status === 200 : [401, 403].includes(response.status),
      `HTTP ${response.status}; ${allowed ? 'leitura pública esperada' : 'bloqueio esperado'}`,
    );
  }
}

if (process.argv.includes('--send-test')) {
  const subject = 'Teste produção ' + new Date().toISOString();
  const { status, result } = await post({ ...valid, subject });
  record(
    'Envio real na produção',
    status === 201 && result.saved === true && result.emailSent === true,
    `HTTP ${status}; salva=${result.saved === true}; provedor aceitou e-mail=${result.emailSent === true}`,
  );
  console.log(`Identificação da mensagem: ${subject}`);
  if (result.saved && publicConfigMatches) {
    const params = new URLSearchParams({ select: 'id,email_sent', subject: 'eq.' + subject });
    const response = await request(`${env.SUPABASE_URL}/rest/v1/messages?${params}`, {
      headers: { apikey: env.SUPABASE_SECRET_KEY },
    });
    const rows = await response.json();
    record(
      'Mensagem real persistida no banco',
      response.ok && Array.isArray(rows) && rows.length === 1 && rows[0].email_sent === true,
      `HTTP ${response.status}`,
    );
  }
}

console.log(
  `Resultado: ${checks.filter((check) => check.ok).length}/${checks.length} verificações passaram.`,
);
console.log(
  'Não verificado: layout, interações React, login autenticado, inbox, Lighthouse e deploy automático.',
);
process.exitCode = checks.some((check) => !check.ok) ? 1 : 0;
