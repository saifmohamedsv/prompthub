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
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">{t("addNew")}</h1>
      <PromptForm />
    </div>
  );
}
