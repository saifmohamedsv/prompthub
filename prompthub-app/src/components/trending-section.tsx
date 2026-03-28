"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flame, Eye, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrendingPrompts } from "@/hooks/use-trending";
import { Locale, getCategoryBadgeClass, routes } from "@/lib/config";
import type { PromptWithAuthor } from "@/types/prompt";

export function TrendingSection() {
  const t = useTranslations("explore");
  const locale = useLocale();
  const isAr = locale === Locale.AR;
  const { data, isLoading } = useTrendingPrompts(6);

  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="size-5 text-primary" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="overflow-x-auto pb-2 md:overflow-visible md:pb-0">
          <div className="flex gap-3 md:grid md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[200px] shrink-0 md:w-auto">
                <TrendingCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data?.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="size-5 text-primary" />
        <h2 className="text-lg font-bold tracking-tight">
          {t("trendingTitle")}
        </h2>
      </div>
      <div className="overflow-x-auto pb-2 md:overflow-visible md:pb-0">
        <div className="flex gap-3 md:grid md:grid-cols-3 lg:grid-cols-6">
          {data.map((prompt, index) => (
            <div key={prompt.id} className="w-[200px] shrink-0 md:w-auto">
              <TrendingCard
                prompt={prompt}
                rank={index + 1}
                isAr={isAr}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendingCard({
  prompt,
  rank,
  isAr,
}: {
  prompt: PromptWithAuthor;
  rank: number;
  isAr: boolean;
}) {
  const categoryName = isAr
    ? prompt.categories?.name_ar
    : prompt.categories?.name;
  const title = isAr && prompt.title_ar ? prompt.title_ar : prompt.title;

  return (
    <Link
      href={routes.promptDetail(prompt.id)}
      className="block h-full rounded-xl border border-card-border bg-surface-1 p-3 transition-all hover:border-brand/20 hover:shadow-md"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg font-black leading-none text-primary">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          {categoryName && (
            <span
              className={`inline-block rounded-full px-2 py-px text-[9px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}
            >
              {categoryName}
            </span>
          )}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-tight">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-foreground-tertiary">
        <span className="inline-flex items-center gap-0.5">
          <Heart className="size-3" />
          {prompt.likes_count}
        </span>
        <span className="inline-flex items-center gap-0.5">
          <Eye className="size-3" />
          {prompt.views_count}
        </span>
      </div>
    </Link>
  );
}

function TrendingCardSkeleton() {
  return (
    <div className="rounded-xl border border-card-border bg-surface-1 p-3">
      <div className="flex items-start gap-2">
        <Skeleton className="h-5 w-4" />
        <div className="flex-1">
          <Skeleton className="h-3 w-14 rounded-full" />
          <Skeleton className="mt-1.5 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
