# Roteiro de apresentação — até 7min40s

Rascunho baseado no checklist atual do README. Conferir o enunciado original
antes da gravação final, especialmente duração, presença de rosto e tela e
forma de entrega. O roteiro não substitui a rubrica do professor.

Mostre o site publicado e os trechos de código indicados. Mantenha o `.env`
e as páginas com chaves de API fechados durante a gravação.

## 0:00–0:30 — Apresentação

Apresente seu nome, o curso e a finalidade do portfólio. Explique que reúne
seus estudos e projetos públicos do GitHub.

## 0:30–1:30 — Páginas públicas

Mostre início, projetos, detalhes de um repositório, sobre e contato.
Demonstre a troca de tema, o layout no celular e a página 404. Explique que
os projetos vêm da API do GitHub, com nome, descrição, linguagem e links.

## 1:30–3:00 — Contato e painel

Mostre a validação ao tentar enviar o formulário vazio. Depois envie uma
mensagem identificada como teste da apresentação e mostre o estado “Enviando…”.
Entre com a conta do proprietário, encontre a mensagem, marque como respondida
e atualize a página para mostrar a persistência. Mostre os destaques salvos.
Encerre a sessão e abra novamente o painel para demonstrar o pedido de login.

## 3:00–4:20 — Arquitetura

Use o código para explicar:

- `src/router.jsx`: rotas públicas, rota 404 e área administrativa sob demanda.
- `src/pages/` e `src/components/`: separação entre páginas e componentes.
- `src/services/`: integração com GitHub, Supabase e API de contato.
- `api/contact.js` e `server/contact.js`: processamento do contato no servidor.
- `supabase/schema.sql`: tabelas, privilégios e políticas de acesso.

O projeto usa React, React Router, Vite, JavaScript e CSS. Supabase fornece
autenticação e banco; Resend envia a notificação por e-mail; Vercel hospeda o
site e a função de contato.

## 4:20–5:20 — Segurança e persistência

Explique que fazer login não basta: a conta precisa estar em `portfolio_owners`.
As políticas RLS também limitam o acesso no banco. Visitantes leem os destaques,
mas não as mensagens.

Mostre `supabase/test-access.sql` e explique que ele verifica contas autorizadas,
não autorizadas e visitantes, desfazendo os dados temporários com `ROLLBACK`.

Explique que a chave pública fica no cliente e que as chaves privadas de Supabase
e Resend ficam no servidor. A mensagem é salva antes de solicitar o e-mail;
se o provedor falhar, o visitante recebe um aviso de salvamento parcial.

## 5:20–6:20 — Qualidade e desempenho

Mostre o resultado de `npm.cmd run check`: lint, formatação, testes e build.
Na última validação completa, os 38 testes passaram.

Mostre o relatório mobile apresentado em 31/10/2026: notas 100 nas quatro
categorias e CLS 0. Explique que as notas correspondem àquela medição.

Mostre as imagens com `loading="lazy"`, a importação dinâmica da área
administrativa e o cache das consultas ao GitHub. Explique o deploy automático
depois da integração de um pull request na `main`.

## 6:20–7:20 — Uso real da IA

Descreva com suas palavras o que a IA fez e como você verificou o resultado.
Exemplos que aconteceram neste projeto:

- Orientação para configurar Supabase, Resend e Vercel.
- Investigação dos erros de autorização, configuração e envio de contato.
- Implementação da rota de contato no servidor local do Vite.
- Troca dos asteriscos de texto por SVG após o problema observado no celular.
- Preparação de testes e documentação, seguida de validações automatizadas e
  manuais feitas por você.

Um exemplo de revisão: a transcrição de um UUID estava errada e foi substituída
pela consulta do usuário por e-mail. Explique por que não basta copiar a resposta
da IA sem verificar. Não atribua a si mesmo alterações feitas pela ferramenta;
mostre que entende o código entregue.

## 7:20–7:40 — Encerramento

Mostre os links do repositório e do site. Resuma o que aprendeu e encerre.
Após gravar, confira áudio, legibilidade e duração. Publique conforme as regras
do enunciado; o checklist atual prevê YouTube como não listado.
