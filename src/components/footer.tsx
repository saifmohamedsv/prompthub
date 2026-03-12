import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>
        <p>
          {t("madeBy")}{" "}
          <a
            href={siteConfig.developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {siteConfig.developer.name}
          </a>
        </p>
      </div>
    </footer>
  );
}
