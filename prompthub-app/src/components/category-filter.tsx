"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCategories } from "@/hooks/use-categories";
import { Locale } from "@/lib/config";

const CATEGORY_ICONS: Record<string, string> = {
  writing: "✍️",
  coding: "💻",
  marketing: "📣",
  education: "🎓",
  business: "💼",
  creative: "🎨",
  productivity: "⚡",
  other: "📦",
};

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
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition-all active:scale-95 ${
          current === "all"
            ? "bg-brand text-brand-foreground font-bold"
            : "bg-surface-3 text-muted-foreground font-medium hover:text-foreground"
        }`}
      >
        <span className="text-sm">✦</span>
        <span>{t("allCategories")}</span>
      </button>
      {categories?.slice().sort((a, b) => a.slug === "other" ? 1 : b.slug === "other" ? -1 : 0).map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange?.(cat.slug)}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition-all active:scale-95 ${
            current === cat.slug
              ? "bg-brand text-brand-foreground font-bold"
              : "bg-surface-3 text-muted-foreground font-medium hover:text-foreground"
          }`}
        >
          <span className="text-sm">{CATEGORY_ICONS[cat.slug] ?? "🏷️"}</span>
          <span>{locale === Locale.AR ? cat.name_ar : cat.name}</span>
        </button>
      ))}
    </div>
  );
}
