---
name: update-feature-development-command
description: Workflow command scaffold for update-feature-development-command in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-feature-development-command

Use this workflow when working on **update-feature-development-command** in `prompthub`.

## Goal

Adds or updates the feature-development command markdown file in .claude/commands/, often as part of ECC bundle updates.

## Common Files

- `.claude/commands/feature-development.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/feature-development.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.