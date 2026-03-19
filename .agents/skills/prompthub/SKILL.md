---
name: prompthub-conventions
description: Development conventions and patterns for prompthub. TypeScript Next.js project with conventional commits.
---

# Prompthub Conventions

> Generated from [saifmohamedsv/prompthub](https://github.com/saifmohamedsv/prompthub) on 2026-03-19

## Overview

This skill teaches Claude the development patterns and conventions used in prompthub.

## Tech Stack

- **Primary Language**: TypeScript
- **Framework**: Next.js
- **Architecture**: type-based module organization
- **Test Location**: separate

## When to Use This Skill

Activate this skill when:
- Making changes to this repository
- Adding new features following established patterns
- Writing tests that match project conventions
- Creating commits with proper message format

## Commit Conventions

Follow these commit message conventions based on 163 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `refactor`
- `chore`

### Message Guidelines

- Average message length: ~61 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/add-or-update-command-md.md)
```

*Commit message example*

```text
fix: streamline LocaleLayout function and improve formatting
```

*Commit message example*

```text
refactor: comment out Google sign-in button in SocialAuthButtons component
```

*Commit message example*

```text
perf: configure cache strategies for all data hooks
```

*Commit message example*

```text
chore: update i18n messages for new features
```

*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/add-or-update-ecc-bundle.md)
```

*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/feature-development.md)
```

*Commit message example*

```text
feat: add prompthub ECC bundle (.codex/agents/docs-researcher.toml)
```

## Architecture

### Project Structure: Single Package

This project uses **type-based** module organization.

### Source Layout

```
src/
├── app/
├── components/
├── hooks/
├── i18n/
├── lib/
├── types/
```

### Configuration Files

- `package.json`
- `tsconfig.json`

### Guidelines

- Group code by type (components, services, utils)
- Keep related functionality in the same type folder
- Avoid circular dependencies between type folders

## Code Style

### Language: TypeScript

### Naming Conventions

| Element | Convention |
|---------|------------|
| Files | camelCase |
| Functions | camelCase |
| Classes | PascalCase |
| Constants | SCREAMING_SNAKE_CASE |

### Import Style: Path Aliases (@/, ~/)

### Export Style: Default Exports


*Preferred import style*

```typescript
// Use path aliases for imports
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
```

*Preferred export style*

```typescript
// Use default exports for main component/function
export default function UserProfile() { ... }
```

## Error Handling

### Error Handling Style: Try-Catch Blocks


*Standard error handling pattern*

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('User-friendly message')
}
```

## Common Workflows

These workflows were detected from analyzing commit patterns.

### Feature Development

Standard feature implementation workflow

**Frequency**: ~30 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Example commit sequence**:
```
feat: add prompthub ECC bundle (.codex/agents/explorer.toml)
feat: add prompthub ECC bundle (.codex/agents/docs-researcher.toml)
feat: add prompthub ECC bundle (.codex/agents/reviewer.toml)
```

### Add Or Update Command Md Workflow

Adds or updates a command markdown file for prompthub ECC bundle.

**Frequency**: ~4 times per month

**Steps**:
1. Create or update a file in .claude/commands/ with a name like add-or-update-command-md.md
2. Commit the file with a message referencing the ECC bundle

**Files typically involved**:
- `.claude/commands/add-or-update-command-md.md`

**Example commit sequence**:
```
Create or update a file in .claude/commands/ with a name like add-or-update-command-md.md
Commit the file with a message referencing the ECC bundle
```

### Add Or Update Ecc Bundle Command Workflow

Adds or updates a command file specifically for ECC bundle management.

**Frequency**: ~3 times per month

**Steps**:
1. Create or update a file in .claude/commands/ with a name like add-or-update-ecc-bundle.md
2. Commit the file with a message referencing the ECC bundle

**Files typically involved**:
- `.claude/commands/add-or-update-ecc-bundle.md`

**Example commit sequence**:
```
Create or update a file in .claude/commands/ with a name like add-or-update-ecc-bundle.md
Commit the file with a message referencing the ECC bundle
```

### Feature Development Command Workflow

Adds or updates the feature-development command file for prompthub ECC bundle.

**Frequency**: ~5 times per month

**Steps**:
1. Create or update .claude/commands/feature-development.md
2. Commit the file with a message referencing the ECC bundle

**Files typically involved**:
- `.claude/commands/feature-development.md`

**Example commit sequence**:
```
Create or update .claude/commands/feature-development.md
Commit the file with a message referencing the ECC bundle
```

### Add Skill Md Workflow

Adds or updates SKILL.md files for prompthub skills in both .agents and .claude directories.

**Frequency**: ~4 times per month

**Steps**:
1. Create or update .agents/skills/prompthub/SKILL.md
2. Create or update .claude/skills/prompthub/SKILL.md
3. Commit both files with a message referencing the ECC bundle

**Files typically involved**:
- `.agents/skills/prompthub/SKILL.md`
- `.claude/skills/prompthub/SKILL.md`

**Example commit sequence**:
```
Create or update .agents/skills/prompthub/SKILL.md
Create or update .claude/skills/prompthub/SKILL.md
Commit both files with a message referencing the ECC bundle
```

### Update Identity Json Workflow

Adds or updates the .claude/identity.json file for the ECC bundle.

**Frequency**: ~4 times per month

**Steps**:
1. Create or update .claude/identity.json
2. Commit the file with a message referencing the ECC bundle

**Files typically involved**:
- `.claude/identity.json`

**Example commit sequence**:
```
Create or update .claude/identity.json
Commit the file with a message referencing the ECC bundle
```

### Update Ecc Tools Json Workflow

Adds or updates the .claude/ecc-tools.json file for the ECC bundle.

**Frequency**: ~4 times per month

**Steps**:
1. Create or update .claude/ecc-tools.json
2. Commit the file with a message referencing the ECC bundle

**Files typically involved**:
- `.claude/ecc-tools.json`

**Example commit sequence**:
```
Create or update .claude/ecc-tools.json
Commit the file with a message referencing the ECC bundle
```

### Add Codex Agents Toml Workflow

Adds or updates agent configuration files in .codex/agents/ for docs-researcher, reviewer, and explorer.

**Frequency**: ~4 times per month

**Steps**:
1. Create or update .codex/agents/docs-researcher.toml
2. Create or update .codex/agents/reviewer.toml
3. Create or update .codex/agents/explorer.toml
4. Commit with a message referencing the ECC bundle

**Files typically involved**:
- `.codex/agents/docs-researcher.toml`
- `.codex/agents/reviewer.toml`
- `.codex/agents/explorer.toml`

**Example commit sequence**:
```
Create or update .codex/agents/docs-researcher.toml
Create or update .codex/agents/reviewer.toml
Create or update .codex/agents/explorer.toml
Commit with a message referencing the ECC bundle
```


## Best Practices

Based on analysis of the codebase, follow these practices:

### Do

- Use conventional commit format (feat:, fix:, etc.)
- Use camelCase for file names
- Prefer default exports

### Don't

- Don't use long relative imports (use aliases)
- Don't write vague commit messages
- Don't deviate from established patterns without discussion

---

*This skill was auto-generated by [ECC Tools](https://ecc.tools). Review and customize as needed for your team.*
