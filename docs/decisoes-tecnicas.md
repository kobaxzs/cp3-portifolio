# Decisões técnicas do portfólio

Comparação das escolhas presentes no código com alternativas para explicar os
critérios e as limitações na apresentação. Não representa um benchmark nem
afirma que todos os produtos citados tenham sido instalados e experimentados.
O aluno deve revisar as justificativas e explicar quais refletem sua decisão.

| Escolha                                         | Alternativa considerada na análise                       | Critério e vantagem neste projeto                                                                         | Limitação aceita                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| React com Vite e JavaScript                     | Next.js e TypeScript                                     | Atende à aplicação React com desenvolvimento e build simples, mantendo explícitas as rotas e integrações. | Sem renderização no servidor e sem checagem estática de tipos.                                      |
| React Router                                    | TanStack Router e wouter                                 | Rotas individuais, layout compartilhado, página 404 e proteção do painel com os componentes existentes.   | Hospedagem precisa encaminhar links diretos para o HTML da SPA.                                     |
| CSS puro e componentes próprios                 | Tailwind e bibliotecas de UI                             | Controle sobre identidade visual e estilos com poucas dependências.                                       | Responsividade, estados e acessibilidade exigem implementação e revisão próprias.                   |
| `fetch` nos serviços                            | Axios                                                    | APIs nativas bastam para as requisições usadas, sem biblioteca adicional.                                 | Tratamento de status, validação da resposta e mensagens de erro são explícitos.                     |
| Cache de módulo do GitHub                       | TanStack Query e SWR                                     | Reutiliza a requisição em andamento e os dados durante a navegação na mesma aba.                          | Não oferece persistência entre abas nem revalidação automática; atualizar a página renova os dados. |
| `useState`, Context e hook de carregamento      | Zustand e Redux Toolkit                                  | Estado local e contexto de autenticação atendem ao escopo atual.                                          | Não oferece recursos avançados de inspeção e organização de grandes estados globais.                |
| Validação compartilhada em JavaScript           | React Hook Form com Zod                                  | As mesmas regras são usadas no cliente e no servidor, com erros específicos por campo.                    | É preciso manter manualmente regras, foco e associação das mensagens aos campos.                    |
| Supabase Auth, Postgres e RLS                   | Firebase e backend próprio                               | Sessão e dados persistentes com regras também no banco, sem criar um servidor de autenticação.            | Depende de serviço externo, configuração correta das políticas e disponibilidade da rede.           |
| Função de contato com Resend                    | Formspree e EmailJS                                      | Mantém a chave privada no servidor e permite salvar a mensagem antes de enviar a notificação.             | Requer configuração de remetente e destinatário; salvar no banco não garante entrega do e-mail.     |
| Imagens SVG e painel com `lazy`/`Suspense`      | Imagens raster e pacote administrativo carregado na home | Ilustrações vetoriais leves, dimensões reservadas e código administrativo separado.                       | SVG atende às ilustrações atuais; fotos exigiriam avaliar formato, tamanho e compressão.            |
| Vitest e Testing Library                        | Playwright                                               | Testam validação, proteção de rota e comportamento dos componentes com integração ao Vite.                | Os mocks não comprovam funcionamento das contas reais nem layout no navegador.                      |
| ESLint, Prettier e Husky                        | Biome e verificações só no CI                            | Padronização automática local e bloqueio de commits com falhas de lint ou formatação.                     | O hook pode ser contornado; revisão e validação completa antes da integração continuam necessárias. |
| Branch por alteração e pull request para `main` | Git Flow e commits diretos na principal                  | Mantém mudanças pequenas e revisáveis, com deploy automático na integração.                               | Exige manter PRs e resolver conflitos; não define um processo completo de releases.                 |
| Vercel ligada ao GitHub                         | Hospedagem estática e backend separados                  | Hospeda a SPA e a função `/api/contact`, com atualização automática da principal.                         | Depende da plataforma e de variáveis de ambiente configuradas em produção.                          |

## Pastas e fluxo de dados

```text
Navegador
  ├─ React Router → pages → components
  ├─ services/github.js → API pública do GitHub → projetos
  ├─ services/featured.js → Supabase (leitura pública) → destaques
  ├─ services/supabase.js → Supabase Auth → portfolio_owners
  │    └─ services/dashboard.js → mensagens e destaques (RLS)
  └─ ContactForm → services/contact.js → /api/contact
       └─ server/contact.js
            ├─ validação compartilhada em src/utils/validation.js
            ├─ Supabase → salva a mensagem
            └─ Resend → tenta enviar a notificação
```

`hooks/` concentra contexto e carregamento reutilizável; `supabase/` mantém
o schema e o teste de acesso; `public/` guarda as ilustrações. Em desenvolvimento,
o Vite disponibiliza a rota de contato por `server/dev-contact.js`. Em produção,
a entrada é `api/contact.js`, executada pela Vercel.

## Da alteração ao site

```text
Pedido → branch feature/, fix/ ou docs/ → diff → validação
  → commit com pre-commit → push → pull request → merge em main
  → build e deploy da Vercel → conferência na URL pública
```

No hook são executados lint e checagem de formatação. O comando
`npm.cmd run check` também executa testes e build. Os dois não são equivalentes.
