"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/prompts/prompt-card";
import { PromptPreviewSheet } from "@/components/prompts/prompt-preview-sheet";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptGrid({
  prompts,
  isLoading,
}: {
  prompts?: PromptWithAuthor[];
  isLoading?: boolean;
}) {
  const t = useTranslations("explore");
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onPreview={(id) => setPreviewId(id)}
          />
        ))}
      </div>
      <PromptPreviewSheet
        promptId={previewId}
        onClose={() => setPreviewId(null)}
      />
    </>
  );
}

function PromptCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-card-border bg-surface-1 p-3 shadow-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-14 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="mt-2 flex gap-1.5">
        <Skeleton className="h-3 w-10 rounded-md" />
        <Skeleton className="h-3 w-12 rounded-md" />
      </div>
      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="mt-2 rounded-md bg-surface-2 p-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-4/5" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
