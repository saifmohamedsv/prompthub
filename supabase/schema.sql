-- ============================================
-- PromptHub Database Schema
-- ============================================

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'user_name',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  name_ar text not null,
  slug text unique not null,
  created_at timestamptz default now() not null
);

-- Prompts
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  link text,
  image_url text,
  likes_count integer default 0 not null,
  category_id uuid references public.categories on delete set null,
  user_id uuid references public.profiles on delete cascade not null,
  fts tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index prompts_fts_idx on public.prompts using gin (fts);
create index prompts_category_idx on public.prompts (category_id);
create index prompts_user_idx on public.prompts (user_id);

-- Likes (junction table)
create table public.likes (
  user_id uuid references public.profiles on delete cascade not null,
  prompt_id uuid references public.prompts on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, prompt_id)
);

-- Auto-update likes_count
create or replace function public.update_likes_count()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if (tg_op = 'INSERT') then
    update public.prompts set likes_count = likes_count + 1 where id = new.prompt_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.prompts set likes_count = likes_count - 1 where id = old.prompt_id;
    return old;
  end if;
end;
$$;

create trigger on_like_change
  after insert or delete on public.likes
  for each row execute procedure public.update_likes_count();

-- ============================================
-- Row Level Security
-- ============================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.prompts enable row level security;
alter table public.likes enable row level security;

-- Profiles: public read, users can update own
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Categories: public read
create policy "Categories are publicly readable"
  on public.categories for select using (true);

-- Prompts: public read, authors CRUD own
create policy "Prompts are publicly readable"
  on public.prompts for select using (true);

create policy "Authenticated users can create prompts"
  on public.prompts for insert with check (auth.uid() = user_id);

create policy "Authors can update own prompts"
  on public.prompts for update using (auth.uid() = user_id);

create policy "Authors can delete own prompts"
  on public.prompts for delete using (auth.uid() = user_id);

-- Likes: authenticated insert/delete own
create policy "Likes are publicly readable"
  on public.likes for select using (true);

create policy "Authenticated users can like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- ============================================
-- Storage
-- ============================================

insert into storage.buckets (id, name, public) values ('prompt-images', 'prompt-images', true);

create policy "Public read access on prompt-images"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

create policy "Authenticated users can upload prompt images"
  on storage.objects for insert
  with check (bucket_id = 'prompt-images' and auth.role() = 'authenticated');

create policy "Users can delete own prompt images"
  on storage.objects for delete
  using (bucket_id = 'prompt-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- Seed categories
-- ============================================

insert into public.categories (name, name_ar, slug) values
  ('Writing', 'الكتابة', 'writing'),
  ('Coding', 'البرمجة', 'coding'),
  ('Marketing', 'التسويق', 'marketing'),
  ('Education', 'التعليم', 'education'),
  ('Business', 'الأعمال', 'business'),
  ('Creative', 'الإبداع', 'creative'),
  ('Productivity', 'الإنتاجية', 'productivity'),
  ('Other', 'أخرى', 'other');
