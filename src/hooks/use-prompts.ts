"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import {
  fetchPrompts,
  fetchPromptById,
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

export function usePrompts(filters?: PromptFilters) {
  return useQuery({
    queryKey: queryKeys.prompts.list(filters as Record<string, string>),
    queryFn: () => fetchPrompts(filters),
  });
}

export function usePromptDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.prompts.detail(id),
    queryFn: () => fetchPromptById(id),
    enabled: !!id,
  });
}

export function useMyPrompts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.prompts.my,
    queryFn: () => fetchUserPrompts(user!.id),
    enabled: !!user,
  });
}

export function useLikedPrompts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.prompts.liked,
    queryFn: () => fetchLikedPrompts(user!.id),
    enabled: !!user,
  });
}

export function useUserLikes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.auth.me, "likes"],
    queryFn: () => fetchUserLikes(user!.id),
    enabled: !!user,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.auth.me, "likes"],
      });
    },
  });
}
