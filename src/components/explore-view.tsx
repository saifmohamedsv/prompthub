"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePrompts } from "@/hooks/use-prompts";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useDebounce } from "@/hooks/use-debounce";

export function ExploreView() {
  const t = useTranslations("explore");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category !== "all" && { category }),
  };

  const { data: prompts, isLoading } = usePrompts(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <PromptGrid prompts={prompts} isLoading={isLoading} />
    </div>
  );
}
