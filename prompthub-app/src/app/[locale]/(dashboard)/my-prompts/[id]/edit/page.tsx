import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PromptForm } from "@/components/prompts/prompt-form";

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <EditPromptView id={id} />;
}

function EditPromptView({ id }: { id: string }) {
  const t = useTranslations("prompt");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">{t("editPrompt")}</h1>
      <PromptForm promptId={id} />
    </div>
  );
}
