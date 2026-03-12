"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/config";

export function UserAvatar() {
  const t = useTranslations("nav");
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm">
        <Link href={routes.login}>{t("login")}</Link>
      </Button>
    );
  }

  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url;
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>{displayName?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={routes.myPrompts} />}>{t("myPrompts")}</DropdownMenuItem>
        <DropdownMenuItem render={<Link href={routes.likes} />}>{t("likes")}</DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            window.location.href = routes.home;
          }}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
