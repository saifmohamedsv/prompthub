import { setRequestLocale } from "next-intl/server";
import { PromptDetail } from "@/components/prompts/prompt-detail";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <PromptDetail id={id} />
    </div>
  );
}
