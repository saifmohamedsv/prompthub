---
name: add-or-update-ecc-bundle
description: Workflow command scaffold for add-or-update-ecc-bundle in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-ecc-bundle

Use this workflow when working on **add-or-update-ecc-bundle** in `prompthub`.

## Goal

Adds or updates an ECC bundle, including commands, identity, skills, and tools for prompthub.

## Common Files

- `.claude/commands/add-or-update-ecc-bundle.md`
- `.claude/identity.json`
- `.claude/skills/prompthub/SKILL.md`
- `.claude/ecc-tools.json`
- `.agents/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/agents/openai.yaml`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/add-or-update-ecc-bundle.md
- Add or update .claude/identity.json
- Add or update .claude/skills/prompthub/SKILL.md
- Add or update .claude/ecc-tools.json
- Add or update .agents/skills/prompthub/SKILL.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.