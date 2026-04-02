"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale, getCategoryBadgeClass, routes } from "@/lib/config";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpvoteButton } from "@/components/prompts/upvote-button";
import { usePromptOfTheDay } from "@/hooks/use-prompts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PromptOfTheDay() {
  const locale = useLocale();
  const isAr = locale === Locale.AR;
  const t = useTranslations("explore");
  const { data: prompt, isLoading } = usePromptOfTheDay();

  if (isLoading) {
    return (
      <div className="mb-6 rounded-2xl border border-brand/20 bg-linear-to-br from-brand-muted/60 to-transparent p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) return null;

  const title = (isAr && prompt.title_ar) ? prompt.title_ar : prompt.title;
  const description = (isAr && prompt.description_ar) ? prompt.description_ar : prompt.description;
  const categoryName = isAr ? prompt.categories?.name_ar : prompt.categories?.name;

  return (
    <div className="mb-6 rounded-2xl border border-brand/20 bg-linear-to-br from-brand-muted/60 to-transparent p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            {t("potdLabel")}
          </span>
          <h2 className="text-base font-bold leading-tight sm:text-lg md:text-xl">
            {title}
          </h2>
          <p className="line-clamp-2 text-sm text-foreground-secondary">
            {description}
          </p>
          <div className="flex items-center gap-3">
            {categoryName && (
              <span className={`rounded-full px-2 py-px text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}>
                {categoryName}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5 ring-1 ring-transparent">
                <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
                <AvatarFallback className="text-[8px]">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-foreground-tertiary">
                {prompt.profiles?.full_name ?? prompt.profiles?.username}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <UpvoteButton promptId={prompt.id} initialCount={prompt.likes_count} size="lg" />
          <span className="inline-flex items-center gap-1 text-sm text-foreground-tertiary">
            <Eye className="size-4" />
            {prompt.views_count}
          </span>
          <Button className="rounded-lg">
            <Link href={routes.promptDetail(prompt.id)}>
              {t("potdOpen")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
