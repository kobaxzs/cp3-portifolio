# Verificação da publicação — 31/10/2026

Endereço testado: https://cp3-portifolio.vercel.app

## Verificado na produção

- A home e os acessos diretos a `/sobre`, `/projetos`,
  `/projetos/cp3-portifolio`, `/contato`, `/login` e `/dashboard` retornaram
  o HTML da aplicação. Uma rota inexistente também recebeu o HTML da SPA,
  necessário para a página 404 do React.
- O JavaScript inicial, o JavaScript do painel, o CSS e o favicon responderam
  corretamente. Isso confirma disponibilidade dos arquivos, sem comprovar sua
  execução no navegador.
- O HTML contém idioma `pt-BR` e configuração de viewport.
- Os cabeçalhos HTTPS/HSTS, `X-Content-Type-Options` e `X-Frame-Options`
  estão presentes.
- As chaves privadas locais de Supabase e Resend não foram encontradas nos
  arquivos públicos consultados. Os caminhos `/.env` e `/.env.example` não
  entregaram os arquivos de configuração.
- A API `/api/contact` rejeitou GET com HTTP 405. JSON inválido, campos vazios,
  e-mail inválido e mensagens fora dos limites retornaram HTTP 400.
- A consulta ao GitHub respondeu com dez repositórios próprios.
- A URL e a chave pública de Supabase presentes na aplicação correspondem à
  configuração local. Visitantes conseguiram consultar os destaques, mas foram
  bloqueados ao consultar mensagens e proprietários (HTTP 401).
- Uma única mensagem identificada como
  `Teste produção 2026-10-31T21:04:00.526Z` foi enviada pela API publicada.
  A resposta foi HTTP 201, com `saved: true` e `emailSent: true`.
  Uma consulta independente confirmou o registro no banco com `email_sent: true`.
  O aceite pelo Resend não confirma a chegada à caixa de entrada.

## Verificado manualmente pelo proprietário

- O login no site publicado abriu o painel com as mensagens e os destaques salvos.
- Após sair da conta, abrir novamente a área do proprietário exigiu novo login.
- As correções dos asteriscos chegaram ao site após os commits e a integração
  dos pull requests na `main`, confirmando o deploy automático da Vercel.
- O link direto de um projeto continuou exibindo os detalhes após atualizar a página.
- Um endereço inexistente exibiu a página 404 do portfólio com opção de retorno.

## Lighthouse mobile apresentado pelo proprietário

Relatório de 31/10/2026 às 18:27 BRT, com Lighthouse 13.6.0, Moto G Power
emulado e limitação lenta de 4G:

| Categoria             | Nota |
| --------------------- | ---- |
| Desempenho            | 100  |
| Acessibilidade        | 100  |
| Práticas recomendadas | 100  |
| SEO                   | 100  |

- First Contentful Paint: 0,8 s.
- Largest Contentful Paint: 0,8 s.
- Speed Index: 0,8 s.
- Total Blocking Time: 0 ms.
- Cumulative Layout Shift: 0.

A medição supera a meta de desempenho 80 do checklist e não registrou saltos
de layout nessa execução. As notas se referem à página e às condições medidas.

## Ainda não verificado

O acesso automatizado ao navegador ficou indisponível. Não foram validados
visualmente o layout em celular e desktop, o menu, a troca de tema, o formulário,
e o bloqueio de uma segunda conta sem autorização em produção.
Também falta a confirmação do e-mail de teste na caixa de entrada.
Os testes locais anteriores continuam
registrados no checklist do README.

## Revisão local de carregamento e cache

- `src/components/ProjectCard.jsx` usa imagens SVG com `loading="lazy"`,
  `decoding="async"` e dimensões reservadas de 660 × 400.
- `src/router.jsx` usa importação dinâmica, `lazy` e `Suspense` para a área
  administrativa. O build também gera um arquivo separado para essa área.
- Os sete testes de `src/services/github.test.js` e `src/pages/Routing.test.jsx`
  passaram. Eles incluem cache e reutilização de requisições, falhas da API,
  recuperação ao tentar novamente, detalhes de projeto e página 404.
- Esses resultados vêm da revisão de código e de testes locais com integrações
  simuladas; não representam uma captura de rede do navegador em produção.

## Repetir as verificações

Na raiz do projeto, com o `.env` local configurado:

```powershell
node scripts/check-published.mjs
```

Esse comando não envia mensagens. Para testar o envio real, acrescente
`--send-test`: cada execução com essa opção cria uma mensagem no banco e tenta
notificar o destinatário configurado na produção.
