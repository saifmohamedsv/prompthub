import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { PromptWithAuthor, Profile } from "@/types/prompt";

/**
 * Anonymous-only Supabase client for OG image generation.
 * Plain `@supabase/supabase-js` — no cookies, no browser state, Node-safe.
 * All queries run with the anon key against public RLS policies.
 */
function ogClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

const PROMPT_SELECT = `
  *,
  profiles:user_id (username, full_name, avatar_url),
  categories:category_id (name, slug)
`;

export async function fetchPromptForOG(id: string): Promise<PromptWithAuthor | null> {
  const { data, error } = await ogClient()
    .from("prompts")
    .select(PROMPT_SELECT)
    .eq("id", id)
    .single();
  if (error) return null;
  return (data ?? null) as unknown as PromptWithAuthor | null;
}

export async function fetchProfileForOG(id: string): Promise<Profile | null> {
  const { data, error } = await ogClient()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return (data ?? null) as unknown as Profile | null;
}

export async function fetchUserPromptStatsForOG(
  userId: string
): Promise<{ count: number; totalLikes: number; totalViews: number }> {
  const { data, error } = await ogClient()
    .from("prompts")
    .select("likes_count, views_count")
    .eq("user_id", userId);
  if (error || !data) return { count: 0, totalLikes: 0, totalViews: 0 };
  const rows = data as unknown as { likes_count: number; views_count: number }[];
  return {
    count: rows.length,
    totalLikes: rows.reduce((s, r) => s + r.likes_count, 0),
    totalViews: rows.reduce((s, r) => s + r.views_count, 0),
  };
}
