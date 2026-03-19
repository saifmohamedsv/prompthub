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

Follow these commit message conventions based on 97 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `refactor`
- `chore`

### Message Guidelines

- Average message length: ~57 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/add-or-update-arabic-font.md)
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
feat: add prompthub ECC bundle (.claude/commands/refactoring.md)
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

**Frequency**: ~20 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/app/[locale]/*`
- `src/lib/*`
- `src/components/*`

**Example commit sequence**:
```
feat: replace Cairo with Baloo Bhaijaan 2 for Arabic font
fix: redesign mobile side menu with icons, active states, and branding
fix: constrain prompt detail image height and improve form spacing
```

### Add Or Update Ecc Bundle File

Adds or updates a configuration, command, skill, or agent file in ECC-related directories (.claude, .codex, .agents) to extend or modify the prompthub's capabilities.

**Frequency**: ~10 times per month

**Steps**:
1. Create or update a file in one of the ECC directories (e.g., .claude/commands/, .codex/agents/, .agents/skills/).
2. Commit the file with a message referencing the ECC bundle and the specific file.
3. Optionally, repeat for related files (e.g., SKILL.md, identity.json, config.toml).

**Files typically involved**:
- `.claude/commands/*.md`
- `.claude/skills/prompthub/SKILL.md`
- `.claude/identity.json`
- `.claude/ecc-tools.json`
- `.codex/agents/*.toml`
- `.codex/AGENTS.md`
- `.codex/config.toml`
- `.agents/skills/prompthub/agents/openai.yaml`
- `.agents/skills/prompthub/SKILL.md`

**Example commit sequence**:
```
Create or update a file in one of the ECC directories (e.g., .claude/commands/, .codex/agents/, .agents/skills/).
Commit the file with a message referencing the ECC bundle and the specific file.
Optionally, repeat for related files (e.g., SKILL.md, identity.json, config.toml).
```

### Update Arabic Font Or Typography

Updates the Arabic font or typography system, including font family, weights, and related styling for RTL/Arabic locales.

**Frequency**: ~3 times per month

**Steps**:
1. Edit src/app/[locale]/layout.tsx to change font imports or usage.
2. Edit src/lib/fonts.ts to update font family or weights.
3. Edit src/app/globals.css to adjust global font-weight or typography tokens.
4. Optionally, update prompt card or related components for size/weight changes.

**Files typically involved**:
- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`

**Example commit sequence**:
```
Edit src/app/[locale]/layout.tsx to change font imports or usage.
Edit src/lib/fonts.ts to update font family or weights.
Edit src/app/globals.css to adjust global font-weight or typography tokens.
Optionally, update prompt card or related components for size/weight changes.
```

### Refactor Or Tweak Prompt Card Layout

Refactors or tweaks the layout, sizing, or style of the prompt card component for improved UI/UX.

**Frequency**: ~3 times per month

**Steps**:
1. Edit src/components/prompts/prompt-card.tsx to change sizes, padding, or layout.
2. Optionally, update related components (prompt-snippet, prompt-detail) or global styles.
3. Commit with a message describing the UI/UX improvement.

**Files typically involved**:
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-snippet.tsx`
- `src/app/globals.css`

**Example commit sequence**:
```
Edit src/components/prompts/prompt-card.tsx to change sizes, padding, or layout.
Optionally, update related components (prompt-snippet, prompt-detail) or global styles.
Commit with a message describing the UI/UX improvement.
```

### Adjust Form Label Spacing

Tweaks the spacing between form labels and fields for improved form usability and appearance.

**Frequency**: ~3 times per month

**Steps**:
1. Edit src/components/prompts/prompt-form.tsx to adjust margin or spacing utilities.
2. Optionally, update related CSS or layout wrappers.
3. Commit with a message referencing label-to-field spacing.

**Files typically involved**:
- `src/components/prompts/prompt-form.tsx`

**Example commit sequence**:
```
Edit src/components/prompts/prompt-form.tsx to adjust margin or spacing utilities.
Optionally, update related CSS or layout wrappers.
Commit with a message referencing label-to-field spacing.
```

### Update Dark Mode Field Contrast

Improves the contrast and visibility of form fields or backgrounds in dark mode.

**Frequency**: ~2 times per month

**Steps**:
1. Edit src/app/globals.css to adjust background or field color values.
2. Optionally, update related form or card components for color consistency.
3. Commit with a message referencing dark mode or contrast.

**Files typically involved**:
- `src/app/globals.css`

**Example commit sequence**:
```
Edit src/app/globals.css to adjust background or field color values.
Optionally, update related form or card components for color consistency.
Commit with a message referencing dark mode or contrast.
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
