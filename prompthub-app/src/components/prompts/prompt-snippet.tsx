"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromptSnippetProps = {
  text: string;
  /** "compact" truncates to a preview; "full" shows the entire text */
  variant?: "compact" | "full";
  /** Max characters for compact mode (default 200) */
  maxLength?: number;
};

export function PromptSnippet({
  text,
  variant = "compact",
}: PromptSnippetProps) {
  const t = useTranslations("prompt");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(t("linkCopied"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text, t]);

  const isCompact = variant === "compact";
  const CopyIcon = copied ? Check : Copy;

  if (isCompact) {
    return (
      <div className="overflow-hidden rounded-lg bg-surface-lowest">
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {t("promptText")}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`rounded p-0.5 transition-colors ${copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CopyIcon className="size-3.5 transition-transform duration-200" />
          </button>
        </div>
        <p dir="ltr" className="line-clamp-3 px-3 pt-1 pb-2.5 font-mono text-xs leading-relaxed text-muted-foreground">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 p-px">
      <div className="rounded-xl bg-surface-lowest">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {t("promptText")}
          </span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className={`h-7 gap-1.5 text-xs ${copied ? "text-green-500 hover:text-green-500" : ""}`}>
            <CopyIcon className="size-3.5 transition-transform duration-200" />
            {copied ? t("linkCopied") : t("copyPrompt")}
          </Button>
        </div>
        <pre dir="ltr" className="text-justify whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed text-foreground">
          {text}
        </pre>
      </div>
    </div>
  );
}
