"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchTags } from "@/lib/supabase/queries";

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: fetchTags,
    staleTime: 10 * 60 * 1000,
  });
}
