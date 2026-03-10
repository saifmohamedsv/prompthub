"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchCategories } from "@/lib/supabase/queries";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // categories rarely change
  });
}
