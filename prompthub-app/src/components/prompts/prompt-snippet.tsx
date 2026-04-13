"use client";

import { useState, useCallback, useMemo, Fragment } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  extractVariables,
  fillVariables,
  type PromptVariable,
} from "@/lib/prompt-variables";

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
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );

  const variables = useMemo(() => extractVariables(text), [text]);
  const hasVariables = variables.length > 0;

  const filledText = useMemo(
    () =>
      hasVariables ? fillVariables(text, variables, variableValues) : text,
    [text, variables, variableValues, hasVariables]
  );

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(filledText);
      toast.success(t("copied"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [filledText, t]
  );

  const handleVariableChange = useCallback((name: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const CopyIcon = copied ? Check : Copy;

  if (variant === "compact") {
    return (
      <div
        className="relative overflow-hidden rounded-md bg-surface-2"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center justify-between px-2.5 pt-1.5">
          <span className="text-[9px] font-semibold tracking-widest text-foreground-tertiary uppercase">
            {t("promptText")}
          </span>
          <span
            className={`text-[9px] transition-colors ${copied ? "text-green-500" : "text-foreground-tertiary"}`}
          >
            {copied ? "✓" : ""}
          </span>
        </div>
        <div
          dir="ltr"
          className="prompt-code mx-2 mb-1.5 mt-0.5 bg-transparent"
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-5 sm:py-3">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("promptText")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={`h-7 gap-1.5 text-xs ${copied ? "text-green-500 hover:text-green-500" : ""}`}
        >
          <CopyIcon className="size-3.5 transition-transform duration-200" />
          {copied
            ? t("linkCopied")
            : hasVariables
              ? t("filledCopy")
              : t("copyPrompt")}
        </Button>
      </div>

      {/* Variable fill-in section */}
      {hasVariables && (
        <VariableFillSection
          variables={variables}
          values={variableValues}
          onChange={handleVariableChange}
          t={t}
        />
      )}

      {/* Prompt text with highlighted variables */}
      <pre
        dir="ltr"
        className="whitespace-pre-wrap px-3 pb-4 font-mono text-sm leading-relaxed text-primary/90 sm:px-5 sm:pb-6 sm:leading-loose"
      >
        {hasVariables ? (
          <HighlightedText
            text={text}
            variables={variables}
            values={variableValues}
          />
        ) : (
          text
        )}
      </pre>
    </div>
  );
}

function VariableFillSection({
  variables,
  values,
  onChange,
  t,
}: {
  variables: PromptVariable[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  t: ReturnType<typeof useTranslations<"prompt">>;
}) {
  return (
    <div className="mx-3 mb-3 rounded-lg border border-border bg-muted/50 p-3 sm:mx-5 sm:p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-medium">{t("fillVariables")}</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {t("variableCount", { count: variables.length })}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {variables.map((v) => (
          <div key={v.name} className="flex flex-col gap-1">
            <label
              htmlFor={`var-${v.name}`}
              className="text-xs font-medium text-muted-foreground"
            >
              {v.name}
            </label>
            <Input
              id={`var-${v.name}`}
              dir="ltr"
              value={values[v.name] ?? ""}
              onChange={(e) => onChange(v.name, e.target.value)}
              placeholder={v.raw}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightedText({
  text,
  variables,
  values,
}: {
  text: string;
  variables: PromptVariable[];
  values: Record<string, string>;
}) {
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  // Variables are already sorted by position from extractVariables
  for (const v of variables) {
    // Text before this variable
    if (v.start > lastIndex) {
      segments.push(
        <Fragment key={`t-${lastIndex}`}>
          {text.slice(lastIndex, v.start)}
        </Fragment>
      );
    }

    const userValue = values[v.name];
    const isFilled = userValue && userValue.trim() !== "";

    segments.push(
      isFilled ? (
        <span
          key={`v-${v.start}`}
          className="rounded bg-green-500/15 px-0.5 font-semibold text-green-700 dark:text-green-400"
        >
          {userValue}
        </span>
      ) : (
        <span
          key={`v-${v.start}`}
          className="rounded bg-primary/10 px-0.5 text-primary"
        >
          {v.raw}
        </span>
      )
    );

    lastIndex = v.end;
  }

  // Remaining text after last variable
  if (lastIndex < text.length) {
    segments.push(
      <Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>
    );
  }

  return <>{segments}</>;
}
