import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LeaderboardView } from "@/components/leaderboard-view";
import { routes, siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "PromptMasters leaderboard",
  description:
    "The top Syntaxa contributors ranked by upvotes across their prompts.",
  alternates: { canonical: `${siteConfig.url}${routes.leaderboard}` },
  openGraph: {
    title: "PromptMasters leaderboard · Syntaxa",
    description: "Top contributors ranked by upvotes across their prompts.",
    url: `${siteConfig.url}${routes.leaderboard}`,
  },
};

export default async function LeaderboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LeaderboardView />;
}
