export type PromptVariable = {
  raw: string;
  name: string;
  start: number;
  end: number;
};

/**
 * Detect common placeholder patterns in prompt text and extract variable info.
 *
 * Supported patterns:
 *  - [ANYTHING IN BRACKETS]  (min 2 chars inside, skip markdown-like [a] and URLs)
 *  - {{anything}}            (Handlebars style)
 *  - {ALLCAPS}               (only UPPER_CASE contents, to avoid matching code blocks)
 *  - <ALLCAPS_WITH_UNDERSCORES>  (only UPPER_CASE, to avoid matching HTML tags)
 *  - %NAME%                  (percent-delimited)
 */
export function extractVariables(text: string): PromptVariable[] {
  const results: PromptVariable[] = [];
  const seen = new Set<string>();

  // Order matters — more specific patterns first so they win over generic ones.
  const patterns: RegExp[] = [
    // {{anything}}
    /\{\{(.+?)\}\}/g,
    // [ANYTHING] — at least 2 chars inside, not preceded by ]( which would be a markdown link
    /(?<!\]\()(?<!\()\[([^\]]{2,})\]/g,
    // {ALLCAPS_OR_UNDERSCORES} — must be all uppercase + digits + underscores + spaces
    /\{([A-Z][A-Z0-9_ ]{1,})\}/g,
    // <ALLCAPS_WITH_UNDERSCORES> — must be all uppercase, avoid HTML tags (lowercase)
    /<([A-Z][A-Z0-9_]{1,})>/g,
    // %NAME%
    /%([A-Z][A-Z0-9_ ]{1,})%/g,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const raw = match[0];
      const name = match[1].trim();
      const start = match.index;
      const end = start + raw.length;

      // Skip if this region overlaps with an already-found variable
      const overlaps = results.some(
        (v) => start < v.end && end > v.start
      );
      if (overlaps) continue;

      // Dedupe by name — keep first occurrence only
      if (seen.has(name)) continue;
      seen.add(name);

      results.push({ raw, name, start, end });
    }
  }

  // Sort by position in text
  results.sort((a, b) => a.start - b.start);
  return results;
}

/**
 * Replace variables in text with user-provided values.
 * If a variable has no value provided (empty string or missing), the original raw
 * placeholder is kept.
 */
export function fillVariables(
  text: string,
  variables: PromptVariable[],
  values: Record<string, string>
): string {
  // Work backwards so indices stay correct after replacements
  const sorted = [...variables].sort((a, b) => b.start - a.start);
  let result = text;

  for (const v of sorted) {
    const value = values[v.name];
    if (value && value.trim() !== "") {
      result = result.slice(0, v.start) + value + result.slice(v.end);
    }
  }

  return result;
}
