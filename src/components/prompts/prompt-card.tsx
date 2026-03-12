"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { Eye, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes } from "@/lib/config";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptWithAuthor }) {
  const locale = useLocale();

  const categoryName = locale === Locale.AR ? prompt.categories?.name_ar : prompt.categories?.name;
  const title = (locale === Locale.AR && prompt.title_ar) ? prompt.title_ar : prompt.title;
  const description = (locale === Locale.AR && prompt.description_ar) ? prompt.description_ar : prompt.description;

  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  const shortDate = new Date(prompt.created_at).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={routes.promptDetail(prompt.id)}
      className="group flex h-full flex-col rounded-xl bg-card shadow-sm ring-1 ring-border transition-all hover:shadow-lg hover:ring-border/80 dark:shadow-lg dark:shadow-black/30 dark:ring-white/5 dark:hover:shadow-xl dark:hover:shadow-black/50 dark:hover:ring-white/10"
    >
      {/* Top row: category + stats */}
      <div className="flex items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4">
        {categoryName && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase">{categoryName}</span>}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {prompt.views_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {shortDate}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div dir="ltr" className="flex flex-wrap gap-1.5 px-3 pt-2.5 sm:px-4">
          {tags.map((tag) => (
            <span key={tag.id} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="line-clamp-2 px-3 pt-3 text-[14px] font-semibold leading-snug sm:px-4 sm:text-[15px]">{title}</h3>

      {/* Description */}
      <p className="line-clamp-2 flex-1 px-3 pt-1.5 text-[12px] leading-relaxed text-muted-foreground sm:px-4 sm:text-[13px]">{description}</p>

      {/* Prompt snippet */}
      {prompt.prompt_text && (
        <div className="mx-3 mt-3 sm:mx-4">
          <PromptSnippet text={prompt.prompt_text} variant="compact" />
        </div>
      )}

      {/* Footer: author + likes */}
      <div className="mt-auto flex items-center justify-between px-3 pt-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
            <AvatarFallback className="text-[10px]">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{prompt.profiles?.full_name ?? prompt.profiles?.username}</span>
        </div>
        <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
      </div>
    </Link>
  );
}
