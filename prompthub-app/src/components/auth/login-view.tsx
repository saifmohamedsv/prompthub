"use client";

import { useTranslations } from "next-intl";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Logo } from "@/components/logo";

export function LoginView() {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{t("loginTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("loginSubtitle")}</p>
          </div>
        </div>

        <SocialAuthButtons />
      </div>
    </main>
  );
}
