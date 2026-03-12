"use client";

import {
  useSyncExternalStore,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

const STORAGE_KEY = "prompthub_visited";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return "true"; // On server, assume visited (show children)
}

const DismissContext = createContext<(() => void) | null>(null);

export function FirstVisitGate({
  landing,
  children,
}: {
  landing: ReactNode;
  children: ReactNode;
}) {
  const visited = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  if (!visited) {
    return (
      <DismissContext.Provider value={dismiss}>
        {landing}
      </DismissContext.Provider>
    );
  }

  return <>{children}</>;
}

export function useDismissLanding() {
  const dismiss = useContext(DismissContext);
  if (!dismiss) {
    throw new Error("useDismissLanding must be used within FirstVisitGate");
  }
  return dismiss;
}
