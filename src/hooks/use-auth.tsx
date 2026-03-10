"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/prompt";

type AuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, string>;
};

type AuthState = {
  user: AuthUser | null;
  profile: Pick<Profile, "id" | "username" | "full_name" | "avatar_url"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
});

async function fetchMe() {
  const res = await fetch("/api/me");
  if (res.status === 401) return { user: null, profile: null };
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json() as Promise<{ user: AuthUser | null; profile: AuthState["profile"] }>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthState["profile"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const loadUser = useCallback(async () => {
    try {
      const data = await fetchMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Single subscription — refetch only on real auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      ) {
        loadUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isAuthenticated: !!user,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
