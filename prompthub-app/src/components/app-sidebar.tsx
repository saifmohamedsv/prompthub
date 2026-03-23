"use client";

import { useTranslations } from "next-intl";
import { SidebarNavItems } from "@/components/sidebar-nav-items";

export function AppSidebar() {
  const t = useTranslations("sidebar");

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-e border-border bg-sidebar sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-black text-sidebar-foreground">{t("title")}</h2>
        <p className="text-xs text-sidebar-accent-foreground/60">{t("subtitle")}</p>
      </div>
      <SidebarNavItems />
    </aside>
  );
}
