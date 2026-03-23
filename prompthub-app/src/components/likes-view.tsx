"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useLikedPrompts } from "@/hooks/use-prompts";
import { routes } from "@/lib/config";
import { Heart, Compass } from "lucide-react";

export function LikesView() {
  const t = useTranslations();
  const { data: prompts, isLoading } = useLikedPrompts();

  const isEmpty = !isLoading && (!prompts || prompts.length === 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {t("dashboard.likedPrompts")}
        </h1>
        <p className="text-muted-foreground pt-2">
          {t("dashboard.likedPromptsSubtitle")}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-surface-low p-8 text-center">
          <div className="rounded-lg bg-surface-high p-3">
            <Heart className="size-6 text-muted-foreground" />
          </div>
          <h3 className="pt-4 text-lg font-bold">
            {t("dashboard.likedPromptsEmpty")}
          </h3>
          <p className="pt-2 text-sm text-muted-foreground">
            {t("dashboard.likedPromptsEmptyDesc")}
          </p>
          <Link
            href={routes.explore}
            className="mt-6 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-all hover:brightness-110"
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
