import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ExploreView } from "@/components/explore-view";
import { FirstVisitGate } from "@/components/first-visit-gate";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FirstVisitGate>
      <Suspense>
        <ExploreView />
      </Suspense>
    </FirstVisitGate>
  );
}
