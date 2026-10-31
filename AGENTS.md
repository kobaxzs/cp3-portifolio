# Instruções para IA — Portfólio CP3

Este projeto é um portfólio individual de Lucas Kobayashi. Faça mudanças que o
aluno consiga explicar. Consulte o README para executar o projeto e
`docs/harness-ia.md` para o registro do uso da IA e das ferramentas.

## Arquitetura e código

- Preserve React, React Router, Vite, JavaScript e CSS enquanto a tarefa não
  exigir outra solução. Justifique dependências novas pela necessidade concreta.
- Use `src/pages/` para páginas e `src/components/` para elementos reutilizáveis.
  Integrações ficam em `src/services/`, estado compartilhado e carregamento em
  `src/hooks/` e validação compartilhada em `src/utils/`.
- Mantenha a entrada de produção em `api/contact.js` e a lógica de contato em
  `server/contact.js`. O servidor local do Vite reutiliza essa lógica.
- Use PascalCase em componentes, prefixo `use` em hooks e camelCase em funções
  e variáveis. Siga ESLint e Prettier existentes.
- Preserve labels, foco, feedback por campo e estados de carregamento, erro e
  lista vazia ao alterar interfaces com dados. No contato, bloqueie duplicidade
  de envio e mantenha o texto preenchido se a requisição falhar.
- Reutilize os SVGs de `Icon.jsx` para asteriscos e outros ícones decorativos.
  Preserve imagens com dimensões reservadas e carregamento adiado, importação
  dinâmica do painel e cache do GitHub entre páginas.

## Dados e acesso

- `VITE_` identifica variáveis públicas. Chaves privadas de Supabase e Resend
  ficam no servidor, sem esse prefixo. `.env.example` contém apenas exemplos.
- O acesso ao painel exige sessão válida e cadastro em `portfolio_owners`.
  Preserve também os privilégios e a RLS de `supabase/schema.sql`.
- Salve a mensagem antes de solicitar o e-mail. Informe salvamento parcial
  quando o provedor falhar; isso não deve incentivar um envio duplicado.
- Nos testes automatizados, simule serviços externos. Use o teste SQL com
  `ROLLBACK` para verificar permissões. Testes reais com envio ou escrita no
  serviço devem fazer parte do pedido do usuário e ser identificados como teste.

## Git e validação

- Leia `git status` e o diff antes de editar ou preparar um commit. Preserve
  alterações já existentes do usuário.
- Use uma branch por mudança: `feature/nome`, `fix/nome` ou `docs/nome`.
  Integre em `main` por pull request; a Vercel publica essa branch automaticamente.
- Use commits `feat:`, `fix:`, `docs:`, `style:` ou `test:`, descrevendo a mudança
  real. Adicione arquivos por nome; não inclua `.env`, `dist/` ou `node_modules/`.
- Em mudanças de aplicação, execute `npm.cmd run check` antes da entrega.
  Para alterações apenas em Markdown, `npm.cmd run format:check` é suficiente.
  O hook `.husky/pre-commit` executa lint e formatação; não o ignore.
- Ao preparar ou revisar uma entrega, consulte a skill
  `.agents/skills/revisar-portfolio/SKILL.md`. Aproveite resultados válidos já
  obtidos sobre o mesmo diff, sem repetir verificações sem motivo.
- Atualize o README com evidência: diferencie teste local simulado, consulta
  HTTP/API de produção e confirmação manual do aluno. HTTP 200 de uma SPA não
  comprova layout, login, redirecionamento ou renderização da página 404.

## Comunicação

Responda em português com o resultado, os arquivos relevantes, a verificação
executada e o que ainda falta. Documente limitações e falhas sem atribuir uso
de modelos, skills, MCPs ou subagentes que não aconteceu. A gravação e a revisão
do vídeo ficam para o final, conforme preferência do aluno.
