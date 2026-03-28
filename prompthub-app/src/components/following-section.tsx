"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useFollowFeed } from "@/hooks/use-follows";
import { PromptCard } from "@/components/prompts/prompt-card";
import { routes } from "@/lib/config";
import { Users } from "lucide-react";

export function FollowingSection() {
  const t = useTranslations("explore");
  const { user } = useAuth();
  const { data } = useFollowFeed(4);

  if (!user) return null;
  if (!data || data.length === 0) return null;

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-bold tracking-tight">{t("followingTitle")}</h2>
          </div>
          <Link href={routes.feed} className="text-xs text-muted-foreground transition-colors hover:text-primary">
            {t("followingSeeAll")}
          </Link>
        </div>

        <div className="flex gap-3 justify-between overflow-x-auto pb-2 scrollbar-hide">
          {data.map((prompt) => (
            <div key={prompt.id} className="w-60 shrink-0 sm:w-70">
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      </section>
      <div className="border-b border-border/40 mb-6" />
    </>
  );
}
