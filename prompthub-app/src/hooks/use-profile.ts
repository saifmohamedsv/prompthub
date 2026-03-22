"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchProfileById, fetchUserPrompts } from "@/lib/supabase/queries";

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(userId),
    queryFn: () => fetchProfileById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useUserPublicPrompts(userId: string) {
  return useQuery({
    queryKey: queryKeys.prompts.userPublic(userId),
    queryFn: () => fetchUserPrompts(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
