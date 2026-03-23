"use client";

import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { Eye, Calendar } from "lucide-react";
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
    <article className="group relative flex h-full flex-col gap-5 rounded-xl border border-border/5 bg-surface-low p-5 transition-colors hover:bg-surface-high sm:gap-6 sm:p-6">
      {/* Top row: category + stats */}
      <div className="flex items-center justify-between">
        {categoryName && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary sm:text-xs">
            {categoryName}
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {prompt.views_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {shortDate}
          </span>
        </div>
      </div>

      {/* Tags + Title + Description */}
      <div className="space-y-3">
        {tags.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => router.push(routes.explore + "?tag=" + tag.slug)}
                className="text-[10px] font-bold uppercase tracking-wider text-tertiary transition-colors hover:text-primary"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug transition-colors group-hover:text-primary sm:text-xl">
          <Link
            href={routes.promptDetail(prompt.id)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Prompt snippet */}
      {prompt.prompt_text && (
        <div className="relative z-10">
          <PromptSnippet text={prompt.prompt_text} variant="compact" />
        </div>
      )}

      {/* Footer: author + likes */}
      <div className="relative z-10 mt-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(routes.userProfile(prompt.user_id))}
          className="group/author -mx-1.5 -my-1 flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted/60"
        >
          <Avatar className="size-7 ring-2 ring-transparent transition-all group-hover/author:ring-primary/30">
            <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground transition-colors group-hover/author:text-foreground group-hover/author:underline">
            {prompt.profiles?.full_name ?? prompt.profiles?.username}
          </span>
        </button>
        <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
      </div>
    </article>
  );
}
