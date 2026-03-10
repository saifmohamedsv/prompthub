"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchCategories } from "@/lib/supabase/queries";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 min — categories rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
