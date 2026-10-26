create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language text default 'EN' not null,
  preference text default 'best_quality' not null,
  do_not_store_question boolean default false not null,
  confidence_threshold numeric default 0.75 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_settings unique (user_id)
);

alter table public.settings enable row level security;

create policy "Users can read own settings"
  on public.settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.settings for update
  using (auth.uid() = user_id);

create table public.requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  difficulty integer not null,
  risk text not null,
  chosen_model text not null,
  confidence numeric not null,
  reason text,
  cheaper_alternative text,
  stronger_alternative text,
  question_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.requests enable row level security;

create policy "Users can read own requests"
  on public.requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own requests"
  on public.requests for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own requests"
  on public.requests for delete
  using (auth.uid() = user_id);

create table public.routing_rules (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  difficulty_min integer not null,
  difficulty_max integer not null,
  model text not null,
  cheaper_alternative text,
  stronger_alternative text,
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.routing_rules enable row level security;

create policy "Routing rules are read-only for all authenticated users"
  on public.routing_rules for select
  to authenticated
  using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);

  insert into public.settings (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
