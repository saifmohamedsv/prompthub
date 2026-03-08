import type { ReactNode } from "react";

// Root layout — minimal shell; real layout lives in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
