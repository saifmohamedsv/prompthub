import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/config";
import { Github, Globe } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border/50 bg-surface-lowest">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-6 text-center">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          <a
            href={siteConfig.developer.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Portfolio"
          >
            <Globe className="size-4" />
          </a>
        </div>

        {/* Credit */}
        <p className="text-xs text-muted-foreground/80">
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

        {/* Version */}
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/50">
          {t("version")}
        </span>
      </div>
    </footer>
  );
}
