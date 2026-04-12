"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { pagination } from "@/lib/config";
import {
  fetchPrompts,
  fetchPromptById,
  fetchFeaturedPrompts,
  fetchPromptOfTheDay,
  fetchUserPrompts,
  fetchLikedPrompts,
  fetchUserLikes,
  toggleLike,
  createPrompt,
  updatePrompt,
  deletePrompt,
  setPromptTags,
  incrementViews,
  type PromptFilters,
} from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/use-auth";
import type { PromptWithAuthor } from "@/types/prompt";

type PromptPage = PromptWithAuthor[] & { totalCount: number };

/**
 * Helpers to update likes_count in cached prompt data without refetching.
 * This prevents: POTD re-rolling, list reordering, UI flicker.
 */
function updatePromptLikeInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  promptId: string,
  delta: number
) {
  // Update infinite list pages (explore view)
  queryClient.setQueriesData<{ pages: PromptPage[]; pageParams: number[] }>(
    { queryKey: ["prompts", "list"] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) =>
          Object.assign(
            page.map((p) =>
              p.id === promptId ? { ...p, likes_count: Math.max(0, p.likes_count + delta) } : p
            ) as PromptPage,
            { totalCount: page.totalCount }
          )
        ),
      };
    }
  );

  // Update detail cache
  queryClient.setQueryData<PromptWithAuthor>(
    queryKeys.prompts.detail(promptId),
    (old) => old ? { ...old, likes_count: Math.max(0, old.likes_count + delta) } : old
  );

  // Update featured/trending/POTD — patch in-place, no refetch
  for (const key of [queryKeys.prompts.featured, queryKeys.prompts.trending]) {
    queryClient.setQueryData<PromptWithAuthor[]>(key, (old) =>
      old?.map((p) =>
        p.id === promptId ? { ...p, likes_count: Math.max(0, p.likes_count + delta) } : p
      )
    );
  }

  queryClient.setQueryData<PromptWithAuthor | null>(
    queryKeys.prompts.ofTheDay,
    (old) => old?.id === promptId ? { ...old, likes_count: Math.max(0, old.likes_count + delta) } : old
  );

  // Update my-prompts and liked lists
  for (const key of [queryKeys.prompts.my, queryKeys.prompts.liked]) {
    queryClient.setQueryData<PromptWithAuthor[]>(key, (old) =>
      old?.map((p) =>
        p.id === promptId ? { ...p, likes_count: Math.max(0, p.likes_count + delta) } : p
      )
    );
  }
}

/** Keys that should refresh when user creates/edits/deletes their own prompts */
const USER_CONTENT_KEYS = [
  queryKeys.prompts.my,
  queryKeys.prompts.liked,
  queryKeys.prompts.featured,
  queryKeys.prompts.trending,
];

export function usePrompts(filters?: Omit<PromptFilters, "limit" | "page">) {
  return useInfiniteQuery({
    queryKey: queryKeys.prompts.list(filters as Record<string, string>),
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchPrompts({
        ...filters,
        limit: pagination.defaultPageSize,
        page: pageParam,
      });
      return result as PromptPage;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.length, 0);
      return loaded < lastPage.totalCount ? allPages.length : undefined;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFeaturedPrompts(limit = 3) {
  return useQuery({
    queryKey: queryKeys.prompts.featured,
    queryFn: () => fetchFeaturedPrompts(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePromptOfTheDay() {
  return useQuery({
    queryKey: queryKeys.prompts.ofTheDay,
    queryFn: fetchPromptOfTheDay,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function usePromptDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.prompts.detail(id),
    queryFn: () => fetchPromptById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMyPrompts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.prompts.my,
    queryFn: () => fetchUserPrompts(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

export function useLikedPrompts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.prompts.liked,
    queryFn: () => fetchLikedPrompts(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

export function useUserLikes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.auth.likes,
    queryFn: () => fetchUserLikes(user!.id),
    enabled: !!user,
    staleTime: Infinity,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      prompt_text?: string | null;
      link?: string | null;
      image_url?: string | null;
      category_id: string;
      tag_ids?: string[];
    }) => {
      if (!user) throw new Error("Must be authenticated");
      const { tag_ids, ...promptData } = data;
      const prompt = await createPrompt({ ...promptData, user_id: user.id });
      if (tag_ids?.length) {
        await setPromptTags(prompt.id, tag_ids);
      }
      return prompt;
    },
    onSuccess: () => {
      // Invalidate lists that show the new prompt, but NOT POTD
      queryClient.invalidateQueries({ queryKey: ["prompts", "list"] });
      for (const key of USER_CONTENT_KEYS) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      tag_ids,
      ...data
    }: {
      id: string;
      title?: string;
      description?: string;
      prompt_text?: string | null;
      link?: string | null;
      image_url?: string | null;
      category_id?: string;
      tag_ids?: string[];
    }) => {
      const prompt = await updatePrompt(id, data);
      if (tag_ids !== undefined) {
        await setPromptTags(id, tag_ids);
      }
      return prompt;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific detail + lists, but NOT POTD
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["prompts", "list"] });
      for (const key of USER_CONTENT_KEYS) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts", "list"] });
      for (const key of USER_CONTENT_KEYS) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function useIncrementViews() {
  return useMutation({
    mutationFn: (promptId: string) => incrementViews(promptId),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      promptId,
      isLiked,
    }: {
      promptId: string;
      isLiked: boolean;
    }) => {
      if (!user) throw new Error("Must be authenticated");
      return toggleLike(user.id, promptId, isLiked);
    },
    onMutate: async ({ promptId, isLiked }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["prompts"] });
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.likes });

      // Snapshot previous likes for rollback
      const previousLikes = queryClient.getQueryData<string[]>(queryKeys.auth.likes);

      // Optimistically update the user's liked IDs
      queryClient.setQueryData<string[]>(queryKeys.auth.likes, (old) => {
        if (!old) return old;
        return isLiked ? old.filter((id) => id !== promptId) : [...old, promptId];
      });

      // Optimistically update likes_count in all cached prompts
      const delta = isLiked ? -1 : 1;
      updatePromptLikeInCache(queryClient, promptId, delta);

      return { previousLikes, promptId, delta };
    },
    onError: (_err, _vars, context) => {
      // Rollback: restore previous likes
      if (context?.previousLikes) {
        queryClient.setQueryData(queryKeys.auth.likes, context.previousLikes);
      }
      // Rollback: reverse the count delta
      if (context) {
        updatePromptLikeInCache(queryClient, context.promptId, -context.delta);
      }
    },
    onSettled: () => {
      // Soft background refetch of just the likes list — no prompt list refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.likes });
    },
  });
}
