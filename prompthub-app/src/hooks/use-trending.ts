import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/keys";
import { fetchTrendingPrompts } from "@/lib/supabase/queries";

export function useTrendingPrompts(limit = 8) {
  return useQuery({
    queryKey: queryKeys.prompts.trending,
    queryFn: () => fetchTrendingPrompts(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
