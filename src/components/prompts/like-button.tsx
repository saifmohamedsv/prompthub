"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUserLikes, useToggleLike } from "@/hooks/use-prompts";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

export function LikeButton({
  promptId,
  initialCount,
  floating,
}: {
  promptId: string;
  initialCount: number;
  floating?: boolean;
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
      router.push("/login");
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
            "h-3.5 w-3.5 transition-colors",
            isLiked && "fill-red-500 text-red-500"
          )}
        />
        <span className="text-xs font-medium">{initialCount}</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="gap-1.5"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isLiked && "fill-red-500 text-red-500"
        )}
      />
      <span className="text-xs">{initialCount}</span>
    </Button>
  );
}
