"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryKeys } from "@/lib/react-query/keys";
import {
  fetchUserFollowings,
  toggleFollow,
  fetchFollowedCreatorPrompts,
} from "@/lib/supabase/queries";

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
