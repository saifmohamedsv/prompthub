"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Copy, Check, Eye, Heart, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/prompts/like-button";
import { usePromptDetail } from "@/hooks/use-prompts";
import { Locale, getCategoryBadgeClass, routes } from "@/lib/config";

export function PromptPreviewSheet({
  promptId,
  onClose,
}: {
  promptId: string | null;
  onClose: () => void;
}) {
  const isOpen = promptId !== null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        {promptId && <PreviewContent promptId={promptId} />}
      </SheetContent>
    </Sheet>
  );
}

function PreviewContent({ promptId }: { promptId: string }) {
  const t = useTranslations("preview");
  const tp = useTranslations("prompt");
  const locale = useLocale();
  const isAr = locale === Locale.AR;
  const { data: prompt, isLoading } = usePromptDetail(promptId);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!prompt?.prompt_text) return;
    navigator.clipboard.writeText(prompt.prompt_text);
    toast.success(t("copied"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return <PreviewSkeleton />;
  }

  if (!prompt) return null;

  const title = isAr && prompt.title_ar ? prompt.title_ar : prompt.title;
  const description =
    isAr && prompt.description_ar ? prompt.description_ar : prompt.description;
  const categoryName = isAr
    ? prompt.categories?.name_ar
    : prompt.categories?.name;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <SheetHeader className="p-0">
        {/* Category badge + tags */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryName && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(prompt.categories?.slug)}`}
            >
              {categoryName}
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md bg-surface-3 px-2 py-0.5 text-[10px] font-medium text-foreground-secondary"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <SheetTitle className="text-xl font-bold leading-tight">
          {title}
        </SheetTitle>

        {/* Description */}
        {description && (
          <SheetDescription className="text-sm leading-relaxed text-foreground-secondary">
            {description}
          </SheetDescription>
        )}
      </SheetHeader>

      {/* Prompt text block */}
      {prompt.prompt_text && (
        <div className="rounded-xl border border-border/5 bg-surface-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[10px] font-semibold tracking-widest text-foreground-tertiary uppercase">
              {tp("promptText")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`h-7 gap-1.5 text-xs ${copied ? "text-green-500 hover:text-green-500" : ""}`}
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? t("copied") : t("copy")}
            </Button>
          </div>
          <pre
            dir="ltr"
            className="max-h-60 overflow-y-auto whitespace-pre-wrap px-4 pb-4 font-mono text-sm leading-relaxed text-primary/90"
          >
            {prompt.prompt_text}
          </pre>
        </div>
      )}

      {/* Author row */}
      <Link
        href={routes.userProfile(prompt.user_id)}
        className="flex items-center gap-2 transition-colors hover:text-primary"
      >
        <Avatar className="size-7 ring-1 ring-transparent transition-all hover:ring-brand/30">
          <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
          <AvatarFallback className="text-[10px]">
            {prompt.profiles?.full_name?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {prompt.profiles?.full_name ?? prompt.profiles?.username}
          </span>
        </div>
      </Link>

      {/* Stats + Like */}
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1 text-sm text-foreground-tertiary">
          <Eye className="size-4" />
          {prompt.views_count} {tp("views")}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-foreground-tertiary">
          <Heart className="size-4" />
          {prompt.likes_count} {tp("likes")}
        </span>
        <div className="ms-auto">
          <LikeButton
            promptId={prompt.id}
            initialCount={prompt.likes_count}
            size="lg"
            label={tp("likePrompt")}
          />
        </div>
      </div>

      {/* Open full page link */}
      <Link
        href={routes.promptDetail(prompt.id)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
      >
        <ExternalLink className="size-4" />
        {t("openFull")}
      </Link>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="rounded-xl border border-border/5 bg-surface-2 p-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
        <Skeleton className="mt-2 h-3 w-3/4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
