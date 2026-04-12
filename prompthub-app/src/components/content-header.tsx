"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/lib/config";
import { SlidersHorizontal, X } from "lucide-react";

export function ContentHeader({
  totalCount,
  activeTag,
  activeTagName,
  onClearTag,
  onOpenMobileFilter,
}: {
  totalCount: number;
  activeTag: string;
  activeTagName: string;
  onClearTag: () => void;
  onOpenMobileFilter: () => void;
}) {
  const t = useTranslations("explore");
  const { isAuthenticated } = useAuth();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{t("promptsHeading")}</h1>
          <span className="ml-2 text-sm text-muted-foreground">
            {t("promptsCount", { count: totalCount.toLocaleString() })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="rounded-lg bg-surface-2 p-2 text-foreground-secondary transition-colors hover:bg-surface-3 md:hidden"
          >
            <SlidersHorizontal className="size-4" />
            <span className="sr-only">{t("filters")}</span>
          </button>
          {isAuthenticated && (
            <Link
              href={routes.newPrompt}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
            >
              {t("createPrompt")}
            </Link>
          )}
        </div>
      </div>

      {activeTag && (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-muted px-3 py-1.5 text-sm text-brand">
            <span className="text-xs font-bold uppercase tracking-wide text-brand">
              {t("tagFilter", { name: activeTagName })}
            </span>
            <button
              type="button"
              onClick={onClearTag}
              className="ml-1 rounded-full hover:bg-muted"
            >
              <X className="size-3.5" />
              <span className="sr-only">{t("clearTag")}</span>
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
