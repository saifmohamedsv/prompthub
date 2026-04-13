"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { usePrompts } from "@/hooks/use-prompts";
import { useTags } from "@/hooks/use-tags";
import { routes } from "@/lib/config";
import type { SortOption } from "@/lib/supabase/queries";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PromptOfTheDay } from "@/components/prompt-of-the-day";
import { FilterSidebar } from "@/components/filter-sidebar";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";
import { ContentHeader } from "@/components/content-header";

export function ExploreView() {
  const t = useTranslations("explore");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: allTags } = useTags();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const tag = searchParams.get("tag") ?? "";
  const debouncedSearch = useDebounce(search, 300);

  const activeTagName = tag ? allTags?.find((t) => t.slug === tag)?.name ?? tag : "";

  const filters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category !== "all" && { category }),
    ...(sort !== "recent" && { sort }),
    ...(tag && { tag }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  };

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePrompts(Object.keys(filters).length > 0 ? filters : undefined);

  const prompts = data?.pages.flat();
  const totalCount = (data?.pages[0] as unknown as { totalCount: number })?.totalCount ?? 0;

  const handleTagChange = (slug: string) => {
    router.replace(slug ? routes.home + "?tag=" + slug : routes.home);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <PromptOfTheDay />

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-60 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pr-4 border-r border-border/10">
            <FilterSidebar
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              category={category}
              onCategoryChange={setCategory}
              activeTag={tag}
              onTagChange={handleTagChange}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <ContentHeader
            totalCount={totalCount}
            activeTag={tag}
            activeTagName={activeTagName}
            onClearTag={() => router.replace(routes.home)}
            onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          />
          <PromptGrid prompts={prompts} isLoading={isLoading} />
          {hasNextPage && (
            <div className="flex justify-center py-6">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2"
              >
                {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
                {isFetchingNextPage ? t("loading") : t("loadMore")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <MobileFilterSheet
        open={isMobileFilterOpen}
        onOpenChange={setIsMobileFilterOpen}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        category={category}
        onCategoryChange={setCategory}
        activeTag={tag}
        onTagChange={handleTagChange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </div>
  );
}
