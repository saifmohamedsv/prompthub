"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  const t = useTranslations("explore");

  return (
    <div className="relative flex-1">
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={t("searchPlaceholder")}
        className="ps-9"
      />
    </div>
  );
}
