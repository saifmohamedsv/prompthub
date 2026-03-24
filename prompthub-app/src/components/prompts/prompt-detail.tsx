"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale, getCategoryBadgeClass } from "@/lib/config";
import { usePromptDetail, useIncrementViews, useFeaturedPrompts } from "@/hooks/use-prompts";
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
      <div className="mx-auto max-w-4xl space-y-4 px-4 pt-6 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <div className="rounded-xl border border-card-border bg-surface-1 p-4 sm:p-6">
          <Skeleton className="mb-4 h-[200px] w-full rounded-lg" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-3/4" />
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
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-5">
        <Link
          href={routes.home}
          className="group inline-flex items-center gap-1.5 text-[13px] text-foreground-secondary transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-3.5" />
          {tCommon("backToExplore")}
        </Link>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </header>

      {/* Article card */}
      <article className="overflow-hidden rounded-xl border border-card-border bg-surface-1 shadow-card">
        {/* Hero image */}
        {prompt.image_url && (
          <div className="max-h-[280px] w-full overflow-hidden">
            <Image
              src={prompt.image_url}
              alt={title}
              className="h-full w-full object-cover"
              width={1200}
              height={280}
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-5 p-4 sm:p-6">
          {/* Tags + Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {prompt.categories && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}>
                  {categoryName}
                </span>
              )}
              {tags.map((tag) => (
                <Link key={tag.id} href={routes.home + "?tag=" + tag.slug}>
                  <span className="rounded-md bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-foreground-secondary transition-colors hover:bg-brand-muted hover:text-brand">
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-foreground-tertiary">
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3" />
                {prompt.views_count}
              </span>
              <span>·</span>
              <span>
                {new Date(prompt.created_at).toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} size="lg" label={t("likePrompt")} />
            {prompt.link && (
              <Link
                href={prompt.link}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition-all hover:bg-brand-hover active:scale-[0.98]"
              >
                <ExternalLink className="size-4" />
                {t("tryIt")}
              </Link>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">{t("description")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              {description}
            </p>
          </div>

          {/* Prompt Syntax */}
          {prompt.prompt_text && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground-secondary uppercase tracking-wider">{t("promptSyntax")}</h3>
              <PromptSnippet text={prompt.prompt_text} variant="full" />
            </div>
          )}

          <hr className="border-border" />

          {/* Author */}
          <div className="flex items-center justify-between">
            <Link href={routes.userProfile(prompt.user_id)} className="group flex items-center gap-3">
              <Avatar className="size-10 ring-2 ring-brand/15">
                <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
                <AvatarFallback className="text-sm">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold transition-colors group-hover:text-brand">
                  {prompt.profiles?.full_name ?? prompt.profiles?.username}
                </p>
                <p className="font-mono text-[11px] text-foreground-tertiary">
                  @{prompt.profiles?.username ?? prompt.profiles?.full_name}
                </p>
              </div>
            </Link>
            <button
              type="button"
              className="hidden rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/20 md:flex"
            >
              {t("followCreator")}
            </button>
          </div>
        </div>
      </article>

      {/* Similar Syntaxes */}
      <SimilarSyntaxes currentId={id} locale={locale} t={t} />
    </main>
  );
}

function SimilarSyntaxes({ currentId, locale, t }: { currentId: string; locale: string; t: (key: string) => string }) {
  const isAr = locale === Locale.AR;
  const { data: prompts, isLoading } = useFeaturedPrompts(4);

  const similar = prompts?.filter((p) => p.id !== currentId).slice(0, 2);

  if (isLoading) return null;
  if (!similar || similar.length === 0) return null;

  return (
    <section className="mt-8 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground-secondary">
        <Sparkles className="size-3.5 text-brand" />
        {t("similarSyntaxes")}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {similar.map((prompt) => {
          const title = (isAr && prompt.title_ar) ? prompt.title_ar : prompt.title;
          const desc = (isAr && prompt.description_ar) ? prompt.description_ar : prompt.description;
          const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];
          return (
            <Link
              key={prompt.id}
              href={routes.promptDetail(prompt.id)}
              className="group rounded-lg border border-card-border bg-surface-1 p-3 transition-colors hover:bg-surface-2"
            >
              <div className="mb-2 flex items-start justify-between">
                {tags[0] && (
                  <span className="font-mono text-[10px] text-brand">#{tags[0].name}</span>
                )}
                <TrendingUp className="size-3 text-foreground-tertiary transition-colors group-hover:text-brand" />
              </div>
              <h4 className="text-sm font-medium">{title}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-foreground-tertiary">
                {desc}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
