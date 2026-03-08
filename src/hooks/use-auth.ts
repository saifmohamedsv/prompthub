"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/react-query/keys";
import type { Profile } from "@/types/prompt";

type MeResponse = {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, string>;
  } | null;
  profile: Pick<Profile, "id" | "username" | "full_name" | "avatar_url"> | null;
};

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/me");
  if (res.status === 401) {
    return { user: null, profile: null };
  }
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Listen for auth state changes and invalidate the query
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    });

    return () => subscription.unsubscribe();
  }, [queryClient, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(queryKeys.auth.me, {
      user: null,
      profile: null,
    });
  };

  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
    signOut,
  };
}
