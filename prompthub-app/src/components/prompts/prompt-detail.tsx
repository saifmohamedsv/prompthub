"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getCategoryBadgeClass, getModelName } from "@/lib/config";
import { usePromptDetail, useIncrementViews, useFeaturedPrompts } from "@/hooks/use-prompts";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpvoteButton } from "@/components/prompts/upvote-button";
import { FollowButton } from "@/components/follow-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes } from "@/lib/config";
import { ExternalLink, ArrowLeft, Eye, Sparkles, TrendingUp, Cpu } from "lucide-react";
import Image from "next/image";

export function PromptDetail({ id }: { id: string }) {
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");
  const { data: prompt, isLoading } = usePromptDetail(id);
  const { mutate: incrementViews } = useIncrementViews();

  useEffect(() => {
    if (id) incrementViews(id);
  }, [id, incrementViews]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-3 px-3 pt-3 sm:space-y-4 sm:px-6 sm:pt-6 lg:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-3/4 sm:h-8" />
        <div className="rounded-xl border border-card-border bg-surface-1 p-2.5 sm:p-6">
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

  const categoryName = prompt.categories?.name;
  const title = prompt.title;
  const description = prompt.description;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  return (
    <main className="mx-auto max-w-4xl px-0 pt-3 pb-6 sm:px-6 sm:pt-6 sm:pb-12 lg:px-8">
      {/* Header */}
      <header className="mb-3 sm:mb-5">
        <Link href={routes.home} className="group inline-flex items-center gap-1.5 text-[13px] text-foreground-secondary transition-colors hover:text-brand">
          <ArrowLeft className="size-3.5" />
          {tCommon("backToExplore")}
        </Link>

        <h1 className="mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-2xl md:text-3xl">{title}</h1>
      </header>

      {/* Article card */}
      <article className="overflow-hidden rounded-xl border border-card-border bg-surface-1 shadow-card">
        {/* Hero image */}
        {prompt.image_url && (
          <div className="max-h-[280px] w-full overflow-hidden">
            <Image src={prompt.image_url} alt={title} className="h-full w-full object-cover" width={1200} height={280} />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3 p-2.5 sm:space-y-5 sm:p-6">
          {/* Tags + Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {prompt.categories && (
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}>{categoryName}</span>
              )}
              {tags.map((tag) => (
                <Link key={tag.id} href={routes.home + "?tag=" + tag.slug}>
                  <span className="rounded-md bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-foreground-secondary transition-colors hover:bg-brand-muted hover:text-brand">{tag.name}</span>
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
                {new Date(prompt.created_at).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Best with models */}
          {prompt.best_with_models && prompt.best_with_models.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                <Cpu className="size-3.5" />
                {t("bestWithModels")}
              </span>
              {prompt.best_with_models.map((slug) => (
                <span
                  key={slug}
                  className="rounded-full bg-brand-muted px-2.5 py-0.5 text-[11px] font-medium text-brand"
                >
                  {getModelName(slug)}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <UpvoteButton promptId={prompt.id} initialCount={prompt.likes_count} size="lg" label={t("upvotePrompt")} />
            {prompt.link && (
              <Link
                href={prompt.link}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-all hover:bg-brand-hover active:scale-[0.98] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <ExternalLink className="size-4" />
                {t("tryIt")}
              </Link>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">{t("description")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{description}</p>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {prompt.source_contributor ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="size-8 sm:size-10">
                  <AvatarFallback className="text-sm bg-surface-3">{prompt.source_contributor[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">@{prompt.source_contributor}</p>
                  <p className="text-[11px] text-foreground-tertiary">via prompts.chat</p>
                </div>
              </div>
            ) : (
              <Link href={routes.userProfile(prompt.user_id)} className="group flex items-center gap-2 sm:gap-3">
                <Avatar className="size-8 ring-2 ring-brand/15 sm:size-10">
                  <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-sm">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold transition-colors group-hover:text-brand">{prompt.profiles?.full_name ?? prompt.profiles?.username}</p>
                  <p className="font-mono text-[11px] text-foreground-tertiary">@{prompt.profiles?.username ?? prompt.profiles?.full_name}</p>
                </div>
              </Link>
            )}
            {!prompt.source_contributor && <FollowButton userId={prompt.user_id} />}
          </div>
        </div>
      </article>

      {/* Similar Syntaxes */}
      <SimilarSyntaxes currentId={id} t={t} />
    </main>
  );
}

function SimilarSyntaxes({ currentId, t }: { currentId: string; t: (key: string) => string }) {
  const { data: prompts, isLoading } = useFeaturedPrompts(4);

  const similar = prompts?.filter((p) => p.id !== currentId).slice(0, 2);

  if (isLoading) return null;
  if (!similar || similar.length === 0) return null;

  return (
    <section className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground-secondary">
        <Sparkles className="size-3.5 text-brand" />
        {t("similarSyntaxes")}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {similar.map((prompt) => {
          const title = prompt.title;
          const desc = prompt.description;
          const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];
          return (
            <Link key={prompt.id} href={routes.promptDetail(prompt.id)} className="group rounded-lg border border-card-border bg-surface-1 p-3 transition-colors hover:bg-surface-2">
              <div className="mb-2 flex items-start justify-between">
                {tags[0] && <span className="font-mono text-[10px] text-brand">#{tags[0].name}</span>}
                <TrendingUp className="size-3 text-foreground-tertiary transition-colors group-hover:text-brand" />
              </div>
              <h4 className="text-sm font-medium">{title}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-foreground-tertiary">{desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
