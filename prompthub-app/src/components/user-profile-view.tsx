"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePublicProfile, useUserPublicPrompts } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { FollowButton } from "@/components/follow-button";

export function UserProfileView({ userId }: { userId: string }) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(userId);
  const { data: prompts, isLoading: promptsLoading } = useUserPublicPrompts(userId);

  const totalLikes = prompts?.reduce((sum, p) => sum + p.likes_count, 0) ?? 0;
  const displayName = profile?.full_name ?? profile?.username ?? "—";
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
      })
    : "";

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-4 pt-6">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-start">
        <Avatar className="size-16 ring-2 ring-brand/20">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="text-xl">{displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-start">
          <h1 className="text-xl font-extrabold sm:text-2xl">{displayName}</h1>
          {profile.username && (
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          )}
          {joinDate && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("joined", { date: joinDate })}
            </p>
          )}
          {/* Stat chips */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs">
              <span className="font-bold">{prompts?.length ?? 0}</span>
              <span className="text-muted-foreground">{t("totalPrompts")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs">
              <span className="font-bold">{totalLikes}</span>
              <span className="text-muted-foreground">{t("totalLikes")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs">
              <span className="font-bold">{profile.followers_count}</span>
              <span className="text-muted-foreground">{t("followers")}</span>
            </span>
          </div>
          <div className="mt-3">
            <FollowButton userId={userId} size="lg" />
          </div>
        </div>
      </div>

      {/* Prompts section */}
      <div>
        <h2 className="mb-4 text-xl font-bold">
          {t("contributions")}
        </h2>
        {prompts?.length === 0 && !promptsLoading ? (
          <p className="py-8 text-center text-muted-foreground">{t("noPrompts")}</p>
        ) : (
          <PromptGrid prompts={prompts} isLoading={promptsLoading} />
        )}
      </div>
    </div>
  );
}
