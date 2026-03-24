"use client";

import { type ReactNode, useSyncExternalStore, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/config";

const STORAGE_KEY = "prompthub_visited";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return "true";
}

export function FirstVisitGate({ children }: { children: ReactNode }) {
  const visited = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (visited === null && !redirected.current) {
      redirected.current = true;
      localStorage.setItem(STORAGE_KEY, "true");
      router.replace(routes.landing);
    }
  }, [visited, router]);

  if (visited === null) return null;
  return <>{children}</>;
}
