"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/config";
import { Plus } from "lucide-react";

export function FabCreate() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/landing", "/my-prompts/new"];
  const isHidden = hiddenRoutes.some((r) => pathname.startsWith(r));

  if (!isAuthenticated || isHidden) return null;

  return (
    <Link
      href={routes.newPrompt}
      className="fixed bottom-5 end-5 z-40 flex size-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-xl shadow-brand transition-all hover:scale-105 hover:bg-brand-hover hover:shadow-2xl active:scale-95"
    >
      <Plus className="size-6" />
      <span className="sr-only">Create Prompt</span>
    </Link>
  );
}
