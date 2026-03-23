"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/config";
import {
  Cloud,
  Brain,
  Palette,
  Layers,
  Terminal,
  BookOpen,
} from "lucide-react";

export function HeroLanding() {
  const t = useTranslations("home");

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-[10%] -start-[10%] h-[50%] w-[50%] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute -bottom-[10%] -end-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-surface-high px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              {t("badge")}
            </div>

            {/* Title with gradient highlight */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
              {t("title")}{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
              <Link
                href={routes.explore}
                className="w-full rounded-lg bg-accent px-8 py-4 text-base font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-95 sm:w-auto"
              >
                {t("exploreButton")}
              </Link>
              <Link
                href={routes.newPrompt}
                className="w-full rounded-lg border-2 border-border px-8 py-4 text-base font-bold text-foreground transition-all hover:border-primary/50 active:scale-95 sm:w-auto"
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
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">
              {t("featuredTitle")}
            </h3>
            <p className="text-muted-foreground">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href={routes.explore}
            className="hidden items-center gap-2 text-sm font-bold text-primary hover:underline md:flex"
          >
            {t("viewGallery")}
          </Link>
        </div>

        <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-12">
          {/* Hero Card */}
          <div className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-border/10 bg-surface-high p-8 md:col-span-8 md:row-span-2">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="flex gap-2">
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary">
                  {t("featuredTag")}
                </span>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  Midjourney v6
                </span>
              </div>
              <h4 className="text-3xl font-black leading-tight">
                Hyper-Realistic Cybernetic Portraits
              </h4>
              <div className="rounded-lg border border-border/5 bg-surface-lowest p-4 font-mono text-xs text-muted-foreground">
                /imagine prompt: cinematic photography of an android face,
                translucent skin showing golden circuits, rainy neo-tokyo
                background, shot on 35mm --ar 16:9 --v 6.0
              </div>
            </div>
          </div>

          {/* Side Card 1 */}
          <div className="group flex flex-col justify-between rounded-xl border border-border/10 bg-surface-low p-6 transition-colors hover:bg-surface-high md:col-span-4">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-surface-high p-2 text-primary">
                <Terminal className="size-5" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                1.2k {t("featuredUses")}
              </span>
            </div>
            <div>
              <h5 className="mb-2 text-lg font-bold">Clean Code Architect</h5>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                Optimized system prompt for refactoring React components into
                clean, modular hooks.
              </p>
            </div>
          </div>

          {/* Side Card 2 */}
          <div className="group flex flex-col justify-between rounded-xl border border-border/10 bg-surface-low p-6 transition-colors hover:bg-surface-high md:col-span-4">
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-surface-high p-2 text-secondary">
                <BookOpen className="size-5" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                850 {t("featuredUses")}
              </span>
            </div>
            <div>
              <h5 className="mb-2 text-lg font-bold">The Fiction Weaver</h5>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                Creative writing framework for generating consistent
                world-building lore and characters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
