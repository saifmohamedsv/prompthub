"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUserLikes, useToggleLike } from "@/hooks/use-prompts";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/config";

export function LikeButton({
  promptId,
  initialCount,
  floating,
  size = "default",
}: {
  promptId: string;
  initialCount: number;
  floating?: boolean;
  size?: "default" | "lg";
}) {
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
        <Heart
          className={cn(
            "size-3.5 transition-colors",
            isLiked && "fill-red-500 text-red-500"
          )}
        />
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
          "flex items-center gap-3 rounded-lg px-8 py-4 text-base font-bold transition-all active:scale-95",
          isLiked
            ? "bg-red-500/10 text-red-500"
            : "bg-surface-highest text-foreground hover:bg-surface-high"
        )}
      >
        <Heart
          className={cn(
            "size-5 transition-colors",
            isLiked && "fill-red-500 text-red-500"
          )}
        />
        <span>{initialCount}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
        isLiked
          ? "bg-red-500/10 text-red-500"
          : "bg-surface-high text-muted-foreground hover:bg-surface-highest hover:text-foreground"
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          isLiked && "fill-red-500 text-red-500"
        )}
      />
      <span>{initialCount}</span>
    </button>
  );
}
