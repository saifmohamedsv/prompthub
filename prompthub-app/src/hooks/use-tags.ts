"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchTags } from "@/lib/supabase/queries";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: fetchTags,
    staleTime: 30 * 60 * 1000, // 30 min — tags rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
