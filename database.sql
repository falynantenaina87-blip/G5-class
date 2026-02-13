-- A EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Nettoyage (Attention : supprime tout si exécuté sur une base existante)
-- drop table if exists announcements;
-- drop table if exists flashcards;
-- drop table if exists schedule;
-- drop table if exists homework;
-- drop table if exists profiles;

-- 2. Création des Tables

create table profiles (
  id uuid references auth.users not null primary key,
  username text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text,
  tag text not null,
  date text not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table flashcards (
  id uuid default gen_random_uuid() primary key,
  character text not null,
  pinyin text not null,
  translation text not null,
  example text not null,
  example_translation text not null,
  date_added text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table schedule (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  room text not null,
  start_time text not null,
  end_time text not null,
  day text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table homework (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  due_date text not null,
  is_global boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Sécurité (RLS) - Permet la lecture publique
alter table announcements enable row level security;
create policy "Public announcements" on announcements for select using (true);

alter table flashcards enable row level security;
create policy "Public flashcards" on flashcards for select using (true);

alter table schedule enable row level security;
create policy "Public schedule" on schedule for select using (true);

alter table homework enable row level security;
create policy "Public homework" on homework for select using (true);

alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);

-- 4. INSTRUCTIONS POUR LES ADMINS
-- Dans cette architecture, les tables `auth.users` et `public.profiles` sont liées.
-- On ne peut pas insérer un Admin manuellement ici sans qu'il ait créé un compte (Signup) au préalable.

-- ÉTAPE 1 : Ouvrez l'application et inscrivez-vous avec les pseudos suivants :
-- 'juliano', 'delegate1' ou 'delegate2'.

-- ÉTAPE 2 (CAS DE SECOURS) :
-- Si vous vous êtes inscrit avec le mauvais pseudo (ex: 'juliano_test'),
-- exécutez la commande suivante pour forcer vos droits Admin :

-- UPDATE profiles SET username = 'juliano' WHERE id = 'VOTRE_UUID_UTILISATEUR';
-- (Vous pouvez trouver votre UUID dans l'onglet Authentication > Users de Supabase)