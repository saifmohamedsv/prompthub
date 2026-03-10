"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useMyPrompts } from "@/hooks/use-prompts";
import { Plus } from "lucide-react";

export function MyPromptsView() {
  const t = useTranslations();
  const { data: prompts, isLoading } = useMyPrompts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("dashboard.myPrompts")}</h1>
        <Button>
          <Link className="flex items-center" href="/my-prompts/new">
            <Plus className="me-1 h-5 w-5" />
            {t("prompt.addNew")}
          </Link>
        </Button>
      </div>

      <PromptGrid prompts={prompts} isLoading={isLoading} />
    </div>
  );
}
