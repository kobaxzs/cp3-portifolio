# Portfólio — Lucas Kobayashi

Portfólio de Lucas Figueiredo Kobayashi, estudante de Engenharia de Software na
FIAP, desenvolvido para o CP3 de Stack e Harness Engineering.

- [Site publicado](https://cp3-portifolio.vercel.app)
- [Repositório no GitHub](https://github.com/kobaxzs/cp3-portifolio)

## Funcionalidades

- Projetos obtidos pela API do GitHub, com cards e páginas individuais.
- Navegação com página 404 e estados de carregamento, erro e lista vazia.
- Formulário com validação por campo, armazenamento da mensagem e notificação por e-mail.
- Painel protegido para consultar mensagens, marcar respostas e selecionar destaques.
- Tema claro e escuro persistente e layout responsivo.
- Imagens SVG com carregamento adiado, painel sob demanda e cache das consultas ao GitHub.

## Tecnologias

React, React Router, Vite, JavaScript e CSS puro. Supabase fornece autenticação
e banco PostgreSQL com políticas RLS. Resend envia as notificações por e-mail.
O deploy é feito na Vercel. A validação usa Vitest, Testing Library, ESLint,
Prettier e Husky.

## Instalação e execução

Requer Node.js 22.12 ou superior. Na pasta do projeto:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra o endereço informado no terminal. As páginas públicas e os projetos do
GitHub funcionam sem Supabase e Resend. O formulário e o painel dependem da
configuração abaixo.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores. Reinicie o servidor
local após alterar o arquivo.

| Variável                      | Finalidade                                            |
| ----------------------------- | ----------------------------------------------------- |
| `VITE_USUARIO_GITHUB`         | Usuário de quem serão consultados os repositórios.    |
| `VITE_EMAIL_CONTATO`          | E-mail público exibido no site.                       |
| `VITE_URL_LINKEDIN`           | Link opcional do perfil no LinkedIn.                  |
| `VITE_URL_SUPABASE`           | URL pública do projeto Supabase.                      |
| `VITE_CHAVE_PUBLICA_SUPABASE` | Chave pública do Supabase.                            |
| `URL_SUPABASE`                | URL do Supabase usada pelo servidor.                  |
| `CHAVE_SECRETA_SUPABASE`      | Chave privada do Supabase, usada somente no servidor. |
| `CHAVE_API_RESEND`            | Chave privada de envio do Resend.                     |
| `EMAIL_REMETENTE_CONTATO`     | Remetente autorizado no Resend.                       |
| `EMAIL_DESTINATARIO_CONTATO`  | E-mail que recebe as notificações.                    |

Variáveis `VITE_` são públicas. As chaves privadas ficam somente no servidor.
O `.env` é ignorado pelo Git. `src/utils/ambiente.js` também aceita os nomes
anteriores em inglês; valores preenchidos com nomes em português têm preferência.

### Supabase

1. Execute [supabase/schema.sql](supabase/schema.sql) no SQL Editor do projeto.
2. Crie a conta do proprietário em Authentication, desative o cadastro público
   e configure as URLs de autenticação para os endereços local e publicado.
3. Copie o UUID da conta e autorize o acesso:

   ```sql
   insert into public.portfolio_owners (id)
   values ('UUID-REAL-DO-USUARIO');
   ```

As políticas RLS restringem mensagens e alterações à conta autorizada. Os
destaques selecionados podem ser consultados publicamente.

### Resend e contato

Configure a chave de API, o remetente autorizado e o destinatário. A rota
`/api/contact` salva a mensagem antes de solicitar o envio do e-mail. Se o envio
falhar, informa que a mensagem ficou salva. A resposta ao visitante é feita pelo
aplicativo de e-mail, e a marcação como respondida no painel é manual.

Em desenvolvimento, `npm.cmd run dev` disponibiliza essa rota pelo servidor
do Vite. Em produção, ela é executada pela Vercel. `npm.cmd run preview` serve
somente o build estático e não executa a API.

## Testes e build

```powershell
npm.cmd test              # testes automatizados
npm.cmd run check         # lint, formatação, testes e build
npm.cmd run format        # aplica a formatação
npm.cmd run build         # gera os arquivos em dist
npm.cmd run preview       # visualiza o build estático
```

Os testes cobrem validação do formulário, proteção do painel, estados de dados,
rotas e integrações simuladas. O acesso ao banco pode ser verificado com
[supabase/test-access.sql](supabase/test-access.sql), que desfaz os dados de teste
ao final com `ROLLBACK`.

## Organização e padrões

```text
src/components/   componentes reutilizáveis e proteção de rota
src/pages/        páginas públicas e painel
src/services/     integrações com APIs
src/hooks/        autenticação e carregamento de dados
src/utils/        validação e configuração compartilhadas
src/test/         configuração dos testes
api/              entrada da função de contato na Vercel
server/           lógica de contato e adaptador local
supabase/         schema e teste de permissões
public/           imagens e arquivos estáticos
docs/             decisões técnicas e documentação da IA
.agents/skills/   skill de revisão do projeto
```

Componentes usam PascalCase; hooks têm prefixo `use`; funções e variáveis usam
camelCase. Os identificadores próprios são escritos em português, sem acentos.
Nomes exigidos pelas bibliotecas, APIs, HTML e banco mantêm seus contratos.
Chamadas às APIs ficam nos serviços, separadas da apresentação.

Use branches `feature/nome`, `fix/nome` ou `docs/nome`, com integração em `main`
por pull request. Os commits usam `feat:`, `fix:`, `docs:`, `style:` ou `test:`,
seguidos de uma descrição da alteração. O hook `.husky/pre-commit` verifica lint
e formatação; `npm.cmd run prepare` configura o Husky no repositório local.

## Publicação

Importe o repositório na Vercel com a branch de produção `main`, preset Vite,
build `npm run build` e diretório de saída `dist`. Cadastre as variáveis do
`.env` nas configurações do projeto. O arquivo `vercel.json` define o build e
o encaminhamento das rotas da aplicação. Integrações na branch principal
iniciam um novo deploy automaticamente.

## Documentação da IA e decisões técnicas

- [AGENTS.md](AGENTS.md): instruções de apoio técnico e padrões do projeto.
- [Skill de revisão](.agents/skills/revisar-portfolio/SKILL.md): procedimento de validação.
- [Harness e uso da IA](docs/harness-ia.md): ferramentas utilizadas e limites das verificações.
- [Decisões técnicas](docs/decisoes-tecnicas.md): alternativas, critérios e fluxo de dados.
