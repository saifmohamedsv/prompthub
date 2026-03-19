---
name: add-or-update-ecc-bundle-file
description: Workflow command scaffold for add-or-update-ecc-bundle-file in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-ecc-bundle-file

Use this workflow when working on **add-or-update-ecc-bundle-file** in `prompthub`.

## Goal

Adds or updates a configuration, command, skill, or agent file in ECC-related directories (.claude, .codex, .agents) to extend or modify the prompthub's capabilities.

## Common Files

- `.claude/commands/*.md`
- `.claude/skills/prompthub/SKILL.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.codex/agents/*.toml`
- `.codex/AGENTS.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update a file in one of the ECC directories (e.g., .claude/commands/, .codex/agents/, .agents/skills/).
- Commit the file with a message referencing the ECC bundle and the specific file.
- Optionally, repeat for related files (e.g., SKILL.md, identity.json, config.toml).

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.