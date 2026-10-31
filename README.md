# Portfólio — Lucas Kobayashi

Portfólio de Lucas Figueiredo Kobayashi para o CP3 da FIAP.
GitHub: [kobaxzs](https://github.com/kobaxzs).
Site publicado: [cp3-portifolio.vercel.app](https://cp3-portifolio.vercel.app).
Contato: [lucasfkobayashi19@gmail.com](mailto:lucasfkobayashi19@gmail.com).

## Executar

Use Node.js 22.12 ou superior. No terminal da pasta:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra o endereço informado pelo Vite, normalmente **http://localhost:5173**.
Para encerrar, pressione **Ctrl + C**. As páginas públicas e a consulta ao GitHub
funcionam sem configurar Supabase ou Resend.

```powershell
npm.cmd test              # testes automatizados
npm.cmd run check         # lint, formatação, testes e build
npm.cmd run format        # formatação
npm.cmd run build         # gera dist para publicação
npm.cmd run preview       # visualiza o build gerado
```

O envio do formulário usa `/api/contact`, executado pela Vercel em produção.
Localmente, `npm.cmd run dev` disponibiliza a mesma lógica pelo servidor do Vite,
usando as variáveis do `.env` somente no servidor para acessar Supabase e Resend.
Reinicie o servidor após alterar essas variáveis. O comando `npm.cmd run preview`
serve apenas os arquivos estáticos e não executa a API.

## Tecnologias e funcionalidades

React, React Router, Vite, JavaScript e CSS puro. Projetos vêm da API do GitHub,
com descrição, linguagem, atualização e links individuais. Há estados de
carregamento, erro e vazio, página 404, formulário validado, tema persistente e
layout responsivo. As artes dos cards são ilustrações SVG.

O dashboard usa Supabase Auth e banco com regras RLS para restringir mensagens
e alterações ao dono. Permite marcar mensagens como respondidas e escolher os
destaques da home. A função de contato salva a mensagem antes de solicitar o
envio de e-mail pelo Resend. Se o e-mail falhar, informa o salvamento parcial.
Esses fluxos dependem da configuração dos serviços.

O painel é carregado com `React.lazy` e `Suspense`. Imagens leves usam
`loading="lazy"` e dimensões reservadas. A consulta ao GitHub é reutilizada
durante a navegação na mesma aba; atualizar a página renova os dados.

Vitest e Testing Library cobrem, entre outros casos, a validação do formulário
e o bloqueio do dashboard sem login. As integrações externas são simuladas nos
testes e precisam ser verificadas com as contas reais.

## Configuração dos serviços

Copie `.env.example` para `.env` e preencha os valores. Reinicie o Vite depois.

As variáveis do projeto usam nomes em português. A função
`normalizarVariaveisAmbiente`, em `src/utils/ambiente.js`, também aceita os nomes
anteriores em inglês para manter a compatibilidade com o deploy já configurado.
Quando os dois nomes existem, o valor com nome em português tem preferência.

### Supabase

1. Crie o projeto e execute `supabase/schema.sql` no SQL Editor.
2. Em Authentication, crie a conta do dono, desative o cadastro público e copie
   o UUID do usuário.
3. Autorize essa conta:

   ```sql
   insert into public.portfolio_owners (id) values ('UUID-REAL-DO-USUARIO');
   ```

4. Preencha `VITE_URL_SUPABASE` e `VITE_CHAVE_PUBLICA_SUPABASE`.
5. No servidor, preencha `URL_SUPABASE` e `CHAVE_SECRETA_SUPABASE`.
6. Configure as URLs de Authentication para o endereço usado pelo site.

### Resend

Preencha `CHAVE_API_RESEND`, `EMAIL_REMETENTE_CONTATO` com um remetente autorizado e
`EMAIL_DESTINATARIO_CONTATO` com o destinatário. A resposta ao visitante é feita pelo seu
aplicativo de e-mail; a marcação como respondida no painel é manual.

As chaves privadas ficam somente no servidor. Variáveis com prefixo `VITE_`
são públicas. Nunca publique `.env`.

## Organização e padrões

```text
src/components/   componentes visuais e proteção de rota
src/pages/        páginas públicas e dashboard
src/services/     integrações com APIs
src/hooks/        carregamento e contexto de autenticação
src/utils/        validação compartilhada
src/test/         configuração dos testes
api/              entrada da função na Vercel
server/           lógica do contato e testes
supabase/         tabelas e permissões do banco
public/           imagens e arquivos estáticos
docs/             decisões técnicas, uso da IA e evidências de verificação
.agents/skills/   procedimento reutilizável de revisão para o Codex
```

Componentes em PascalCase, hooks com prefixo `use`, funções e variáveis em
camelCase. Os identificadores próprios são escritos em português, sem acentos,
como `repositorio`, `carregando` e `obterMensagens`. Nomes das APIs, atributos
HTML, métodos das bibliotecas e campos do banco preservam seus contratos.
Chamadas às APIs ficam nos serviços, separadas dos componentes visuais.

Use branches `feature/nome`, `fix/nome` ou `docs/nome` e commits com `feat:`, `fix:`, `docs:`,
`style:` ou `test:`. Integre em `main` por pull request, registrando o histórico
real. Após inicializar o Git, execute `npm.cmd run prepare`: o hook Husky confere
lint e formatação antes dos commits.

Supabase atende ao login e armazenamento; Resend permite enviar e-mail sem expor
a chave no navegador. O cache simples dispensa uma biblioteca adicional.
SVG é adequado às ilustrações vetoriais. Vitest e Testing Library atendem aos
testes exigidos, e ESLint, Prettier e Husky à padronização antes dos commits.

## Instruções para IA e decisões de engenharia

O [AGENTS.md](AGENTS.md) define os padrões que a IA deve seguir neste repositório:
responsabilidades das pastas, nomenclatura, validação, branches e commits.
A [skill de revisão](.agents/skills/revisar-portfolio/SKILL.md) organiza a
conferência da entrega e os diferentes tipos de evidência.

O [registro do harness e do uso da IA](docs/harness-ia.md) descreve a ferramenta,
a identificação do modelo informada pelo aluno, os recursos realmente usados
e as limitações. As [decisões técnicas](docs/decisoes-tecnicas.md) comparam
alternativas, critérios e limitações da stack e mostram o fluxo de dados.

## Pendências para concluir e entregar

As verificações de HTTP, API e banco feitas na produção em 31/10/2026 estão
registradas em [Verificação da publicação](docs/verificacao-publicacao.md),
com os resultados e as verificações visuais que ainda faltam.

- [x] Configurar Supabase, tabelas, conta do dono, URLs e variáveis de ambiente.
- [x] Testar login, saída, redirecionamento de visitantes e bloqueio de contas
      sem autorização, inclusive nas permissões do banco.
- [x] Conferir login e saída no site publicado, novo pedido de login após sair
      e carregamento das mensagens e dos destaques salvos.
- [ ] Conferir carregamento, erro e listas vazias do painel com o serviço real.
- [x] Configurar Resend e fazer um envio real, confirmando recebimento do e-mail
      e a mesma mensagem no dashboard.
- [x] Conferir bloqueio do botão com “Enviando…” durante o envio.
- [x] Conferir confirmação de sucesso após o envio.
- [x] Conferir aviso de mensagem salva com falha no e-mail e confirmar a mensagem no painel.
- [ ] Conferir spinner e erro no envio.
- [x] Marcar uma mensagem como respondida e conferir a persistência.
- [x] Selecionar destaques e conferir a home em outra janela.
- [x] Disponibilizar o Git, inicializar o repositório, ativar o hook e publicar
      no GitHub com commits e branches reais, sem `.env` nem arquivos gerados.
- [x] Importar na Vercel: branch `main`, build `npm run build`, saída `dist` e
      variáveis de ambiente. Confirmar deploy automático após um push real.
- [ ] Na URL pública, conferir menu, cards, formulário e painel em celular e
      desktop, sem cortes ou rolagem horizontal.
- [ ] Confirmar no site publicado que o tema escolhido permanece após atualizar
      a página e voltar ao site.
- [x] Abrir diretamente o link de um projeto, atualizar o navegador e conferir
      a página 404 no site publicado.
- [ ] Conferir falhas da API do GitHub e os dados dos repositórios na interface.
- [x] Medir Lighthouse mobile na URL pública: desempenho 100, acessibilidade 100,
      práticas recomendadas 100, SEO 100 e CLS 0 (relatório de 31/10/2026).
- [x] Conferir no código imagens adiadas e painel sob demanda; confirmar em teste
      o reaproveitamento das consultas ao GitHub entre páginas.
- [x] Preparar instruções para IA, skill de revisão, registro do harness e
      comparação das decisões técnicas conforme o resumo do enunciado.
- [x] Confirmar o reconhecimento da skill pelo Codex e publicar as instruções
      e a documentação no GitHub (PR #3 integrado).
- [x] Registrar GPT-5.6 Luna como modelo do ChatGPT gratuito informado pelo aluno.
- [ ] Conferir o modelo selecionado no Codex e explicar a escolha das ferramentas
      na apresentação.
- [ ] Preparar e gravar o vídeo de até oito minutos, com rosto e tela visíveis,
      explicando arquitetura, escolhas técnicas e uso real da IA. Publicar no
      YouTube como não listado.
- [ ] Entregar os links do GitHub, Vercel e vídeo no Teams, conforme o prazo de
      03/11 informado no enunciado recebido.
