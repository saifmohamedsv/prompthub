---
name: update-arabic-font-or-typography
description: Workflow command scaffold for update-arabic-font-or-typography in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-arabic-font-or-typography

Use this workflow when working on **update-arabic-font-or-typography** in `prompthub`.

## Goal

Update the Arabic font or adjust typography and font-weight for Arabic locale for improved readability and style consistency.

## Common Files

- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-detail.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit src/app/[locale]/layout.tsx to update font-family or font logic.
- Edit src/lib/fonts.ts to import or switch font definitions.
- Edit src/app/globals.css to adjust global font-weight, font-size, or RTL-specific styles.
- Optionally, update prompt card or detail components for per-component font/size tweaks.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.