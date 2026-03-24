"use client";

import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Locale, getCategoryBadgeClass } from "@/lib/config";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes } from "@/lib/config";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptWithAuthor }) {
  const locale = useLocale();
  const isAr = locale === Locale.AR;
  const router = useRouter();

  const categoryName = isAr ? prompt.categories?.name_ar : prompt.categories?.name;
  const title = (isAr && prompt.title_ar) ? prompt.title_ar : prompt.title;
  const description = (isAr && prompt.description_ar) ? prompt.description_ar : prompt.description;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  const shortDate = new Date(prompt.created_at).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-card-border bg-surface-1 p-3 shadow-card transition-all hover:border-brand/20 hover:shadow-md">
      {/* Row 1: Category badge + stats — single line, 11px */}
      <div className="flex items-center justify-between">
        {categoryName && (
          <span className={`rounded-full px-2 py-px text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}>
            {categoryName}
          </span>
        )}
        <div className="flex items-center gap-2 text-[11px] text-foreground-tertiary">
          <span className="inline-flex items-center gap-0.5">
            <Eye className="size-3" />
            {prompt.views_count}
          </span>
          <span>·</span>
          <span>{shortDate}</span>
        </div>
      </div>

      {/* Row 2: Tags — compact chip row */}
      {tags.length > 0 && (
        <div className="relative z-10 mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => router.push(routes.home + "?tag=" + tag.slug)}
              className="rounded-md bg-surface-3 px-2 py-px text-[10px] font-medium text-foreground-secondary transition-colors hover:bg-brand-muted hover:text-brand"
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Row 3: Title — 14px, weight 500, 2-line clamp, tight leading */}
      <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-tight transition-colors group-hover:text-brand">
        <Link
          href={routes.promptDetail(prompt.id)}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
      </h3>

      {/* Row 4: Description — 12px, secondary color, 2-line clamp */}
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-foreground-secondary">
        {description}
      </p>

      {/* Row 5: Prompt snippet — max 70px, monospace, fade mask, brand left border */}
      {prompt.prompt_text && (
        <div className="relative z-10 mt-2">
          <PromptSnippet text={prompt.prompt_text} variant="compact" />
        </div>
      )}

      {/* Row 6: Footer — 20px avatar + 11px author left, heart + count right */}
      <div className="relative z-10 mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(routes.userProfile(prompt.user_id))}
          className="group/author flex items-center gap-1.5 transition-colors"
        >
          <Avatar className="size-5 ring-1 ring-transparent transition-all group-hover/author:ring-brand/30">
            <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
            <AvatarFallback className="text-[8px]">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-foreground-tertiary transition-colors group-hover/author:text-foreground">
            {prompt.profiles?.full_name ?? prompt.profiles?.username}
          </span>
        </button>
        <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
      </div>
    </article>
  );
}
