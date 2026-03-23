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
import { ExternalLink, ArrowLeft, Eye } from "lucide-react";
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
      <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
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
    <div className="mx-auto max-w-3xl px-4 sm:px-0">
      <Link href={routes.explore} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        {tCommon("backToExplore")}
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-2">
          {prompt.categories && (
            <span className="rounded-full bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary">
              {categoryName}
            </span>
          )}
          {tags.map((tag) => (
            <Link key={tag.id} href={routes.explore + "?tag=" + tag.slug}>
              <span className="rounded-full bg-surface-highest px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                {tag.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {prompt.views_count} {t("views")}
          </span>
          <span>
            {new Date(prompt.created_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-6">
        <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
        {prompt.link && (
          <Link
            href={prompt.link}
            target="_blank"
            className="inline-flex items-center gap-1 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md transition-all hover:brightness-110"
          >
            <ExternalLink className="size-4" />
            {t("tryIt")}
          </Link>
        )}
      </div>

      {prompt.image_url && (
        <div className="overflow-hidden rounded-lg pt-8">
          <Image src={prompt.image_url} alt={title} className="max-h-64 w-full rounded-lg object-cover" width={600} height={256} />
        </div>
      )}

      <h2 className="pt-8 pb-3 text-xl font-bold">{t("description")}</h2>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">{description}</p>

      {prompt.prompt_text && (
        <div className="pt-8">
          <h2 className="pb-3 text-xl font-bold">{t("promptSyntax")}</h2>
          <PromptSnippet text={prompt.prompt_text} variant="full" />
        </div>
      )}

      <div className="flex items-center justify-between pt-8 pb-4">
        <Link href={routes.userProfile(prompt.user_id)} className="group flex items-center gap-3">
          <Avatar className="size-14 ring-2 ring-primary/20">
            <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
            <AvatarFallback>{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold group-hover:underline">{prompt.profiles?.full_name ?? prompt.profiles?.username}</p>
            <p className="text-sm text-muted-foreground">
              @{prompt.profiles?.username ?? prompt.profiles?.full_name}
            </p>
          </div>
        </Link>
        <button
          type="button"
          className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium md:flex"
        >
          {t("followCreator")}
        </button>
      </div>
    </div>
  );
}
