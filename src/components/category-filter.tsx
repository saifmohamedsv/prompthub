"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCategories } from "@/hooks/use-categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CategoryFilter({ value, onChange }: { value?: string; onChange?: (slug: string) => void }) {
  const t = useTranslations("explore");
  const locale = useLocale();
  const { data: categories } = useCategories();

  const selectedLabel = (() => {
    if (!value || value === "all") return t("allCategories");
    const cat = categories?.find((c) => c.slug === value);
    if (!cat) return t("allCategories");
    return locale === "ar" ? cat.name_ar : cat.name;
  })();

  return (
    <Select value={value ?? "all"} onValueChange={(v) => onChange?.(v ?? "all")}>
      <SelectTrigger className="w-full sm:w-48">
        <span>{selectedLabel}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("allCategories")}</SelectItem>
        {categories?.map((cat) => (
          <SelectItem key={cat.id} value={cat.slug}>
            {locale === "ar" ? cat.name_ar : cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
