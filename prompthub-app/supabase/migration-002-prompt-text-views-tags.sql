-- ============================================
-- Migration 002: Add prompt_text, views_count, and tags system
-- ============================================

-- 1. Add prompt_text and views_count to prompts
alter table public.prompts add column prompt_text text;
alter table public.prompts add column views_count integer default 0 not null;

-- 2. Tags table
create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now() not null
);

-- 3. Prompt-tags junction table
create table public.prompt_tags (
  prompt_id uuid references public.prompts on delete cascade not null,
  tag_id uuid references public.tags on delete cascade not null,
  primary key (prompt_id, tag_id)
);

create index prompt_tags_prompt_idx on public.prompt_tags (prompt_id);
create index prompt_tags_tag_idx on public.prompt_tags (tag_id);

-- 4. RLS
alter table public.tags enable row level security;
alter table public.prompt_tags enable row level security;

create policy "Tags are publicly readable"
  on public.tags for select using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert with check (auth.role() = 'authenticated');

create policy "Prompt tags are publicly readable"
  on public.prompt_tags for select using (true);

create policy "Prompt authors can manage tags"
  on public.prompt_tags for insert
  with check (
    auth.uid() = (select user_id from public.prompts where id = prompt_id)
  );

create policy "Prompt authors can remove tags"
  on public.prompt_tags for delete
  using (
    auth.uid() = (select user_id from public.prompts where id = prompt_id)
  );

-- 5. Helper: increment views_count (callable from client)
create or replace function public.increment_views(p_prompt_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.prompts
  set views_count = views_count + 1
  where id = p_prompt_id;
end;
$$;

-- 6. Update FTS index to include prompt_text
-- Drop and recreate the generated column to include prompt_text
alter table public.prompts drop column fts;
alter table public.prompts add column fts tsvector generated always as (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(prompt_text, '')), 'C')
) stored;

create index prompts_fts_idx_v2 on public.prompts using gin (fts);

-- 7. Seed some common tags
insert into public.tags (name, slug) values
  ('gpt-4', 'gpt-4'),
  ('gpt-4o', 'gpt-4o'),
  ('claude', 'claude'),
  ('gemini', 'gemini'),
  ('midjourney', 'midjourney'),
  ('dall-e', 'dall-e'),
  ('stable-diffusion', 'stable-diffusion'),
  ('coding', 'coding'),
  ('writing', 'writing'),
  ('marketing', 'marketing'),
  ('seo', 'seo'),
  ('portrait', 'portrait'),
  ('landscape', 'landscape'),
  ('productivity', 'productivity'),
  ('education', 'education'),
  ('creative', 'creative'),
  ('business', 'business'),
  ('data-analysis', 'data-analysis'),
  ('summarization', 'summarization'),
  ('translation', 'translation');
