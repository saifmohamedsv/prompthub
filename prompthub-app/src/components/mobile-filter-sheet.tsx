"use client";

import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/filter-sidebar";
import type { SortOption } from "@/lib/supabase/queries";

export function MobileFilterSheet({
  open,
  onOpenChange,
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}) {
  const t = useTranslations("explore");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-4 overflow-y-auto">
        <SheetTitle className="mb-4 text-sm font-bold">{t("filters")}</SheetTitle>
        <FilterSidebar
          search={search}
          onSearchChange={onSearchChange}
          sort={sort}
          onSortChange={onSortChange}
          category={category}
          onCategoryChange={onCategoryChange}
          activeTag={activeTag}
          onTagChange={onTagChange}
          typeFilter={typeFilter}
          onTypeFilterChange={onTypeFilterChange}
        />
      </SheetContent>
    </Sheet>
  );
}
