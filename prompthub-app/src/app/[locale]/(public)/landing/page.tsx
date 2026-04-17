import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroLanding } from "@/components/hero-landing";
import { routes, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Syntaxa — Discover AI prompts that actually work",
  description:
    "A curated library of 1,600+ AI prompts. Fill in variables, copy in one click, share what works.",
  alternates: { canonical: `${siteConfig.url}${routes.landing}` },
  openGraph: {
    title: "Syntaxa — Discover AI prompts that actually work",
    description:
      "A curated library of 1,600+ AI prompts. Fill in variables, copy in one click.",
    url: `${siteConfig.url}${routes.landing}`,
  },
};

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HeroLanding />;
}
