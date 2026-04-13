import { createClient } from "@/lib/supabase/client";
import type { PromptWithAuthor, Category, Tag, Profile } from "@/types/prompt";

const PROMPT_SELECT = `
  *,
  profiles:user_id (username, full_name, avatar_url),
  categories:category_id (name, slug),
  prompt_tags (tags (id, name, slug))
`;

export type SortOption = "recent" | "most_viewed" | "most_liked" | "hot";

export type PromptFilters = {
  search?: string;
  category?: string;
  tag?: string;
  sort?: SortOption;
  type?: string;
  limit?: number;
  page?: number;
};

// Helper to get an untyped client for complex queries
function supabase() {
  return createClient() as ReturnType<typeof createClient>;
}

export async function fetchPrompts(
  filters?: PromptFilters
): Promise<PromptWithAuthor[]> {
  const client = supabase();

  // If filtering by category, resolve slug → id first
  let categoryId: string | undefined;
  if (filters?.category && filters.category !== "all") {
    const { data } = await client
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .limit(1);

    categoryId = (data as unknown as { id: string }[])?.[0]?.id;
    if (!categoryId) return [];
  }

  const sort = filters?.sort ?? "recent";

  let query = client
    .from("prompts")
    .select(PROMPT_SELECT, { count: "exact" });

  if (sort === "hot") {
    // Hot: recent prompts first, weighted by likes — differs from most_liked
    query = query
      .order("created_at", { ascending: false })
      .order("likes_count", { ascending: false })
      .order("id", { ascending: false });
  } else if (sort === "most_viewed") {
    query = query
      .order("views_count", { ascending: false })
      .order("id", { ascending: false });
  } else if (sort === "most_liked") {
    query = query
      .order("likes_count", { ascending: false })
      .order("id", { ascending: false });
  } else {
    query = query
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // If filtering by tag, resolve slug → tag ID → prompt IDs
  if (filters?.tag) {
    const { data: tagRow } = await client
      .from("tags")
      .select("id")
      .eq("slug", filters.tag)
      .limit(1);

    const tagId = (tagRow as unknown as { id: string }[])?.[0]?.id;
    if (!tagId) return Object.assign([] as unknown as PromptWithAuthor[], { totalCount: 0 });

    const { data: ptRows } = await client
      .from("prompt_tags")
      .select("prompt_id")
      .eq("tag_id", tagId);

    const promptIds = (ptRows as unknown as { prompt_id: string }[])?.map((r) => r.prompt_id) ?? [];
    if (!promptIds.length) return Object.assign([] as unknown as PromptWithAuthor[], { totalCount: 0 });

    query = query.in("id", promptIds);
  }

  // Type filter
  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  // Flexible partial-match search
  if (filters?.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `title.ilike.${term},description.ilike.${term},prompt_text.ilike.${term}`
    );
  }

  // Pagination
  if (filters?.limit) {
    const page = filters.page ?? 0;
    const from = page * filters.limit;
    const to = from + filters.limit - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return Object.assign((data ?? []) as unknown as PromptWithAuthor[], {
    totalCount: count ?? 0,
  });
}

export async function fetchTrendingPrompts(limit = 6): Promise<PromptWithAuthor[]> {
  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .order("likes_count", { ascending: false })
    .order("views_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as PromptWithAuthor[];
}

export async function fetchPromptOfTheDay(): Promise<PromptWithAuthor | null> {
  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .order("likes_count", { ascending: false })
    .limit(20);

  if (error) throw error;
  const prompts = (data ?? []) as unknown as PromptWithAuthor[];
  if (!prompts.length) return null;
  const idx = new Date().getDate() % prompts.length;
  return prompts[idx];
}

export async function fetchFeaturedPrompts(limit = 3): Promise<PromptWithAuthor[]> {
  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .order("likes_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as PromptWithAuthor[];
}

export async function fetchPromptById(
  id: string
): Promise<PromptWithAuthor | null> {
  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return (data ?? null) as unknown as PromptWithAuthor | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase()
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as unknown as Category[];
}

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase()
    .from("tags")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as unknown as Tag[];
}

export type LeaderboardEntry = {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  prompt_count: number;
  total_likes: number;
  total_views: number;
};

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase()
    .from("prompts")
    .select("user_id, likes_count, views_count, profiles:user_id (username, full_name, avatar_url)");

  if (error) throw error;

  const userMap = new Map<string, LeaderboardEntry>();
  for (const row of (data as unknown as { user_id: string; likes_count: number; views_count: number; profiles: { username: string | null; full_name: string | null; avatar_url: string | null } | null }[])) {
    const existing = userMap.get(row.user_id);
    if (existing) {
      existing.prompt_count++;
      existing.total_likes += row.likes_count;
      existing.total_views += row.views_count;
    } else {
      userMap.set(row.user_id, {
        user_id: row.user_id,
        username: row.profiles?.username ?? null,
        full_name: row.profiles?.full_name ?? null,
        avatar_url: row.profiles?.avatar_url ?? null,
        prompt_count: 1,
        total_likes: row.likes_count,
        total_views: row.views_count,
      });
    }
  }

  return Array.from(userMap.values())
    .sort((a, b) => b.total_likes - a.total_likes)
    .slice(0, limit);
}

export async function fetchProfileById(
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return (data ?? null) as unknown as Profile | null;
}

export async function fetchUserPrompts(
  userId: string
): Promise<PromptWithAuthor[]> {
  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false }).order("id", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PromptWithAuthor[];
}

export async function fetchLikedPrompts(
  userId: string
): Promise<PromptWithAuthor[]> {
  // Get liked prompt IDs
  const { data: likes, error: likesError } = await supabase()
    .from("likes")
    .select("prompt_id")
    .eq("user_id", userId);

  if (likesError) throw likesError;

  const ids = (likes as unknown as { prompt_id: string }[])?.map(
    (l) => l.prompt_id
  );
  if (!ids?.length) return [];

  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .in("id", ids)
    .order("created_at", { ascending: false }).order("id", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PromptWithAuthor[];
}

export async function fetchUserLikes(userId: string): Promise<string[]> {
  const { data, error } = await supabase()
    .from("likes")
    .select("prompt_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (
    (data as unknown as { prompt_id: string }[])?.map((l) => l.prompt_id) ?? []
  );
}

export async function createPrompt(data: {
  title: string;
  description: string;
  prompt_text?: string | null;
  link?: string | null;
  image_url?: string | null;
  category_id: string;
  user_id: string;
  best_with_models?: string[] | null;
}) {
  const { data: prompt, error } = await supabase()
    .from("prompts")
    .insert(data as never)
    .select(PROMPT_SELECT)
    .single();

  if (error) throw error;
  return prompt as unknown as PromptWithAuthor;
}

export async function updatePrompt(
  id: string,
  data: {
    title?: string;
    description?: string;
    prompt_text?: string | null;
    link?: string | null;
    image_url?: string | null;
    category_id?: string;
    best_with_models?: string[] | null;
  }
) {
  const { data: prompt, error } = await supabase()
    .from("prompts")
    .update(data as never)
    .eq("id", id)
    .select(PROMPT_SELECT)
    .single();

  if (error) throw error;
  return prompt as unknown as PromptWithAuthor;
}

export async function deletePrompt(id: string) {
  const { error } = await supabase().from("prompts").delete().eq("id", id);
  if (error) throw error;
}

export async function setPromptTags(promptId: string, tagIds: string[]) {
  const client = supabase();

  // Remove existing tags
  const { error: deleteError } = await client
    .from("prompt_tags")
    .delete()
    .eq("prompt_id", promptId);
  if (deleteError) throw deleteError;

  // Insert new tags
  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ prompt_id: promptId, tag_id }));
    const { error: insertError } = await client
      .from("prompt_tags")
      .insert(rows as never);
    if (insertError) throw insertError;
  }
}

export async function incrementViews(promptId: string) {
  const { error } = await supabase().rpc("increment_views", {
    p_prompt_id: promptId,
  } as never);
  if (error) throw error;
}

export async function uploadPromptImage(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase()
    .storage.from("prompt-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase()
    .storage.from("prompt-images")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function fetchUserFollowings(userId: string): Promise<string[]> {
  const { data, error } = await supabase()
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);
  if (error) throw error;
  return (
    (data as unknown as { following_id: string }[])?.map((f) => f.following_id) ?? []
  );
}

export async function toggleFollow(followingId: string): Promise<boolean> {
  const { data, error } = await supabase().rpc("toggle_follow", {
    p_following_id: followingId,
  } as never);
  if (error) throw error;
  return data as boolean;
}

export async function fetchFollowedCreatorPrompts(
  userId: string,
  limit = 4
): Promise<PromptWithAuthor[]> {
  const followingIds = await fetchUserFollowings(userId);
  if (followingIds.length === 0) return [];

  const { data, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT)
    .in("user_id", followingIds)
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as PromptWithAuthor[];
}

export async function fetchFeedPrompts(
  userId: string,
  limit = 12,
  page = 0
): Promise<PromptWithAuthor[]> {
  const followingIds = await fetchUserFollowings(userId);
  if (followingIds.length === 0) {
    return Object.assign([] as unknown as PromptWithAuthor[], { totalCount: 0 });
  }

  const from = page * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase()
    .from("prompts")
    .select(PROMPT_SELECT, { count: "exact" })
    .in("user_id", followingIds)
    .order("created_at", { ascending: false }).order("id", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return Object.assign((data ?? []) as unknown as PromptWithAuthor[], {
    totalCount: count ?? 0,
  });
}

export async function toggleLike(
  userId: string,
  promptId: string,
  isLiked: boolean
) {
  const client = supabase();

  if (isLiked) {
    const { error } = await client
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("prompt_id", promptId);
    if (error) throw error;
  } else {
    const { error } = await client
      .from("likes")
      .insert({ user_id: userId, prompt_id: promptId } as never);
    if (error) throw error;
  }
}
