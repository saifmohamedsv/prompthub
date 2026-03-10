"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { usePromptDetail, useIncrementViews } from "@/hooks/use-prompts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { ExternalLink, ArrowLeft, Copy, Eye } from "lucide-react";
import Image from "next/image";

export function PromptDetail({ id }: { id: string }) {
  const t = useTranslations("prompt");
  const tNav = useTranslations("common");
  const locale = useLocale();
  const { data: prompt, isLoading } = usePromptDetail(id);
  const { mutate: incrementViews } = useIncrementViews();

  // Increment views on mount
  useEffect(() => {
    if (id) incrementViews(id);
  }, [id, incrementViews]);

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">Prompt not found</p>
      </div>
    );
  }

  const categoryName = locale === "ar" ? prompt.categories?.name_ar : prompt.categories?.name;

  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  function handleCopyPrompt() {
    if (prompt?.prompt_text) {
      navigator.clipboard.writeText(prompt.prompt_text);
      toast.success(t("linkCopied"));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {tNav("back")}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">{prompt.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {prompt.categories && <Badge variant="secondary">{categoryName}</Badge>}
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
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
            <div className="flex shrink-0 gap-2">
              <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
              {prompt.link && (
                <Button variant="outline" size="sm">
                  <Link href={prompt.link} target="_blank" className="inline-flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    {t("tryIt")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 pt-6">
          {prompt.image_url && (
            <div className="overflow-hidden rounded-lg">
              <Image src={prompt.image_url} alt={prompt.title} className="w-full object-cover"  width={600} height={400} />
            </div>
          )}

          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{prompt.description}</p>

          {/* Prompt text block */}
          {prompt.prompt_text && (
            <div className="overflow-hidden rounded-lg bg-muted/70 dark:bg-muted/40">
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t("promptText")}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyPrompt} className="h-7 gap-1.5 text-xs">
                  <Copy className="h-3.5 w-3.5" />
                  {t("copyPrompt")}
                </Button>
              </div>
              <pre dir="ltr" className="text-justify whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed text-foreground">
                {prompt.prompt_text}
              </pre>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
              <AvatarFallback>{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{prompt.profiles?.full_name ?? prompt.profiles?.username}</p>
              <p className="text-xs text-muted-foreground">
                {t("by")} {prompt.profiles?.username ?? prompt.profiles?.full_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
