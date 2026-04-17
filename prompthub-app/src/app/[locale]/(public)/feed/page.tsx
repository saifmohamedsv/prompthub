import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/config";
import { FeedView } from "@/components/feed-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your feed",
  description: "The latest prompts from creators you follow on Syntaxa.",
  robots: { index: false },
};

export default async function FeedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(routes.login);
  }

  return <FeedView />;
}
