# Instruções para IA — Portfólio CP3

Este arquivo orienta o apoio técnico ao portfólio de Lucas Kobayashi.
Consulte o README para conhecer a estrutura e executar o projeto.

## Escopo do apoio

- Ajude com dúvidas, revisão de código, diagnóstico de erros e configurações
  solicitadas, especialmente banco de dados, autenticação e integrações.
- Trabalhe no problema apresentado. Explique a solução e faça as alterações
  necessárias dentro desse escopo, preservando o restante da implementação.
- Em SQL, explique a finalidade das tabelas, relações, permissões e políticas.
  Indique como executar e verificar a consulta.
- Apresente o motivo das decisões e as limitações relevantes, para permitir
  que o responsável pelo projeto revise a solução.

## Arquitetura e código

- Preserve React, React Router, Vite, JavaScript e CSS enquanto a tarefa não
  exigir outra solução. Justifique dependências novas pela necessidade concreta.
- Use `src/pages/` para páginas e `src/components/` para elementos reutilizáveis.
  Integrações ficam em `src/services/`, estado compartilhado e carregamento em
  `src/hooks/` e validação compartilhada em `src/utils/`.
- Mantenha a entrada de produção em `api/contact.js` e a lógica de contato em
  `server/contact.js`. O servidor local do Vite reutiliza essa lógica.
- Use PascalCase em componentes, prefixo `use` em hooks e camelCase em funções
  e variáveis. Escreva os identificadores próprios em português, sem acentos,
  com nomes diretos, como `dados`, `repositorio` e `carregarPainel`.
  Preserve os nomes exigidos por bibliotecas, APIs, HTML e pelo banco.
  Siga ESLint e Prettier existentes.
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
- Ao receber um pedido de revisão da entrega, consulte a skill
  `.agents/skills/revisar-portfolio/SKILL.md`. Aproveite resultados válidos já
  obtidos sobre o mesmo diff, sem repetir verificações sem motivo.
- Ao documentar uma verificação, diferencie teste local simulado, consulta
  HTTP/API de produção e confirmação manual. HTTP 200 de uma SPA não comprova
  layout, login, redirecionamento ou renderização da página 404.

## Comunicação

Responda em português, com explicações diretas e exemplos quando ajudarem.
Informe o que foi alterado, como conferir o resultado e as limitações encontradas.
Registre apenas verificações executadas e ferramentas realmente utilizadas.
