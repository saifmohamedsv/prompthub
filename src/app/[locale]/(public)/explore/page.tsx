import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { PromptGrid } from "@/components/prompts/prompt-grid";

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExploreView />;
}

function ExploreView() {
  const t = useTranslations("explore");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t("title")}</h1>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <SearchBar />
        <CategoryFilter />
      </div>

      <PromptGrid />
    </div>
  );
}
