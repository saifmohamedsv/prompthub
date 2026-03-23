"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePublicProfile, useUserPublicPrompts } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptGrid } from "@/components/prompts/prompt-grid";

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
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col items-center pt-6">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile header */}
      <div className="pt-6">
        <Avatar className="mx-auto size-24 ring-4 ring-primary/20">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="text-3xl">{displayName[0]}</AvatarFallback>
        </Avatar>
        <h1 className="pt-4 text-center text-2xl font-extrabold sm:text-3xl">{displayName}</h1>
        {profile.username && (
          <p className="text-center text-sm text-muted-foreground">@{profile.username}</p>
        )}
        {joinDate && (
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {t("joined", { date: joinDate })}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface-low p-6 text-center">
          <p className="text-4xl font-extrabold">{prompts?.length ?? 0}</p>
          <p className="pt-1 text-sm text-muted-foreground">{t("totalPrompts")}</p>
        </div>
        <div className="rounded-2xl bg-surface-low p-6 text-center">
          <p className="text-4xl font-extrabold">{totalLikes}</p>
          <p className="pt-1 text-sm text-muted-foreground">{t("totalLikes")}</p>
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
