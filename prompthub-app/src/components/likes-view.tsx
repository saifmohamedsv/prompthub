"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useLikedPrompts } from "@/hooks/use-prompts";
import { routes } from "@/lib/config";
import { ChevronUp, Compass } from "lucide-react";

export function LikesView() {
  const t = useTranslations();
  const { data: prompts, isLoading } = useLikedPrompts();

  const isEmpty = !isLoading && (!prompts || prompts.length === 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("dashboard.upvotedPrompts")}
        </h1>
        <p className="text-muted-foreground pt-2">
          {t("dashboard.upvotedPromptsSubtitle")}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-surface-1 p-5 text-center shadow-sm">
          <div className="rounded-lg bg-surface-3 p-3">
            <ChevronUp className="size-6 text-muted-foreground" />
          </div>
          <h3 className="pt-4 text-lg font-bold">
            {t("dashboard.upvotedPromptsEmpty")}
          </h3>
          <p className="pt-2 text-sm text-muted-foreground">
            {t("dashboard.upvotedPromptsEmptyDesc")}
          </p>
          <Link
            href={routes.home}
            className="mt-6 inline-flex items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-all hover:bg-brand-hover"
          >
            <Compass className="me-1 h-4 w-4" />
            {t("nav.explore")}
          </Link>
        </div>
      ) : (
        <PromptGrid prompts={prompts} isLoading={isLoading} />
      )}
    </div>
  );
}
