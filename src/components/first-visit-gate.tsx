"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";

const STORAGE_KEY = "prompthub_visited";

const DismissContext = createContext<(() => void) | null>(null);

export function FirstVisitGate({
  landing,
  children,
}: {
  landing: ReactNode;
  children: ReactNode;
}) {
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    if (!visited) {
      setShowLanding(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowLanding(false);
  }, []);

  if (showLanding) {
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
