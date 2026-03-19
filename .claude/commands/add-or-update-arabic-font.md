---
name: add-or-update-arabic-font
description: Workflow command scaffold for add-or-update-arabic-font in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-arabic-font

Use this workflow when working on **add-or-update-arabic-font** in `prompthub`.

## Goal

Switching the Arabic font used in the application for improved typography and readability.

## Common Files

- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update src/app/[locale]/layout.tsx to use the new font.
- Update src/lib/fonts.ts to import and configure the new font.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.