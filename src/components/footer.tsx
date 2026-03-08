import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>{t("tagline")}</span>
        </div>
        <p>
          {t("builtWith")} Next.js, Supabase & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
