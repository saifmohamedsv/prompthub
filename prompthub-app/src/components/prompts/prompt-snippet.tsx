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
    toast.success(t("copied"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text, t]);

  const CopyIcon = copied ? Check : Copy;

  if (variant === "compact") {
    return (
      <div className="relative overflow-hidden rounded-md bg-surface-2" onClick={handleCopy} role="button" tabIndex={0}>
        <div className="flex items-center justify-between px-2.5 pt-1.5">
          <span className="text-[9px] font-semibold tracking-widest text-foreground-tertiary uppercase">
            {t("promptText")}
          </span>
          <span className={`text-[9px] transition-colors ${copied ? "text-green-500" : "text-foreground-tertiary"}`}>
            {copied ? "✓" : ""}
          </span>
        </div>
        <div dir="ltr" className="prompt-code mx-2 mb-1.5 mt-0.5 bg-transparent">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("promptText")}
        </span>
        <Button variant="ghost" size="sm" onClick={handleCopy} className={`h-7 gap-1.5 text-xs ${copied ? "text-green-500 hover:text-green-500" : ""}`}>
          <CopyIcon className="size-3.5 transition-transform duration-200" />
          {copied ? t("linkCopied") : t("copyPrompt")}
        </Button>
      </div>
      <pre dir="ltr" className="whitespace-pre-wrap px-3 pb-4 font-mono text-sm leading-relaxed text-primary/90 sm:px-5 sm:pb-6 sm:leading-loose">
        {text}
      </pre>
    </div>
  );
}
