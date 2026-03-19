---
name: add-prompthub-ecc-bundle
description: Workflow command scaffold for add-prompthub-ecc-bundle in prompthub.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-prompthub-ecc-bundle

Use this workflow when working on **add-prompthub-ecc-bundle** in `prompthub`.

## Goal

Adds or updates a set of ECC (Extensible Command/Capability) bundle files for the prompthub project, including commands, agent configs, skills, and related metadata.

## Common Files

- `.claude/commands/*.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.claude/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/agents/openai.yaml`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update one or more markdown files under .claude/commands/ (e.g., add-or-update-ecc-bundle.md, feature-development.md, refactoring.md, etc.)
- Add or update .claude/identity.json
- Add or update .claude/ecc-tools.json
- Add or update .claude/skills/prompthub/SKILL.md
- Add or update .agents/skills/prompthub/SKILL.md

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.