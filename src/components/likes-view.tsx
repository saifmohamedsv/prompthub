"use client";

import { useTranslations } from "next-intl";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useLikedPrompts } from "@/hooks/use-prompts";

export function LikesView() {
  const t = useTranslations("dashboard");
  const { data: prompts, isLoading } = useLikedPrompts();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t("likedPrompts")}</h1>
      <PromptGrid prompts={prompts} isLoading={isLoading} />
    </div>
  );
}
