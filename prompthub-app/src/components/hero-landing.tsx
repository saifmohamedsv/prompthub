"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/config";
import { useFeaturedPrompts } from "@/hooks/use-prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  Brain,
  Palette,
  Layers,
} from "lucide-react";

export function HeroLanding() {
  const t = useTranslations("home");
  const { data: featured, isLoading: featuredLoading } = useFeaturedPrompts(3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-28">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-surface-1">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-surface-3 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              {t("badge")}
            </div>

            {/* Title with gradient highlight */}
            <h1 className="text-4xl lg:text-[56px] font-semibold tracking-tight text-balance">
              {t("title")}{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto text-[15px] leading-relaxed text-foreground-secondary max-w-[480px]">
              {t("subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
              <Link
                href={routes.home}
                className="w-full rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand transition-all hover:bg-brand-hover hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] active:scale-95 sm:w-auto"
              >
                {t("exploreButton")}
              </Link>
              <Link
                href={routes.newPrompt}
                className="w-full rounded-lg border-2 border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-brand/20 active:scale-95 sm:w-auto"
              >
                {t("shareButton")}
              </Link>
            </div>

            {/* Social Proof */}
            <div className="w-full max-w-4xl pt-16">
              <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {t("trustedBy")}
              </p>
              <div className="grid grid-cols-2 gap-8 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 md:grid-cols-4">
                {[
                  { icon: Cloud, name: "Anthropic" },
                  { icon: Brain, name: "OpenAI" },
                  { icon: Palette, name: "Midjourney" },
                  { icon: Layers, name: "Meta" },
                ].map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon className="size-7" />
                    <span className="font-mono font-bold">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handpicked Artifacts Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">
              {t("featuredTitle")}
            </h3>
            <p className="text-muted-foreground">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href={routes.home}
            className="hidden items-center gap-2 text-sm font-bold text-primary hover:underline md:flex"
          >
            {t("viewGallery")}
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        ) : featured && featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
