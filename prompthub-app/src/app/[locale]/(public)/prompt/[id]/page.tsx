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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PromptDetail id={id} />
    </div>
  );
}
