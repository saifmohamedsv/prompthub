import { setRequestLocale } from "next-intl/server";
import { HeroLanding } from "@/components/hero-landing";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HeroLanding />;
}
