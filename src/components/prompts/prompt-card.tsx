"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import type { PromptWithAuthor } from "@/types/prompt";

export function PromptCard({ prompt }: { prompt: PromptWithAuthor }) {
  const t = useTranslations("prompt");

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {prompt.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <Link
          href={`/prompt/${prompt.id}`}
          className="line-clamp-1 text-lg font-semibold hover:text-primary"
        >
          {prompt.title}
        </Link>
        {prompt.categories && (
          <Badge variant="secondary" className="w-fit">
            {prompt.categories.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {prompt.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={prompt.profiles?.avatar_url ?? undefined} />
            <AvatarFallback>
              {prompt.profiles?.full_name?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span>
            {t("by")} {prompt.profiles?.full_name ?? prompt.profiles?.username}
          </span>
        </div>
        <LikeButton promptId={prompt.id} initialCount={prompt.likes_count} />
      </CardFooter>
    </Card>
  );
}
