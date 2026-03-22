"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { routes } from "@/lib/config";
import { useDismissLanding } from "@/components/first-visit-gate";

export function HeroLanding() {
  const t = useTranslations("home");
  const dismiss = useDismissLanding();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center sm:gap-8">
      <Logo size="lg" />

      <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
        {t("title")}
      </h1>

      <p className="max-w-xl text-base text-muted-foreground sm:text-lg">{t("subtitle")}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button size="lg" onClick={dismiss}>
          {t("exploreButton")}
        </Button>
        <Button size="lg" variant="outline">
          <Link href={routes.newPrompt}>{t("shareButton")}</Link>
        </Button>
      </div>
    </main>
  );
}
