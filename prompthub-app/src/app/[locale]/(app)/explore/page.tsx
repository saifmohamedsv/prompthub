import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ExploreView } from "@/components/explore-view";

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <ExploreView />
    </Suspense>
  );
}
