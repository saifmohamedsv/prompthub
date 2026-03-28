"use client";

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryKeys } from "@/lib/react-query/keys";
import {
  fetchUserFollowings,
  toggleFollow,
  fetchFollowedCreatorPrompts,
  fetchFeedPrompts,
} from "@/lib/supabase/queries";
import { pagination } from "@/lib/config";
import type { PromptWithAuthor } from "@/types/prompt";

export function useMyFollowings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.follows.myFollowings,
    queryFn: () => fetchUserFollowings(user!.id),
    enabled: !!user,
    staleTime: Infinity,
  });
}

export function useIsFollowing(userId: string): boolean {
  const { data: followings } = useMyFollowings();
  return followings?.includes(userId) ?? false;
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.follows.myFollowings });
    },
  });
}

export function useFollowFeed(limit = 4) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.follows.feed(),
    queryFn: () => fetchFollowedCreatorPrompts(user!.id, limit),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

type FeedPage = PromptWithAuthor[] & { totalCount: number };

export function useFeedInfinite() {
  const { user } = useAuth();
  return useInfiniteQuery({
    queryKey: queryKeys.follows.feedInfinite,
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchFeedPrompts(user!.id, pagination.defaultPageSize, pageParam);
      return result as FeedPage;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.length, 0);
      return loaded < lastPage.totalCount ? allPages.length : undefined;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
