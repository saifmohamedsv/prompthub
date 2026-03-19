---
name: add-or-update-prompthub-ecc-bundle
description: Workflow command scaffold for add-or-update-prompthub-ecc-bundle in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-prompthub-ecc-bundle

Use this workflow when working on **add-or-update-prompthub-ecc-bundle** in `prompthub`.

## Goal

Adds or updates the prompthub ECC bundle, including commands, skills, identity, and agent configuration files.

## Common Files

- `.claude/commands/add-or-update-ecc-bundle.md`
- `.claude/commands/add-or-update-command-md.md`
- `.claude/commands/feature-development.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.claude/skills/prompthub/SKILL.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/add-or-update-ecc-bundle.md
- Add or update .claude/commands/add-or-update-command-md.md
- Add or update .claude/commands/feature-development.md
- Add or update .claude/identity.json
- Add or update .claude/ecc-tools.json

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.