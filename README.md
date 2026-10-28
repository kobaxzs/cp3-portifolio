# Portfólio — Lucas Kobayashi

Portfólio de Lucas Figueiredo Kobayashi para o CP3 da FIAP.
GitHub: [kobaxzs](https://github.com/kobaxzs).
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

O envio do formulário usa `/api/contact`, executado pela Vercel. O Vite sozinho
não executa essa função. Para testá-la localmente após conectar o projeto à Vercel,
use `npx.cmd vercel dev`.

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

### Supabase

1. Crie o projeto e execute `supabase/schema.sql` no SQL Editor.
2. Em Authentication, crie a conta do dono, desative o cadastro público e copie
   o UUID do usuário.
3. Autorize essa conta:

   ```sql
   insert into public.portfolio_owners (id) values ('UUID-REAL-DO-USUARIO');
   ```

4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. No servidor, preencha `SUPABASE_URL` e `SUPABASE_SECRET_KEY`.
6. Configure as URLs de Authentication para o endereço usado pelo site.

### Resend

Preencha `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` com um remetente autorizado e
`CONTACT_TO_EMAIL` com o destinatário. A resposta ao visitante é feita pelo seu
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
```

Componentes em PascalCase, hooks com prefixo `use`, funções e variáveis em
camelCase. Chamadas às APIs ficam nos serviços, separadas dos componentes visuais.

Use branches `feature/nome` ou `fix/nome` e commits com `feat:`, `fix:`, `docs:`,
`style:` ou `test:`. Integre em `main` por pull request, registrando o histórico
real. Após inicializar o Git, execute `npm.cmd run prepare`: o hook Husky confere
lint e formatação antes dos commits.

Supabase atende ao login e armazenamento; Resend permite enviar e-mail sem expor
a chave no navegador. O cache simples dispensa uma biblioteca adicional.
SVG é adequado às ilustrações vetoriais. Vitest e Testing Library atendem aos
testes exigidos, e ESLint, Prettier e Husky à padronização antes dos commits.

## Pendências para concluir e entregar

- [ ] Configurar Supabase, tabelas, conta do dono, URLs e variáveis de ambiente.
- [ ] Testar login, saída, redirecionamento de visitantes e bloqueio de contas
      sem autorização, inclusive nas permissões do banco.
- [ ] Conferir carregamento, erro e listas vazias do painel com o serviço real.
- [ ] Configurar Resend e fazer um envio real, confirmando recebimento do e-mail
      e a mesma mensagem no dashboard. Conferir spinner, bloqueio durante envio,
      sucesso, erro e aviso de mensagem salva com falha no e-mail.
- [ ] Marcar uma mensagem como respondida e conferir a persistência.
- [ ] Selecionar destaques e conferir a home em outra janela.
- [ ] Disponibilizar o Git, inicializar o repositório, ativar o hook e publicar
      no GitHub com commits e branches reais, sem `.env` nem arquivos gerados.
- [ ] Importar na Vercel: branch `main`, build `npm run build`, saída `dist` e
      variáveis de ambiente. Confirmar deploy automático após um push real.
- [ ] Na URL pública, conferir menu, cards, formulário e painel em celular e
      desktop, sem cortes ou rolagem horizontal.
- [ ] Abrir diretamente o link de um projeto e atualizar o navegador; conferir
      404, falhas da API e os dados dos repositórios.
- [ ] Medir Lighthouse mobile na URL pública: performance mínima de 80 e
      ausência de saltos de layout. Conferir imagens adiadas, painel sob demanda
      e consultas ao GitHub reutilizadas entre páginas.
- [ ] Preparar a documentação de instruções para IA exigida pelo enunciado;
      as orientações antigas foram removidas a pedido nesta limpeza.
- [ ] Preparar e gravar o vídeo de até oito minutos, com rosto e tela visíveis,
      explicando arquitetura, escolhas técnicas e uso real da IA. Publicar no
      YouTube como não listado.
- [ ] Entregar os links do GitHub, Vercel e vídeo no Teams, conforme o prazo de
      03/11 informado no enunciado recebido.
