import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginView />;
}

function LoginView() {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("loginSubtitle")}</p>
        </div>

        <SocialAuthButtons />
      </div>
    </main>
  );
}
