"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useMyPrompts } from "@/hooks/use-prompts";
import { routes } from "@/lib/config";
import { Plus } from "lucide-react";

export function MyPromptsView() {
  const t = useTranslations();
  const { data: prompts, isLoading } = useMyPrompts();

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("dashboard.myPrompts")}</h1>
        <Button>
          <Link className="flex items-center" href={routes.newPrompt}>
            <Plus className="me-1 h-5 w-5" />
            {t("prompt.addNew")}
          </Link>
        </Button>
      </div>

      <PromptGrid prompts={prompts} isLoading={isLoading} />
    </div>
  );
}
