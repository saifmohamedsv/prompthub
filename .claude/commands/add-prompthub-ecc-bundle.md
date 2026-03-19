---
name: add-prompthub-ecc-bundle
description: Workflow command scaffold for add-prompthub-ecc-bundle in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-prompthub-ecc-bundle

Use this workflow when working on **add-prompthub-ecc-bundle** in `prompthub`.

## Goal

Adds a new ECC bundle for prompthub, including commands, skills, identity, and agent configuration files.

## Common Files

- `.claude/commands/*.md`
- `.claude/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/SKILL.md`
- `.claude/ecc-tools.json`
- `.claude/identity.json`
- `.agents/skills/prompthub/agents/openai.yaml`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update .claude/commands/*.md files for new commands or updates.
- Add or update .claude/skills/prompthub/SKILL.md.
- Add or update .agents/skills/prompthub/SKILL.md.
- Add or update .claude/ecc-tools.json.
- Add or update .claude/identity.json.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.