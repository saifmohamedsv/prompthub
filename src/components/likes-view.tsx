"use client";

import { useTranslations } from "next-intl";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useLikedPrompts } from "@/hooks/use-prompts";

export function LikesView() {
  const t = useTranslations("dashboard");
  const { data: prompts, isLoading } = useLikedPrompts();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">{t("likedPrompts")}</h1>
      <PromptGrid prompts={prompts} isLoading={isLoading} />
    </div>
  );
}
