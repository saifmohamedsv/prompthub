"use client";

import { useTranslations } from "next-intl";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Logo } from "@/components/logo";

export function LoginView() {
  const t = useTranslations("auth");

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background gradient glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] start-[10%] h-[50%] w-[40%] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] end-[5%] h-[40%] w-[35%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md mx-auto rounded-xl bg-surface-2/80 backdrop-blur-sm p-6 shadow-lg">
        {/* Logo area */}
        <div className="flex flex-col items-center">
          <div className="pt-3">
            <Logo size="md" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center pt-5">{t("loginTitle")}</h1>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground text-center pt-2">{t("loginSubtitle")}</p>

        {/* Auth buttons */}
        <div className="pt-6">
          <SocialAuthButtons />
        </div>

        {/* Terms text */}
        <p className="text-xs text-muted-foreground text-center pt-6">{t("termsText")}</p>
      </div>
    </main>
  );
}
