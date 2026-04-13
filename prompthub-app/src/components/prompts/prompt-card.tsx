"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Copy, Eye, Share2, Cpu } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpvoteButton } from "@/components/prompts/upvote-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes, getModelName } from "@/lib/config";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptWithAuthor }) {
  const router = useRouter();
  const tPrompt = useTranslations("prompt");
  const tExplore = useTranslations("explore");

  const title = prompt.title;
  const description = prompt.description;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  const shortDate = new Date(prompt.created_at).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative flex flex-col rounded-xl border border-card-border bg-surface-1 p-3 shadow-card transition-all hover:border-brand/20 hover:shadow-md">
      {/* Type badge */}
      <span className="absolute top-2 left-2 z-10 rounded-md bg-surface-3/90 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-foreground-secondary backdrop-blur-sm">
        {prompt.type === "image" ? tExplore("typeImage") : prompt.type === "video" ? tExplore("typeVideo") : tExplore("typeText")}
      </span>

      {/* Row 1: stats */}
      <div className="flex flex-wrap items-center justify-between gap-y-1">
        <div className="flex items-center gap-1.5">
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[11px] text-foreground-tertiary">
          <span className="inline-flex items-center gap-0.5">
            <Eye className="size-3" />
            {prompt.views_count}
          </span>
          <span>·</span>
          <span>{shortDate}</span>
        </div>
      </div>

      {/* Row 3: Title — 14px, weight 500, 2-line clamp, tight leading */}
      <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-tight transition-colors group-hover:text-brand">
        <Link href={routes.promptDetail(prompt.id)} className="font-semibold after:absolute after:inset-0 after:content-['']">
          {title}
        </Link>
      </h3>

      {/* Row 4: Description — 12px, secondary color, 2-line clamp */}
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-foreground-secondary">{description}</p>

      {/* Row 5: Prompt snippet — max 70px, monospace, fade mask, brand left border */}
      {prompt.prompt_text && (
        <div className="relative z-10 mt-2">
          <PromptSnippet text={prompt.prompt_text} variant="compact" />
        </div>
      )}

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

      {/* Best with models */}
      {prompt.best_with_models && prompt.best_with_models.length > 0 && (
        <div className="relative z-10 mt-2 flex flex-wrap items-center gap-1.5">
          <Cpu className="size-3 text-foreground-tertiary" />
          {prompt.best_with_models.map((slug) => (
            <span
              key={slug}
              className="rounded-md bg-brand-muted px-1.5 py-px text-[10px] font-medium text-brand"
            >
              {getModelName(slug)}
            </span>
          ))}
        </div>
      )}

      {/* Row 6: Footer — author left, like right */}
      <div className="relative z-10 mt-2 flex items-center justify-between">
        {prompt.source_contributor ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-foreground-tertiary">
            <Avatar className="size-5 shrink-0">
              <AvatarFallback className="text-[8px] bg-surface-3">{prompt.source_contributor[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate">@{prompt.source_contributor}</span>
          </span>
        ) : (
          <button type="button" onClick={() => router.push(routes.userProfile(prompt.user_id))} className="group/author flex min-w-0 items-center gap-1.5 transition-colors">
            <Avatar className="size-5 shrink-0 ring-1 ring-transparent transition-all group-hover/author:ring-brand/30">
              <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
              <AvatarFallback className="text-[8px]">{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <span className="truncate text-[11px] text-foreground-tertiary transition-colors group-hover/author:text-foreground">@{prompt.profiles?.username ?? prompt.profiles?.full_name}</span>
          </button>
        )}
        <div className="flex shrink-0 items-center gap-1">
          {prompt.prompt_text && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(prompt.prompt_text!);
                toast.success(tPrompt("copied"));
              }}
              className="rounded-md p-1 text-foreground-tertiary transition-colors hover:bg-surface-3 hover:text-foreground"
            >
              <Copy className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.origin + routes.promptDetail(prompt.id));
              toast.success(tPrompt("linkCopied"));
            }}
            className="rounded-md p-1 text-foreground-tertiary transition-colors hover:bg-surface-3 hover:text-foreground"
          >
            <Share2 className="size-3.5" />
          </button>
          <UpvoteButton promptId={prompt.id} initialCount={prompt.likes_count} />
        </div>
      </div>
    </article>
  );
}
