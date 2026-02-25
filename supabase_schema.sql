-- # ContentFlow: Esquema de Banco de Dados SaaS (Supabase)
-- Este SQL cria as tabelas necessárias para suportar múltiplos usuários, 
-- assinaturas e integração futura com a API do Instagram.

-- 1. EXTENSÕES
create extension if not exists "uuid-ossp";

-- 2. TABELA DE PERFIS (Extensão do auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  plan_type text default 'free' check (plan_type in ('free', 'pro', 'agency')),
  subscription_status text default 'inactive',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABELA DE CONTAS DO INSTAGRAM (OAuth Tokens)
create table public.instagram_accounts (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  ig_business_id text unique, -- ID oficial do Instagram Business
  username text,
  account_name text,
  access_token text, -- Token de acesso (criptografar em produção)
  token_expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABELA DE POSTS (O Coração do Aplicativo)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  ig_account_id uuid references public.instagram_accounts(id) on delete set null,
  title text not null,
  caption text,
  thumbnail_url text,
  post_date timestamp with time zone not null,
  category text check (category in ('Educational', 'Promotional', 'Engagement', 'Institutional', 'BTS')),
  format text check (format in ('Feed', 'Reels', 'Stories', 'Carousel')),
  status text default 'Idea' check (status in ('Idea', 'Script', 'Production', 'Scheduled', 'Published')),
  metrics_likes int default 0,
  metrics_comments int default 0,
  metrics_shares int default 0,
  metrics_saves int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABELA DE DATAS COMEMORATIVAS (Sistema/Global)
create table public.commemorative_dates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  relevance text check (relevance in ('Low', 'Medium', 'High')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SEGURANÇA (RLS - Row Level Security)

-- Ativar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.instagram_accounts enable row level security;
alter table public.posts enable row level security;
alter table public.commemorative_dates enable row level security; -- Read-only para usuários

-- Políticas para PROFILES
create policy "Usuários podem ver o próprio perfil" on public.profiles
  for select using (auth.uid() = id);
create policy "Usuários podem atualizar o próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Políticas para INSTAGRAM_ACCOUNTS
create policy "Usuários podem ver suas próprias contas IG" on public.instagram_accounts
  for select using (auth.uid() = profile_id);
create policy "Usuários podem gerenciar suas contas IG" on public.instagram_accounts
  for all using (auth.uid() = profile_id);

-- Políticas para POSTS
create policy "Usuários podem ver seus próprios posts" on public.posts
  for select using (auth.uid() = profile_id);
create policy "Usuários podem gerenciar seus próprios posts" on public.posts
  for all using (auth.uid() = profile_id);

-- Políticas para DATAS COMEMORATIVAS
create policy "Qualquer usuário autenticado pode ler datas" on public.commemorative_dates
  for select using (auth.role() = 'authenticated');

-- 7. FUNÇÕES E TRIGGERS (Auto-update do profile ao criar user)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
