"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCategories } from "@/hooks/use-categories";
import { Locale } from "@/lib/config";

export function CategoryFilter({ value, onChange }: { value?: string; onChange?: (slug: string) => void }) {
  const t = useTranslations("explore");
  const locale = useLocale();
  const { data: categories } = useCategories();

  const current = value ?? "all";

  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        type="button"
        onClick={() => onChange?.("all")}
        className={`whitespace-nowrap rounded-full px-3.5 py-1 text-xs transition-colors active:scale-95 transition-transform ${
          current === "all"
            ? "bg-brand text-brand-foreground font-bold"
            : "bg-surface-3 text-muted-foreground font-medium hover:text-foreground"
        }`}
      >
        {t("allCategories")}
      </button>
      {categories?.slice().sort((a, b) => a.slug === "other" ? 1 : b.slug === "other" ? -1 : 0).map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange?.(cat.slug)}
          className={`whitespace-nowrap rounded-full px-3.5 py-1 text-xs transition-colors active:scale-95 transition-transform ${
            current === cat.slug
              ? "bg-brand text-brand-foreground font-bold"
              : "bg-surface-3 text-muted-foreground font-medium hover:text-foreground"
          }`}
        >
          {locale === Locale.AR ? cat.name_ar : cat.name}
        </button>
      ))}
    </div>
  );
}
