import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PromptForm } from "@/components/prompts/prompt-form";

export default async function NewPromptPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NewPromptView />;
}

function NewPromptView() {
  const t = useTranslations("prompt");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">{t("forgeTitle")}</h1>
      <p className="pt-2 text-muted-foreground">{t("forgeSubtitle")}</p>
      <div className="pt-8">
        <PromptForm />
      </div>
    </div>
  );
}
