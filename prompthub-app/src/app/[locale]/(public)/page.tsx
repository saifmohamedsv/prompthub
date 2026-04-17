import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ExploreView } from "@/components/explore-view";
import { FirstVisitGate } from "@/components/first-visit-gate";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Discover AI prompts",
  description:
    "Browse 1,600+ battle-tested prompts for ChatGPT, Claude, Midjourney, and more. Filter by category, sort by popularity, fill in variables, and copy in one click.",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "Discover AI prompts · Syntaxa",
    description:
      "Browse 1,600+ battle-tested prompts. Filter, fill in variables, and copy in one click.",
    url: siteConfig.url,
  },
};

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
