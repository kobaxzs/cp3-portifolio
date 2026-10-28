-- Execute no SQL Editor do seu projeto Supabase.
-- Depois crie o usuário no painel Authentication e cadastre o UUID em portfolio_owners.
begin;

create table if not exists public.portfolio_owners (
  id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (char_length(subject) between 1 and 120),
  message text not null check (char_length(message) between 20 and 5000),
  responded boolean not null default false,
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.featured_projects (
  repo_name text primary key check (char_length(repo_name) between 1 and 100),
  created_at timestamptz not null default now()
);

alter table public.portfolio_owners enable row level security;
alter table public.messages enable row level security;
alter table public.featured_projects enable row level security;

revoke all on public.portfolio_owners, public.messages, public.featured_projects from anon, authenticated;
grant select on public.portfolio_owners to authenticated;
grant select on public.messages to authenticated;
grant update (responded) on public.messages to authenticated;
grant select on public.featured_projects to anon, authenticated;
grant insert, delete on public.featured_projects to authenticated;
grant all on public.messages to service_role;

drop policy if exists owner_self on public.portfolio_owners;
create policy owner_self on public.portfolio_owners for select to authenticated using (id = (select auth.uid()));
drop policy if exists owner_messages_read on public.messages;
create policy owner_messages_read on public.messages for select to authenticated using (exists (select 1 from public.portfolio_owners where id = (select auth.uid())));
drop policy if exists owner_messages_update on public.messages;
create policy owner_messages_update on public.messages for update to authenticated using (exists (select 1 from public.portfolio_owners where id = (select auth.uid()))) with check (exists (select 1 from public.portfolio_owners where id = (select auth.uid())));
drop policy if exists public_featured on public.featured_projects;
create policy public_featured on public.featured_projects for select to anon, authenticated using (true);
drop policy if exists owner_featured_insert on public.featured_projects;
create policy owner_featured_insert on public.featured_projects for insert to authenticated with check (exists (select 1 from public.portfolio_owners where id = (select auth.uid())));
drop policy if exists owner_featured_delete on public.featured_projects;
create policy owner_featured_delete on public.featured_projects for delete to authenticated using (exists (select 1 from public.portfolio_owners where id = (select auth.uid())));

commit;

-- Após criar seu usuário, copie o ID (UUID) do painel Authentication > Users:
-- insert into public.portfolio_owners (id) values ('COLE-O-UUID-REAL-AQUI');
