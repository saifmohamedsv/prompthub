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
      <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="h-10 w-full rounded-xl border-none bg-surface-2 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
