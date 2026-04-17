import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/config";
import { MyPromptsView } from "@/components/my-prompts-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My prompts",
  description: "Manage the prompts you've shared on Syntaxa.",
  robots: { index: false },
};

export default async function MyPromptsPage({
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

  return <MyPromptsView />;
}
