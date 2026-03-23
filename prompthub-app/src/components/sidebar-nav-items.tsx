"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Home, Compass, FileText, Heart, Plus, LogOut } from "lucide-react";

type SidebarNavItemsProps = {
  onNavigate?: () => void;
};

export function SidebarNavItems({ onNavigate }: SidebarNavItemsProps) {
  const tNav = useTranslations("nav");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useAuth();

  const navItems: Array<{
    href: string;
    icon: typeof Home;
    label: string;
    exact?: boolean;
    auth?: boolean;
  }> = [
    { href: routes.home, icon: Home, label: tNav("home"), exact: true },
    { href: routes.explore, icon: Compass, label: tNav("explore") },
    { href: routes.myPrompts, icon: FileText, label: tNav("myPrompts"), auth: true },
    { href: routes.likes, icon: Heart, label: tNav("likes"), auth: true },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function resolveHref(item: { href: string; auth?: boolean }) {
    if (item.auth && !isAuthenticated) return routes.login;
    return item.href;
  }

  return (
    <>
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={resolveHref(item)}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-4">
        <Link
          href={isAuthenticated ? routes.newPrompt : routes.login}
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Plus className="size-4" />
          {tSidebar("createPrompt")}
        </Link>
      </div>

      {isAuthenticated && (
        <div className="mt-auto border-t border-border pt-4 px-3">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-5" />
            {tNav("logout")}
          </button>
        </div>
      )}
    </>
  );
}
