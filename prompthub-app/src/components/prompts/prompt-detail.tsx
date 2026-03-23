"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { usePromptDetail, useIncrementViews } from "@/hooks/use-prompts";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes } from "@/lib/config";
import { ExternalLink, ArrowLeft, Eye, Calendar, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

export function PromptDetail({ id }: { id: string }) {
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: prompt, isLoading } = usePromptDetail(id);
  const { mutate: incrementViews } = useIncrementViews();

  useEffect(() => {
    if (id) incrementViews(id);
  }, [id, incrementViews]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-8 sm:pt-12 md:px-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="rounded-xl border border-border/5 bg-surface-low p-8 md:p-12">
          <Skeleton className="mb-6 h-[300px] w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">Prompt not found</p>
      </div>
    );
  }

  const categoryName = locale === Locale.AR ? prompt.categories?.name_ar : prompt.categories?.name;
  const title = (locale === Locale.AR && prompt.title_ar) ? prompt.title_ar : prompt.title;
  const description = (locale === Locale.AR && prompt.description_ar) ? prompt.description_ar : prompt.description;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-20 sm:pt-12 md:px-8">
      {/* Header — outside card */}
      <header className="mb-10">
        <Link
          href={routes.explore}
          className="group flex w-fit items-center gap-2 font-medium text-primary transition-transform hover:-translate-x-1"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          {tCommon("backToExplore")}
        </Link>

        <h1 className="pt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
      </header>

      {/* Article card */}
      <article className="overflow-hidden rounded-xl border border-border/5 bg-surface-low shadow-2xl">
        {/* Hero image — flush with card top */}
        {prompt.image_url && (
          <div className="max-h-[400px] w-full overflow-hidden">
            <Image
              src={prompt.image_url}
              alt={title}
              className="h-full w-full object-cover"
              width={1200}
              height={400}
            />
          </div>
        )}

        {/* Content area */}
        <div className="space-y-10 p-8 md:p-12">
          {/* Tags + Stats row */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              {prompt.categories && (
                <span className="rounded-full border border-primary/20 bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  {categoryName}
                </span>
              )}
              {tags.map((tag) => (
                <Link key={tag.id} href={routes.explore + "?tag=" + tag.slug}>
                  <span className="rounded-full bg-surface-highest px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-4" />
                {prompt.views_count} {t("views")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" />
                {new Date(prompt.created_at).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex gap-4 pt-4">
            <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} size="lg" />
            {prompt.link && (
              <Link
                href={prompt.link}
                target="_blank"
                className="flex items-center gap-3 rounded-lg bg-accent px-8 py-4 font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-95"
              >
                <ExternalLink className="size-5" />
                {t("tryIt")}
              </Link>
            )}
          </div>

          {/* Description section */}
          <div>
            <h3 className="text-xl font-bold">{t("description")}</h3>
            <p className="mt-3 max-w-3xl text-lg font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Prompt Syntax section */}
          {prompt.prompt_text && (
            <div>
              <h3 className="mb-4 text-xl font-bold">{t("promptSyntax")}</h3>
              <div className="group relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-25 blur transition duration-1000 group-hover:opacity-40" />
                <div className="relative">
                  <PromptSnippet text={prompt.prompt_text} variant="full" />
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          <hr className="border-border/5" />

          {/* Author section */}
          <div className="flex items-center justify-between">
            <Link href={routes.userProfile(prompt.user_id)} className="group flex items-center gap-4">
              <Avatar className="size-16 ring-4 ring-primary/10">
                <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
                <AvatarFallback>{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold transition-colors group-hover:text-primary">
                  {prompt.profiles?.full_name ?? prompt.profiles?.username}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  @{prompt.profiles?.username ?? prompt.profiles?.full_name}
                </p>
              </div>
            </Link>
            <button
              type="button"
              className="hidden rounded-lg border border-border px-6 py-2 text-sm font-medium transition-colors hover:border-primary/50 md:flex"
            >
              {t("followCreator")}
            </button>
          </div>
        </div>
      </article>

      {/* Similar Syntaxes — outside card */}
      <section className="mt-20 space-y-8">
        <h2 className="flex items-center gap-3 text-2xl font-bold">
          <Sparkles className="size-5 text-secondary" />
          {t("similarSyntaxes")}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="group cursor-pointer rounded-xl border border-border/5 bg-surface-low p-6 transition-colors hover:bg-surface-high">
            <div className="mb-4 flex items-start justify-between">
              <span className="font-mono text-xs text-secondary">#interior-design</span>
              <TrendingUp className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h4 className="mb-2 font-bold">Scandinavian Loft Interior</h4>
            <p className="line-clamp-2 text-sm italic text-muted-foreground">
              &quot;Minimalist bright space with wooden accents and soft afternoon sun...&quot;
            </p>
          </div>
          <div className="group cursor-pointer rounded-xl border border-border/5 bg-surface-low p-6 transition-colors hover:bg-surface-high">
            <div className="mb-4 flex items-start justify-between">
              <span className="font-mono text-xs text-secondary">#concept-art</span>
              <TrendingUp className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h4 className="mb-2 font-bold">Cyberpunk Cityscape Dusk</h4>
            <p className="line-clamp-2 text-sm italic text-muted-foreground">
              &quot;Neon drenched streets with rain puddles and holographic ads...&quot;
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
