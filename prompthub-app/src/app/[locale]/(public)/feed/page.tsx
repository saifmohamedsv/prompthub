import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/config";
import { FeedView } from "@/components/feed-view";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Feed | Syntaxa" };
}

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
