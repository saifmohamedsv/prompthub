"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Eye, Calendar, Copy } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptWithAuthor }) {
  const t = useTranslations("prompt");
  const locale = useLocale();

  const categoryName = locale === "ar" ? prompt.categories?.name_ar : prompt.categories?.name;

  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  const shortDate = new Date(prompt.created_at).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  const SNIPPET_LIMIT = 130;
  const snippetText = (() => {
    if (!prompt.prompt_text) return "";
    if (prompt.prompt_text.length <= SNIPPET_LIMIT) return prompt.prompt_text;
    // Cut at the last space before the limit so we don't break mid-word
    const cut = prompt.prompt_text.lastIndexOf(" ", SNIPPET_LIMIT);
    return prompt.prompt_text.slice(0, cut > 0 ? cut : SNIPPET_LIMIT) + "…";
  })();

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (prompt.prompt_text) {
      navigator.clipboard.writeText(prompt.prompt_text);
      toast.success(t("linkCopied"));
    }
  }

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group flex h-full flex-col rounded-xl bg-card shadow-sm ring-1 ring-border transition-all hover:shadow-lg hover:ring-border/80 dark:shadow-md dark:shadow-black/25 dark:ring-white/4 dark:hover:shadow-lg dark:hover:shadow-black/40 dark:hover:ring-white/4"
    >
      {/* Top row: category + stats */}
      <div className="flex items-center justify-between px-4 pt-4">
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
        <div className="flex flex-wrap gap-1.5 px-4 pt-2.5">
          {tags.map((tag) => (
            <span key={tag.id} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="line-clamp-2 px-4 pt-3 text-[15px] font-semibold leading-snug">{prompt.title}</h3>

      {/* Description */}
      <p className="line-clamp-2 flex-1 px-4 pt-1.5 text-[13px] leading-relaxed text-muted-foreground">{prompt.description}</p>

      {/* Prompt snippet */}
      {prompt.prompt_text && (
        <div className="mx-4 mt-3 overflow-hidden rounded-lg bg-muted/70 dark:bg-muted/40">
          <div className="flex items-center justify-between px-3 pt-2">
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">{t("promptText")}</span>
            <button type="button" onClick={handleCopy} className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p dir="ltr" className="px-3 pt-1 pb-2.5 font-mono text-[12px] leading-relaxed text-muted-foreground">
            {snippetText}
          </p>
        </div>
      )}

      {/* Footer: author + likes */}
      <div className="mt-auto flex items-center justify-between px-4 pt-3 pb-4">
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
