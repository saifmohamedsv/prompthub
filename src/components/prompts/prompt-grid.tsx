"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/prompts/prompt-card";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptGrid({
  prompts,
  isLoading,
}: {
  prompts?: PromptWithAuthor[];
  isLoading?: boolean;
}) {
  const t = useTranslations("explore");

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!prompts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {t("noResults")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("noResultsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}

function PromptCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-card shadow-sm ring-1 ring-border dark:shadow-lg dark:shadow-black/30 dark:ring-white/5">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      {/* Tags */}
      <div className="flex gap-1.5 px-4 pt-2.5">
        <Skeleton className="h-5 w-12 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>
      {/* Title + desc */}
      <div className="space-y-2 px-4 pt-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      {/* Prompt snippet */}
      <div className="mx-4 mt-3 rounded-lg bg-muted/70 p-3 dark:bg-muted/40">
        <Skeleton className="mb-2 h-3 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-4/5" />
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-4 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-14 rounded-md" />
      </div>
    </div>
  );
}
