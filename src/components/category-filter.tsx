"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategoryFilter() {
  const t = useTranslations("explore");

  return (
    <Select>
      <SelectTrigger className="w-full sm:w-48">
        <SelectValue placeholder={t("allCategories")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("allCategories")}</SelectItem>
        {/* Categories will be populated from Supabase */}
      </SelectContent>
    </Select>
  );
}
