"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFeedInfinite } from "@/hooks/use-follows";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { routes } from "@/lib/config";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Users, Compass, Loader2 } from "lucide-react";

export function FeedView() {
  const t = useTranslations();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeedInfinite();

  const prompts = data?.pages.flat();
  const isEmpty = !isLoading && (!prompts || prompts.length === 0);

  const sentinelRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("feed.title")}
        </h1>
        <p className="text-muted-foreground pt-2">
          {t("feed.subtitle")}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Users className="size-12 text-muted-foreground/40" />
          <div>
            <p className="font-semibold">{t("feed.emptyTitle")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("feed.emptyDesc")}
            </p>
          </div>
          <Link
            href={routes.home}
            className="inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-hover"
          >
            <Compass className="mr-1 size-4" />
            {t("feed.exploreCta")}
          </Link>
        </div>
      ) : (
        <section className="max-w-7xl">
          <PromptGrid prompts={prompts} isLoading={isLoading} />

          <div ref={sentinelRef} className="h-1" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
