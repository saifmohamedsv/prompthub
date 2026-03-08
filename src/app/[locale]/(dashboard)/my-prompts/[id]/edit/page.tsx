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
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">{t("editPrompt")}</h1>
      <PromptForm promptId={id} />
    </div>
  );
}
