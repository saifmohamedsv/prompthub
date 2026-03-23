"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const t = useTranslations("explore");

  return (
    <div className="relative flex-1">
      <Search className="absolute start-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="h-16 w-full rounded-xl border-none bg-surface-high ps-14 pe-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-highest"
      />
      <kbd className="absolute end-4 top-1/2 -translate-y-1/2 hidden items-center rounded-md border border-border/20 bg-surface-low px-2 py-1 font-mono text-xs text-muted-foreground sm:inline-flex">
        {t("cmdK")}
      </kbd>
    </div>
  );
}
