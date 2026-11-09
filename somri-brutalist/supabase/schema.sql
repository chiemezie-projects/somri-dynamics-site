-- Somri Dynamics — Supabase schema
-- Run in the Supabase SQL editor once, then add your project keys to .env:
--   VITE_SUPABASE_URL=...
--   VITE_SUPABASE_ANON_KEY=...

-- ---------- tables ----------

-- site copy CMS (single row, key 'site')
create table if not exists site_copy (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- listings CRM
create table if not exists listings (
  id text primary key,
  title text not null,
  category text not null check (category in ('foodstuff','devices','accessories','autos','real-estate')),
  price text not null default '',
  currency text not null default '₦',
  description text not null default '',
  image text not null default '',
  location text not null default '',
  status text not null default 'available' check (status in ('available','reserved','sold')),
  featured boolean not null default false,
  whatsapp text not null default '2348036150593',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user profiles with roles (created alongside auth.users via triggers)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'editor' check (role in ('owner','admin','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''), 'editor');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- row level security ----------
-- Policies use security-definer helpers so the profiles policy never
-- queries profiles itself (avoids infinite recursion).

alter table site_copy enable row level security;
alter table listings  enable row level security;
alter table profiles  enable row level security;

create or replace function public.is_staff() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid());
$$;

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('owner','admin'));
$$;

-- profiles: staff see each other; owner/admin manage
create policy "profiles can see staff" on profiles
  for select using (id = auth.uid() or public.is_staff());

create policy "admins manage staff" on profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- public read of listings + copy; staff write
create policy "listings public read" on listings
  for select using (true);
create policy "listings staff write" on listings
  for all using (public.is_staff()) with check (public.is_staff());

create policy "copy public read" on site_copy
  for select using (true);
create policy "copy admin write" on site_copy
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- seed ----------
insert into site_copy (id, data) values ('site', '{}')
  on conflict (id) do nothing;
