import { setRequestLocale } from "next-intl/server";
import { FirstVisitGate } from "@/components/first-visit-gate";
import { HeroLanding } from "@/components/hero-landing";
import { ExploreView } from "@/components/explore-view";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FirstVisitGate landing={<HeroLanding />}>
      <ExploreView />
    </FirstVisitGate>
  );
}
