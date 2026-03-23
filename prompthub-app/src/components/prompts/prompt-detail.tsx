"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { usePromptDetail, useIncrementViews } from "@/hooks/use-prompts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { PromptSnippet } from "@/components/prompts/prompt-snippet";
import { routes } from "@/lib/config";
import { ExternalLink, ArrowLeft, Eye } from "lucide-react";
import Image from "next/image";

export function PromptDetail({ id }: { id: string }) {
  const t = useTranslations("prompt");
  const tNav = useTranslations("common");
  const locale = useLocale();
  const { data: prompt, isLoading } = usePromptDetail(id);
  const { mutate: incrementViews } = useIncrementViews();

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

  const categoryName = locale === Locale.AR ? prompt.categories?.name_ar : prompt.categories?.name;
  const title = (locale === Locale.AR && prompt.title_ar) ? prompt.title_ar : prompt.title;
  const description = (locale === Locale.AR && prompt.description_ar) ? prompt.description_ar : prompt.description;
  const tags = prompt.prompt_tags?.map((pt) => pt.tags) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-0">
      <Link href={routes.explore} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        {tNav("back")}
      </Link>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {prompt.categories && <Badge variant="secondary">{categoryName}</Badge>}
                {tags.map((tag) => (
                  <Link key={tag.id} href={routes.explore + "?tag=" + tag.slug}>
                    <Badge variant="outline" className="transition-colors hover:bg-primary/10 hover:text-primary">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            <div className="flex shrink-0 gap-2">
              <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
              {prompt.link && (
                <Button variant="outline" size="sm">
                  <Link href={prompt.link} target="_blank" className="inline-flex items-center gap-1">
                    <ExternalLink className="size-4" />
                    {t("tryIt")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 px-4 pt-6 sm:px-6">
          {prompt.image_url && (
            <div className="overflow-hidden rounded-lg">
              <Image src={prompt.image_url} alt={title} className="max-h-64 w-full rounded-lg object-cover" width={600} height={256} />
            </div>
          )}

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">{description}</p>

          {prompt.prompt_text && (
            <PromptSnippet text={prompt.prompt_text} variant="full" />
          )}

          <Separator />

          <Link href={routes.userProfile(prompt.user_id)} className="group flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
              <AvatarFallback>{prompt.profiles?.full_name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium group-hover:underline">{prompt.profiles?.full_name ?? prompt.profiles?.username}</p>
              <p className="text-xs text-muted-foreground">
                {t("by")} {prompt.profiles?.username ?? prompt.profiles?.full_name}
              </p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
