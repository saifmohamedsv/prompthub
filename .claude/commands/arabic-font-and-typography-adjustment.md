---
name: arabic-font-and-typography-adjustment
description: Workflow command scaffold for arabic-font-and-typography-adjustment in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /arabic-font-and-typography-adjustment

Use this workflow when working on **arabic-font-and-typography-adjustment** in `prompthub`.

## Goal

Updates Arabic font, typography tokens, and related UI for RTL/Arabic support, often involving global CSS and prompt card components.

## Common Files

- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-snippet.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/components/prompts/prompt-form.tsx`
- `src/app/[locale]/layout.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit src/app/globals.css to adjust font weights, typography tokens, or add global RTL overrides
- Edit src/components/prompts/prompt-card.tsx to update text sizes, icon sizes, or font-weight for Arabic
- Optionally edit src/components/prompts/prompt-snippet.tsx, src/components/prompts/prompt-detail.tsx, src/components/prompts/prompt-form.tsx for related RTL or font changes
- Optionally edit src/app/[locale]/layout.tsx and src/lib/fonts.ts to change font families (e.g., switch to Cairo)
- Commit with message referencing Arabic font, typography, or RTL

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.