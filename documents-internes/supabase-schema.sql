-- DojoMath production storage schema for Supabase.
-- Run this in the Supabase SQL editor, then set SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY in the deployment environment.

create table if not exists public.dojomath_accounts (
  id text primary key,
  email text not null unique,
  session_token_hash text,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists dojomath_accounts_session_token_hash_idx
  on public.dojomath_accounts (session_token_hash);

create table if not exists public.dojomath_bookings (
  id text primary key,
  account_id text not null,
  date text not null,
  time text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  unique (date, time)
);

create index if not exists dojomath_bookings_account_id_idx
  on public.dojomath_bookings (account_id);

alter table public.dojomath_accounts enable row level security;
alter table public.dojomath_bookings enable row level security;
