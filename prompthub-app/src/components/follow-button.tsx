"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMyFollowings, useToggleFollow } from "@/hooks/use-follows";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/config";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function FollowButton({
  userId,
  size = "default",
}: {
  userId: string;
  size?: "default" | "lg";
}) {
  const t = useTranslations("prompt");
  const { user, isAuthenticated } = useAuth();
  const { data: followings } = useMyFollowings();
  const { mutate, isPending } = useToggleFollow();
  const router = useRouter();

  const isFollowing = followings?.includes(userId) ?? false;
  const isSelf = user?.id === userId;

  if (isSelf) return null;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(routes.login);
      return;
    }
    mutate(userId);
  }

  if (size === "lg") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all active:scale-[0.98]",
          isFollowing
            ? "bg-surface-3 text-foreground hover:bg-destructive/10 hover:text-destructive"
            : "bg-brand text-brand-foreground hover:bg-brand-hover"
        )}
      >
        {isFollowing ? (
          <>
            <UserCheck className="size-4" />
            {t("following")}
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            {t("follow")}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
        isFollowing
          ? "border-border bg-surface-2 text-foreground hover:border-destructive/30 hover:text-destructive"
          : "border-brand/30 text-brand hover:bg-brand-muted"
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck className="size-3.5" />
          {t("following")}
        </>
      ) : (
        <>
          <UserPlus className="size-3.5" />
          {t("follow")}
        </>
      )}
    </button>
  );
}
