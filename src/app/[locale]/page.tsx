import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  // unwrap params synchronously via the hook pattern — Next.js 15 will
  // make params a plain object in server components after the first render
  return <HomeContent params={params} />;
}

async function HomeContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeView />;
}

function HomeView() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        PromptHub
      </div>

      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>

      <p className="max-w-xl text-lg text-muted-foreground">{t("subtitle")}</p>

      <div className="flex gap-4">
        <Button size={"lg"}>
          <Link href={"/explore"}>{t("exploreButton")}</Link>
        </Button>
        <Button size={"lg"} variant={"outline"}>
          <Link href={"my-prompts/new"}>{t("shareButton")}</Link>
        </Button>
      </div>
    </main>
  );
}
