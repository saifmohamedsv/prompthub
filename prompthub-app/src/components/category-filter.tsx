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
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        type="button"
        onClick={() => onChange?.("all")}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
          current === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-surface-high text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("allCategories")}
      </button>
      {categories?.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange?.(cat.slug)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
            current === cat.slug
              ? "bg-primary text-primary-foreground"
              : "bg-surface-high text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale === Locale.AR ? cat.name_ar : cat.name}
        </button>
      ))}
    </div>
  );
}
