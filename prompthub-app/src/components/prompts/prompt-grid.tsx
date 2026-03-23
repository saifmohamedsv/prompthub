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
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}

function PromptCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border/5 bg-surface-low p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-full" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="flex gap-2 pt-3">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="space-y-2 pt-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-3 rounded-lg bg-surface-lowest p-3">
        <Skeleton className="mb-2 h-3 w-16" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-4/5" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-14 rounded-full" />
      </div>
    </div>
  );
}
