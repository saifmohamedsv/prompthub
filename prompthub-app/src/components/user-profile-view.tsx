"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePublicProfile, useUserPublicPrompts } from "@/hooks/use-profile";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card>
          <CardContent className="flex items-center gap-5 pt-6">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
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
      <Card>
        <CardContent className="flex items-center gap-5 pt-6">
          <Avatar className="size-20">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-2xl">{displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{displayName}</h1>
            {profile.username && (
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            )}
            {joinDate && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("joined", { date: joinDate })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{prompts?.length ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("totalPrompts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{totalLikes}</p>
            <p className="text-sm text-muted-foreground">{t("totalLikes")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Prompts section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          {t("promptsBy", { name: displayName })}
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
