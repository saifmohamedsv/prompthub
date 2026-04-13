"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/lib/supabase/queries";

const LEADERBOARD_KEY = ["leaderboard"] as const;

export function useLeaderboard(limit = 20) {
  return useQuery({
    queryKey: LEADERBOARD_KEY,
    queryFn: () => fetchLeaderboard(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
