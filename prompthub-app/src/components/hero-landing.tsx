"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/config";

export function HeroLanding() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[10%] -start-[10%] h-[50%] w-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -end-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-surface-high px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("badge")}
        </div>

        {/* Titles */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            {locale === "ar" ? (
              <>
                {"اكتشف وشارك برومبتات "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {"الذكاء الاصطناعي"}
                </span>
              </>
            ) : (
              <>
                {"Discover & Share the Best "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Prompts
                </span>
              </>
            )}
          </h1>
          {locale !== "ar" && (
            <p
              className="text-xl font-semibold text-muted-foreground/60 sm:text-2xl"
              dir="rtl"
            >
              {t("titleAr")}
            </p>
          )}
        </div>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href={routes.explore}
            className="w-full rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            {t("exploreButton")}
          </Link>
          <Link
            href={routes.newPrompt}
            className="w-full rounded-xl border-2 border-border px-8 py-4 text-base font-bold text-foreground transition-colors hover:bg-surface-high sm:w-auto"
          >
            {t("shareButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
