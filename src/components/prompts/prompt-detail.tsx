"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/prompts/like-button";
import { ExternalLink } from "lucide-react";

export function PromptDetail({ id }: { id: string }) {
  const t = useTranslations("prompt");

  // Placeholder — will fetch from Supabase
  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex gap-2">
            <LikeButton promptId={id} initialCount={0} />
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
              {t("tryIt")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">
        <Skeleton className="h-48 w-full rounded-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
