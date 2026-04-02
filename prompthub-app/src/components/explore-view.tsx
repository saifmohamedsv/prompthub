"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { usePrompts } from "@/hooks/use-prompts";
import { useTags } from "@/hooks/use-tags";
import { routes } from "@/lib/config";
import type { SortOption } from "@/lib/supabase/queries";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2 } from "lucide-react";
import { PromptOfTheDay } from "@/components/prompt-of-the-day";
import { TrendingSection } from "@/components/trending-section";
import { FollowingSection } from "@/components/following-section";
import { FilterSidebar } from "@/components/filter-sidebar";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";
import { ContentHeader } from "@/components/content-header";

export function ExploreView() {
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

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleTagChange = (slug: string) => {
    router.replace(slug ? routes.home + "?tag=" + slug : routes.home);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <PromptOfTheDay />

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-60 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pe-4 border-e border-border/10">
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
          {/* <FollowingSection />
          <TrendingSection /> */}
          <PromptGrid prompts={prompts} isLoading={isLoading} />
          <div ref={sentinelRef} className="h-1" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
