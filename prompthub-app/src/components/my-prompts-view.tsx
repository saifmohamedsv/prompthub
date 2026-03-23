"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { useMyPrompts } from "@/hooks/use-prompts";
import { routes } from "@/lib/config";
import { Plus, FileText } from "lucide-react";

export function MyPromptsView() {
  const t = useTranslations();
  const { data: prompts, isLoading } = useMyPrompts();

  const isEmpty = !isLoading && (!prompts || prompts.length === 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t("dashboard.myPrompts")}
          </h1>
          <p className="text-muted-foreground pt-2">
            {t("dashboard.myPromptsSubtitle")}
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground rounded-lg px-5 py-2.5 font-bold hover:brightness-110">
          <Link className="flex items-center" href={routes.newPrompt}>
            <Plus className="me-1 h-5 w-5" />
            {t("prompt.addNew")}
          </Link>
        </Button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-surface-low p-8 text-center">
          <div className="rounded-lg bg-surface-high p-3">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h3 className="pt-4 text-lg font-bold">
            {t("dashboard.myPromptsEmpty")}
          </h3>
          <p className="pt-2 text-sm text-muted-foreground">
            {t("dashboard.myPromptsEmptyDesc")}
          </p>
          <Link
            href={routes.newPrompt}
            className="mt-6 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-all hover:brightness-110"
          >
            <Plus className="me-1 h-4 w-4" />
            {t("prompt.addNew")}
          </Link>
        </div>
      ) : (
        <PromptGrid prompts={prompts} isLoading={isLoading} />
      )}
    </div>
  );
}
