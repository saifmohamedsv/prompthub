"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { usePrompts } from "@/hooks/use-prompts";
import { useTags } from "@/hooks/use-tags";
import { routes } from "@/lib/config";
import type { SortOption } from "@/lib/supabase/queries";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";

export function ExploreView() {
  const t = useTranslations("explore");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: allTags } = useTags();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const tag = searchParams.get("tag") ?? "";
  const debouncedSearch = useDebounce(search, 300);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: t("sortRecent") },
    { value: "most_viewed", label: t("sortMostViewed") },
    { value: "most_liked", label: t("sortMostLiked") },
  ];

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

  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
      {/* Heading */}
      <h1 className="mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent sm:text-4xl">
        {t("title")}
      </h1>

      {/* Subtitle */}
      <p className="mb-6 text-sm text-muted-foreground sm:text-base">
        {t("noResultsDescription").replace(".", "")}
      </p>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Filter row: CategoryFilter + Sort */}
      <div className="mb-6 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <CategoryFilter value={category} onChange={setCategory} />
        </div>
        <div className="shrink-0">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-44">
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
      </div>

      {/* Active tag badge */}
      {tag && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1.5 text-sm text-secondary">
            {t("tagFilter", { name: activeTagName })}
            <button
              type="button"
              onClick={() => router.replace(routes.explore)}
              className="ms-1 rounded-full hover:bg-muted"
            >
              <X className="size-3.5" />
              <span className="sr-only">{t("clearTag")}</span>
            </button>
          </span>
        </div>
      )}

      <PromptGrid prompts={prompts} isLoading={isLoading} />

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
