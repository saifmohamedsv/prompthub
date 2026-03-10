import { setRequestLocale } from "next-intl/server";
import { MyPromptsView } from "@/components/my-prompts-view";

export default async function MyPromptsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MyPromptsView />;
}
