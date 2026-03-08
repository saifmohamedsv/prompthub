import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { Plus } from "lucide-react";

export default async function MyPromptsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MyPromptsView />;
}

function MyPromptsView() {
  const t = useTranslations();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("dashboard.myPrompts")}</h1>
        <Button>
          <Link className="flex items-center" href="/my-prompts/new">
            <Plus className="h-5 w-5 me-1" />
            {t("prompt.addNew")}
          </Link>
        </Button>
      </div>

      <PromptGrid />
    </div>
  );
}
