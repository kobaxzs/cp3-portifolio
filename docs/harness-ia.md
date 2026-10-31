# Harness e uso da IA

Este documento registra como a IA foi conduzida no portfólio CP3. A referência
de requisitos é o resumo do enunciado fornecido pelo aluno nesta conversa;
o [enunciado oficial](https://cherry-client-b8f.notion.site/CP3-Portfolio-Stack-e-Harness-Engeneering-3fe911d84e0d80f7bb6dec712e6d904a?pvs=74)
prevalece. O Notion não pôde ser consultado automaticamente nesta etapa.

## Ferramenta e identificação do modelo

A ferramenta de trabalho nesta etapa foi o Codex com contexto do VS Code e
acesso ao repositório local. Esse acesso permite ler arquivos, propor e aplicar
diffs e executar os comandos de validação do projeto. Um chat sem acesso ao
repositório exigiria copiar o contexto e aplicar as mudanças manualmente.

O modelo informado pelo aluno para o **ChatGPT no plano gratuito é GPT-5.6 Luna**.
O critério informado foi utilizar a opção disponível sem assinatura paga.
Essa identificação foi fornecida pelo aluno e não representa uma comparação
formal de desempenho ou custo entre modelos.

As alterações no repositório nesta etapa foram feitas pelo Codex. O nome do
modelo informado para o ChatGPT não identifica automaticamente o modelo
selecionado nas sessões do Codex, que ainda precisa ser conferido para a
apresentação.

## Configuração mantida no repositório

| Camada                  | Arquivo                                                                           | Função                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Instruções do projeto   | [AGENTS.md](../AGENTS.md)                                                         | Define responsabilidades, nomenclatura, comportamento das integrações, branches e evidências de teste. |
| Skill de revisão        | [revisar-portfolio/SKILL.md](../.agents/skills/revisar-portfolio/SKILL.md)        | Organiza a revisão da entrega e diferencia verificações locais, de produção e manuais.                 |
| Padrão de código        | [eslint.config.js](../eslint.config.js) e [.prettierrc.json](../.prettierrc.json) | Verificam problemas de código e aplicam formatação consistente.                                        |
| Antes do commit         | [.husky/pre-commit](../.husky/pre-commit)                                         | Executa lint e checagem de formatação.                                                                 |
| Validação completa      | [package.json](../package.json)                                                   | `npm.cmd run check` reúne lint, formatação, testes e build.                                            |
| Verificação de produção | [check-published.mjs](../scripts/check-published.mjs)                             | Consulta o site e a API; envio real é uma opção explícita.                                             |

`AGENTS.md` e a skill foram criados nesta etapa de documentação. Eles orientam
o trabalho daqui em diante; não existiam para conduzir retroativamente todas
as mudanças anteriores. Esses arquivos devem acompanhar a documentação da
entrega no GitHub.

A estrutura segue a [documentação oficial de personalização do Codex](https://learn.chatgpt.com/docs/customization/overview)
e a [documentação de skills](https://learn.chatgpt.com/docs/build-skills).
As instruções gerais ficam em `AGENTS.md`; o fluxo específico de revisão fica
em `.agents/skills/`. Essa separação mantém as regras de uso contínuo pequenas
e carrega o procedimento detalhado quando necessário.

A skill passou pelo validador estrutural do Skill Creator. Seu procedimento
foi lido e seguido na revisão desta documentação: checagem de formatação,
conferência dos links locais e separação dos arquivos do commit. Isso ainda
não comprova, por si só, a descoberta automática. Na sessão seguinte, a skill
`revisar-portfolio` apareceu no catálogo de skills disponível ao Codex,
confirmando seu reconhecimento pelo ambiente.

## Como usar e verificar a configuração

Abra o projeto no Codex e peça, por exemplo:

```text
Use $revisar-portfolio para revisar o diff atual antes do PR.
Registre quais verificações foram executadas e o que ainda falta conferir.
```

O nome da skill deve aparecer entre as skills disponíveis. Caso não apareça,
reinicie a sessão do Codex e confirme o diretório do projeto. Seu reconhecimento
no catálogo do Codex foi confirmado nesta conversa; para a apresentação, o
aluno deve conseguir localizá-la e explicar o fluxo. A validação estrutural
do arquivo é diferente da confirmação de descoberta pelo ambiente.

A documentação e as instruções foram publicadas no GitHub e integradas em
`main` pelo [PR #3](https://github.com/kobaxzs/cp3-portifolio/pull/3).

O fluxo esperado é: pedido concreto do aluno, leitura das instruções, alteração
na pasta responsável, revisão do diff, validação e commit em branch própria.
O pull request integra em `main` e a Vercel publica o resultado. O aluno revisa
o comportamento no site e precisa conseguir explicar o código entregue.

## Skills, ferramentas, MCPs e agentes usados

| Recurso          | Uso observado                                                         | Limite                                                                                                           |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Terminal e Git   | Leitura do código, npm, testes, build, commits e envio das branches.  | Dependem das permissões locais e de rede; resultados são verificados antes de registrar conclusão.               |
| Pesquisa web     | Consulta a documentação oficial das ferramentas utilizadas.           | Não configura nem autentica as contas dos serviços.                                                              |
| Computer Use     | Tentativa de inspecionar o portfólio no navegador.                    | A automação não concluiu a inspeção: houve indisponibilidade do navegador e interrupção por não confirmar a URL. |
| OpenAI Docs      | Consulta da documentação oficial para esta configuração do Codex.     | Skill disponível no ambiente da sessão, não uma dependência da aplicação React.                                  |
| Skill Creator    | Apoio na criação e validação da skill de revisão deste repositório.   | A skill local de revisão foi criada agora; não foi usada nas etapas anteriores.                                  |
| Agente principal | Um assistente conduziu as mudanças e retornou os resultados ao aluno. | Não houve delegação a subagentes nesta etapa; `AGENTS.md` é um arquivo de instruções, não uma equipe de agentes. |

O projeto não configura servidores MCP próprios nem depende de conectores MCP
de GitHub, Supabase, Resend ou Vercel. As ferramentas de controle do computador
e de execução JavaScript foram disponibilizadas pelo ambiente da conversa;
não foram instaladas ou configuradas pelo aluno neste repositório.

Supabase, GitHub e Resend são integrações HTTP da aplicação. Git é usado no
terminal para versionamento; Vercel está conectada ao GitHub para publicação.
Isso é diferente de configurar um conector MCP. O trabalho foi organizado em
um agente principal e uma skill específica de revisão, sem acrescentar uma
orquestração de agentes para este projeto individual.

Na configuração atual, Git pelo terminal e consultas HTTP atendem ao trabalho
com o repositório e a publicação sem manter um servidor MCP adicional.
A limitação é não oferecer, por essa configuração, ações integradas de um
conector de GitHub ou de administração do banco. Um único agente mantém o
contexto da implementação e da revisão, mas não oferece a execução paralela
de revisores independentes. Essas são justificativas do conjunto atual,
não evidências de uma comparação experimental entre ferramentas.

## Padrões que orientam a IA

- Páginas em `pages`, componentes em `components`, integrações em `services`,
  hooks em `hooks` e validação em `utils`, com lógica de contato no servidor.
- Componentes em PascalCase, hooks com prefixo `use` e funções em camelCase.
- Branches `feature/nome`, `fix/nome` e `docs/nome`; commits com prefixos
  `feat:`, `fix:`, `docs:`, `style:` e `test:`; integração por pull request.
- Credenciais reais fora do Git. Chaves privadas ficam no servidor; a chave
  pública do Supabase funciona com os privilégios e as políticas RLS.
- Evidência identificada: teste simulado, resposta HTTP, teste de banco,
  confirmação manual e medição Lighthouse são registros distintos.

As instruções reduzem ambiguidades, mas não garantem acerto. ESLint, Prettier,
Husky e os testes fornecem verificações executáveis; revisão humana e testes
com os serviços reais continuam necessários.

## Exemplos reais de condução e revisão

| Situação                        | Atuação da IA                                                                                                   | Verificação ou correção                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Painel sem acesso ao banco      | Orientou configuração de tabelas, conta e autorização.                                                          | O aluno executou SQL, acessou o painel e testou conta sem permissão.                           |
| UUID copiado incorretamente     | Uma transcrição da IA gerou um UUID inválido.                                                                   | O erro do SQL foi analisado e o cadastro passou a localizar a conta pelo e-mail.               |
| Contato indisponível no Vite    | Implementou um adaptador local para reutilizar `server/contact.js`.                                             | Testes e build passaram; o aluno confirmou recebimento e persistência.                         |
| Asteriscos estranhos no celular | Substituiu caracteres decorativos por SVG em habilidades, diário e contato.                                     | O aluno observou o problema e confirmou a correção publicada após o PR.                        |
| Publicação                      | Consultou páginas, arquivos, validação da API e permissões públicas; enviou uma mensagem de teste identificada. | Salvamento e aceite do Resend foram confirmados; inspeção visual foi registrada separadamente. |

O [relatório da publicação](verificacao-publicacao.md) contém os resultados
e seus limites. O aluno também apresentou um relatório Lighthouse mobile com
notas 100 nas quatro categorias e CLS 0. A IA ajudou a implementar, testar e
documentar; a apresentação deve reconhecer essa participação e demonstrar
entendimento das decisões, inclusive do que precisou ser corrigido.
