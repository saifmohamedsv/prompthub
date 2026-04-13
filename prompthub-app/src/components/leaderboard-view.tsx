"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/lib/config";
import { Trophy, Heart, Eye, FileText } from "lucide-react";

export function LeaderboardView() {
  const t = useTranslations("leaderboard");
  const { data: entries, isLoading } = useLeaderboard(20);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="size-6 text-brand" />
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-card-border bg-surface-1 p-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {entries?.map((entry, index) => (
            <Link
              key={entry.user_id}
              href={routes.userProfile(entry.user_id)}
              className="group flex items-center gap-4 rounded-xl border border-card-border bg-surface-1 p-4 transition-all hover:border-brand/20 hover:shadow-md"
            >
              {/* Rank */}
              <span className={`text-lg font-black leading-none w-6 text-center ${
                index === 0 ? "text-brand" : index === 1 ? "text-foreground-secondary" : index === 2 ? "text-foreground-tertiary" : "text-foreground-tertiary"
              }`}>
                {index + 1}
              </span>

              {/* Avatar */}
              <Avatar className="size-10 ring-2 ring-transparent transition-all group-hover:ring-brand/20">
                <AvatarImage src={entry.avatar_url ?? undefined} />
                <AvatarFallback className="text-sm">
                  {(entry.full_name ?? entry.username ?? "?")?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate transition-colors group-hover:text-brand">
                  {entry.full_name ?? entry.username ?? "Anonymous"}
                </p>
                {entry.username && (
                  <p className="text-xs text-muted-foreground">@{entry.username}</p>
                )}
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-foreground-tertiary">
                <span className="inline-flex items-center gap-1">
                  <FileText className="size-3.5" />
                  {entry.prompt_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="size-3.5" />
                  {entry.total_likes.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {entry.total_views.toLocaleString()}
                </span>
              </div>

              {/* Mobile stats */}
              <div className="flex sm:hidden items-center gap-1 text-xs text-foreground-tertiary">
                <Heart className="size-3.5" />
                {entry.total_likes.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
