"use client";

import { useLocale, useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { Locale } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/lib/supabase/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

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

const TYPE_OPTIONS = ["all", "text", "image", "video"] as const;

export function FilterSidebar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  activeTag,
  onTagChange,
  typeFilter,
  onTypeFilterChange,
  className,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  category: string;
  onCategoryChange: (slug: string) => void;
  activeTag: string;
  onTagChange: (slug: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  className?: string;
}) {
  const t = useTranslations("explore");
  const locale = useLocale();
  const isAr = locale === Locale.AR;
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: t("sortRecent") },
    { value: "most_viewed", label: t("sortMostViewed") },
    { value: "most_liked", label: t("sortMostUpvoted") },
    { value: "hot", label: t("sortHot") },
  ];

  const typeLabels: Record<string, string> = {
    all: t("typeAll"),
    text: t("typeText"),
    image: t("typeImage"),
    video: t("typeVideo"),
  };

  return (
    <div className={cn("space-y-5 p-2", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-10 w-full rounded-xl border-none bg-surface-2 ps-10 pe-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
            <span className="sr-only">{t("clearSearch")}</span>
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("sortLabel")}
        </span>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-full">
            <span>{sortOptions.find((o) => o.value === sort)?.label}</span>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("categories")}
        </span>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              category === "all"
                ? "bg-brand-muted text-brand font-semibold"
                : "text-foreground-secondary hover:bg-surface-2 hover:text-foreground"
            )}
          >
            <span className="text-sm">✦</span>
            <span>{t("allCategories")}</span>
          </button>
          {categories
            ?.slice()
            .sort((a, b) => (a.slug === "other" ? 1 : b.slug === "other" ? -1 : 0))
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  category === cat.slug
                    ? "bg-brand-muted text-brand font-semibold"
                    : "text-foreground-secondary hover:bg-surface-2 hover:text-foreground"
                )}
              >
                <span className="text-sm">{CATEGORY_ICONS[cat.slug] ?? "🏷️"}</span>
                <span>{isAr ? cat.name_ar : cat.name}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("tagsHeading")}
        </span>
        <div className="flex max-h-[200px] flex-wrap gap-1.5 overflow-y-auto">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagChange(activeTag === tag.slug ? "" : tag.slug)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                activeTag === tag.slug
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-3 text-foreground-secondary hover:bg-surface-4"
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("typeFilter")}
        </span>
        <div className="flex gap-1">
          {TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeFilterChange(type)}
              className={cn(
                "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                typeFilter === type
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface-2 text-foreground-secondary hover:bg-surface-3"
              )}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
