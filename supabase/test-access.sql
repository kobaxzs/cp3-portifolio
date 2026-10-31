-- Execute TODO este arquivo em uma nova consulta no SQL Editor, como postgres.
-- Requer a conta do proprietário e uma segunda conta sem autorização.
-- Os dados de teste e todas as mudanças são desfeitos pelo ROLLBACK final.
begin;

do $$
declare
  id_dono uuid;
  id_visitante uuid;
  id_mensagem_teste uuid := gen_random_uuid();
begin
  select id into id_dono from public.portfolio_owners limit 1;
  select u.id into id_visitante
  from auth.users u
  where not exists (select 1 from public.portfolio_owners o where o.id = u.id)
  limit 1;

  if id_dono is null or id_visitante is null then
    raise exception 'Crie uma conta autorizada e outra sem autorização antes do teste.';
  end if;

  perform set_config('teste_portfolio.dono', id_dono::text, true);
  perform set_config('teste_portfolio.visitante', id_visitante::text, true);
  perform set_config('teste_portfolio.mensagem', id_mensagem_teste::text, true);
  perform set_config('teste_portfolio.repositorio', 'rls-test-' || gen_random_uuid()::text, true);
  perform set_config('request.jwt.claim.sub', id_visitante::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', id_visitante, 'role', 'authenticated')::text, true);

  insert into public.messages (id, name, email, subject, message)
  values (id_mensagem_teste, 'Teste RLS', 'teste@example.com', 'Teste temporário',
    'Mensagem temporária para verificar as permissões do banco.');
  insert into public.featured_projects (repo_name)
  values (current_setting('teste_portfolio.repositorio'));
end $$;

set local role authenticated;

do $$
begin
  if auth.uid() is distinct from current_setting('teste_portfolio.visitante')::uuid then
    raise exception 'A simulação da conta sem autorização falhou.';
  end if;
  if exists (select 1 from public.portfolio_owners)
     or exists (select 1 from public.messages) then
    raise exception 'FALHA: conta sem autorização conseguiu ler dados privados.';
  end if;

  update public.messages set responded = true
  where id = current_setting('teste_portfolio.mensagem')::uuid;
  if found then
    raise exception 'FALHA: conta sem autorização conseguiu alterar mensagens.';
  end if;

  delete from public.featured_projects
  where repo_name = current_setting('teste_portfolio.repositorio');
  if found then
    raise exception 'FALHA: conta sem autorização conseguiu remover destaques.';
  end if;

  begin
    insert into public.featured_projects (repo_name)
    values (current_setting('teste_portfolio.repositorio') || '-bloqueado');
    raise exception 'FALHA: conta sem autorização conseguiu adicionar destaques.';
  exception when insufficient_privilege then
    null; -- Bloqueio esperado pela RLS.
  end;

  begin
    insert into public.portfolio_owners (id) values (auth.uid());
    raise exception 'FALHA: conta sem autorização conseguiu se tornar proprietária.';
  exception when insufficient_privilege then
    null;
  end;
end $$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('teste_portfolio.dono'), true);
select set_config('request.jwt.claims', json_build_object(
  'sub', current_setting('teste_portfolio.dono'), 'role', 'authenticated')::text, true);
set local role authenticated;

do $$
begin
  if not exists (select 1 from public.portfolio_owners where id = auth.uid())
     or not exists (select 1 from public.messages
       where id = current_setting('teste_portfolio.mensagem')::uuid) then
    raise exception 'FALHA: proprietário não conseguiu ler os dados necessários.';
  end if;

  update public.messages set responded = true
  where id = current_setting('teste_portfolio.mensagem')::uuid;
  if not found then
    raise exception 'FALHA: proprietário não conseguiu marcar a mensagem como respondida.';
  end if;

  insert into public.featured_projects (repo_name)
  values (current_setting('teste_portfolio.repositorio') || '-dono');
  delete from public.featured_projects
  where repo_name = current_setting('teste_portfolio.repositorio') || '-dono';
  if not found then
    raise exception 'FALHA: proprietário não conseguiu remover seu destaque.';
  end if;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;

do $$
begin
  begin
    perform 1 from public.messages limit 1;
    raise exception 'FALHA: visitante anônimo conseguiu consultar mensagens.';
  exception when insufficient_privilege then
    null;
  end;
  begin
    perform 1 from public.portfolio_owners limit 1;
    raise exception 'FALHA: visitante anônimo conseguiu consultar proprietários.';
  exception when insufficient_privilege then
    null;
  end;
  if not exists (select 1 from public.featured_projects
    where repo_name = current_setting('teste_portfolio.repositorio')) then
    raise exception 'FALHA: visitante anônimo não conseguiu consultar os destaques públicos.';
  end if;
end $$;
  
reset role;
rollback;

select 'OK: permissões do proprietário, conta sem autorização e visitante verificadas. Dados de teste desfeitos.' as resultado;
