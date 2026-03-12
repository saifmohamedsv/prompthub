"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromptSnippetProps = {
  text: string;
  /** "compact" truncates to a preview; "full" shows the entire text */
  variant?: "compact" | "full";
  /** Max characters for compact mode (default 130) */
  maxLength?: number;
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max);
  return text.slice(0, cut > 0 ? cut : max) + "…";
}

export function PromptSnippet({
  text,
  variant = "compact",
  maxLength = 130,
}: PromptSnippetProps) {
  const t = useTranslations("prompt");

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(t("linkCopied"));
  }

  const displayText = variant === "compact" ? truncate(text, maxLength) : text;
  const isCompact = variant === "compact";

  return (
    <div className="overflow-hidden rounded-lg bg-muted/70 dark:bg-muted/40">
      <div className={`flex items-center justify-between ${isCompact ? "px-3 pt-2" : "border-b border-border/50 px-4 py-2.5"}`}>
        <span className="text-2xs font-semibold tracking-widest text-muted-foreground uppercase sm:text-xs">
          {t("promptText")}
        </span>
        {isCompact ? (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="size-3.5" />
          </button>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
            <Copy className="size-3.5" />
            {t("copyPrompt")}
          </Button>
        )}
      </div>
      {isCompact ? (
        <p dir="ltr" className="px-3 pt-1 pb-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
          {displayText}
        </p>
      ) : (
        <pre dir="ltr" className="text-justify whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed text-foreground">
          {displayText}
        </pre>
      )}
    </div>
  );
}
