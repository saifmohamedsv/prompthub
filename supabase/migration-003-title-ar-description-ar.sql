-- ============================================
-- Migration 003: Add title_ar & description_ar to prompts
-- ============================================

-- Enable trigram extension for ilike index support
create extension if not exists pg_trgm;

alter table public.prompts add column if not exists title_ar text;
alter table public.prompts add column if not exists description_ar text;

-- Rebuild FTS to include Arabic fields
alter table public.prompts drop column if exists fts;
alter table public.prompts add column fts tsvector generated always as (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(prompt_text, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(title_ar, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(description_ar, '')), 'B')
) stored;

-- Index for faster partial match (ilike) searches
create index if not exists prompts_title_trgm_idx on public.prompts using gin (title gin_trgm_ops);
create index if not exists prompts_title_ar_trgm_idx on public.prompts using gin (title_ar gin_trgm_ops);
create index if not exists prompts_description_trgm_idx on public.prompts using gin (description gin_trgm_ops);
