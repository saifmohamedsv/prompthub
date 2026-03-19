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

Follow these commit message conventions based on 108 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `refactor`
- `chore`

### Message Guidelines

- Average message length: ~58 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/update-arabic-font-or-typography.md)
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
feat: add prompthub ECC bundle (.claude/commands/add-or-update-ecc-bundle-file.md)
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

**Frequency**: ~25 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/components/prompts/*`
- `src/app/[locale]/*`
- `src/lib/*`

**Example commit sequence**:
```
fix: add explicit margin-bottom on form labels for visible spacing
fix: redesign logo with modern minimal style
fix: use font-extrabold for heavier logo weight
```

### Add Or Update Ecc Bundle

Adds or updates a set of ECC (Extensible Command/Component) bundle files for prompthub, including commands, skills, identity, and agent definitions.

**Frequency**: ~3 times per month

**Steps**:
1. Add or update one or more files in .claude/commands/*.md (such as feature-development.md, add-or-update-ecc-bundle-file.md, update-arabic-font-or-typography.md, refactoring.md, add-or-update-arabic-font.md)
2. Add or update .claude/identity.json
3. Add or update .claude/ecc-tools.json
4. Add or update .claude/skills/prompthub/SKILL.md
5. Add or update .agents/skills/prompthub/SKILL.md
6. Add or update .agents/skills/prompthub/agents/openai.yaml
7. Add or update .codex/agents/*.toml (docs-researcher.toml, reviewer.toml, explorer.toml)
8. Add or update .codex/AGENTS.md and/or .codex/config.toml

**Files typically involved**:
- `.claude/commands/*.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.claude/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/SKILL.md`
- `.agents/skills/prompthub/agents/openai.yaml`
- `.codex/agents/*.toml`
- `.codex/AGENTS.md`
- `.codex/config.toml`

**Example commit sequence**:
```
Add or update one or more files in .claude/commands/*.md (such as feature-development.md, add-or-update-ecc-bundle-file.md, update-arabic-font-or-typography.md, refactoring.md, add-or-update-arabic-font.md)
Add or update .claude/identity.json
Add or update .claude/ecc-tools.json
Add or update .claude/skills/prompthub/SKILL.md
Add or update .agents/skills/prompthub/SKILL.md
Add or update .agents/skills/prompthub/agents/openai.yaml
Add or update .codex/agents/*.toml (docs-researcher.toml, reviewer.toml, explorer.toml)
Add or update .codex/AGENTS.md and/or .codex/config.toml
```

### Arabic Font And Typography Adjustment

Updates Arabic font, typography tokens, and related UI for RTL/Arabic support, often involving global CSS and prompt card components.

**Frequency**: ~2 times per month

**Steps**:
1. Edit src/app/globals.css to adjust font weights, typography tokens, or add global RTL overrides
2. Edit src/components/prompts/prompt-card.tsx to update text sizes, icon sizes, or font-weight for Arabic
3. Optionally edit src/components/prompts/prompt-snippet.tsx, src/components/prompts/prompt-detail.tsx, src/components/prompts/prompt-form.tsx for related RTL or font changes
4. Optionally edit src/app/[locale]/layout.tsx and src/lib/fonts.ts to change font families (e.g., switch to Cairo)
5. Commit with message referencing Arabic font, typography, or RTL

**Files typically involved**:
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-snippet.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/components/prompts/prompt-form.tsx`
- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`

**Example commit sequence**:
```
Edit src/app/globals.css to adjust font weights, typography tokens, or add global RTL overrides
Edit src/components/prompts/prompt-card.tsx to update text sizes, icon sizes, or font-weight for Arabic
Optionally edit src/components/prompts/prompt-snippet.tsx, src/components/prompts/prompt-detail.tsx, src/components/prompts/prompt-form.tsx for related RTL or font changes
Optionally edit src/app/[locale]/layout.tsx and src/lib/fonts.ts to change font families (e.g., switch to Cairo)
Commit with message referencing Arabic font, typography, or RTL
```

### Design Token And Theme Refactor

Refactors the design token system, updates theme (e.g., color, typography), and normalizes component styles for consistency.

**Frequency**: ~2 times per month

**Steps**:
1. Edit src/app/globals.css to update or add design tokens (colors, typography, shadows, etc.)
2. Edit multiple files in src/components/ (logo.tsx, navbar.tsx, prompts/*) to consume new tokens and remove old inline styles
3. Normalize component classNames and remove custom overrides
4. Update logo or other branding assets as needed

**Files typically involved**:
- `src/app/globals.css`
- `src/components/logo.tsx`
- `src/components/navbar.tsx`
- `src/components/prompts/like-button.tsx`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/components/prompts/prompt-form.tsx`
- `src/components/prompts/prompt-grid.tsx`
- `src/components/prompts/prompt-snippet.tsx`

**Example commit sequence**:
```
Edit src/app/globals.css to update or add design tokens (colors, typography, shadows, etc.)
Edit multiple files in src/components/ (logo.tsx, navbar.tsx, prompts/*) to consume new tokens and remove old inline styles
Normalize component classNames and remove custom overrides
Update logo or other branding assets as needed
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
