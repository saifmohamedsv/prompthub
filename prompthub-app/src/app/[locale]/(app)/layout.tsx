import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar variant="slim" />
      <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
