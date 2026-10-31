---
name: revisar-portfolio
description: Revisar a entrega do portfólio CP3, verificar mudanças e registrar evidências de testes antes de um PR ou deploy. Use para revisão de qualidade ou publicação deste repositório.
---

# Revisar a entrega do portfólio

Consulte o `AGENTS.md` e o README na raiz do repositório. Identifique o escopo
pelo pedido, por `git status` e pelo diff; preserve mudanças fora dele.

Escolha a evidência adequada para a mudança:

- Código da aplicação: `npm.cmd run check` verifica lint, formatação, testes
  e build. Corrija as falhas pertinentes antes de considerar a revisão aprovada.
- Somente documentação: use `npm.cmd run format:check` e confira links locais
  e coerência com o código. Não é necessário repetir os testes da aplicação.
- Permissões do banco: `supabase/test-access.sql` testa proprietário, outra
  conta e visitante com dados temporários e `ROLLBACK`. Registre o resultado
  efetivamente obtido no serviço; ler o SQL não equivale a executá-lo.
- Produção: `node scripts/check-published.mjs` faz consultas HTTP e validação
  da API sem enviar mensagens. Requer `.env` local e acesso à rede. Use a opção
  `--send-test` somente quando o pedido incluir um envio real; ela salva uma
  mensagem e solicita uma notificação por execução.

Ao revisar rotas, lembre que Vercel devolve o HTML da SPA inclusive em `/dashboard`
e em endereços inexistentes. Só marque login, redirecionamentos, 404 visual,
responsividade e interação como verificados depois de observação em navegador
ou confirmação manual identificada. O aceite do Resend não comprova chegada à
caixa de entrada. Testes com mocks não comprovam configuração das contas reais.

Antes de preparar o PR, confira o diff e os arquivos adicionados. O `.env` e
chaves reais não pertencem ao commit. Use a estratégia de branches e mensagens
do `AGENTS.md`; publicar depende do escopo autorizado pelo usuário.

Entregue um relato curto com problemas encontrados, verificações executadas e
limitações restantes. Atualize as pendências do README e, para evidências da
publicação, `docs/verificacao-publicacao.md` com a origem de cada confirmação.
