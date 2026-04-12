"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUserLikes, useToggleLike } from "@/hooks/use-prompts";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/config";

export function UpvoteButton({ promptId, initialCount, floating, size = "default", label }: { promptId: string; initialCount: number; floating?: boolean; size?: "default" | "lg"; label?: string }) {
  const { isAuthenticated } = useAuth();
  const { data: likedIds } = useUserLikes();
  const { mutate, isPending } = useToggleLike();
  const router = useRouter();

  const isLiked = likedIds?.includes(promptId) ?? false;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(routes.login);
      return;
    }
    mutate({ promptId, isLiked });
  }

  if (floating) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 text-white backdrop-blur-md transition-colors hover:bg-black/55"
      >
        <ChevronUp className={cn("size-3.5 transition-colors", isLiked && "text-brand")} />
        <span className="text-xs font-medium">{initialCount}</span>
      </button>
    );
  }

  if (size === "lg") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98]",
          isLiked ? "bg-brand/10 text-brand" : "bg-surface-3 text-foreground hover:bg-surface-4",
        )}
      >
        <ChevronUp className={cn("size-4 transition-colors", isLiked ? "text-brand" : "")} />
        <span>{label ?? initialCount}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn("inline-flex items-center gap-1 text-sm text-foreground-tertiary transition-colors hover:text-foreground", isLiked && "text-brand")}
    >
      <ChevronUp className={cn("size-4 transition-colors", isLiked ? "text-brand" : "text-foreground-tertiary")} />
      <span className="font-medium">{initialCount}</span>
    </button>
  );
}
