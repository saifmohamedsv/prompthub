import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PromptGrid } from "@/components/prompts/prompt-grid";

export default async function LikesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LikesView />;
}

function LikesView() {
  const t = useTranslations("dashboard");

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t("likedPrompts")}</h1>
      <PromptGrid />
    </div>
  );
}
