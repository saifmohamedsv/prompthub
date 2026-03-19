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

Follow these commit message conventions based on 86 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `refactor`
- `chore`

### Message Guidelines

- Average message length: ~56 characters
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
feat: add prompthub ECC bundle (.claude/commands/refactoring.md)
```

*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/commands/feature-development.md)
```

*Commit message example*

```text
feat: add prompthub ECC bundle (.claude/homunculus/instincts/inherited/prompthub-instincts.yaml)
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

**Frequency**: ~19 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/components/ui/*`
- `src/hooks/*`
- `src/app/[locale]/*`
- `**/api/**`

**Example commit sequence**:
```
refactor: update UI components and global styles
chore: update i18n messages for new features
refactor: convert useAuth to context-based AuthProvider pattern
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~4 times per month

**Steps**:
1. Ensure tests pass before refactor
2. Refactor code structure
3. Verify tests still pass

**Files typically involved**:
- `src/**/*`

**Example commit sequence**:
```
feat: v2.0.0 — bilingual prompts, infinite scroll, flexible search, config-driven architecture
feat: add Locale enum and use across project
fix: improve dark mode field contrast and toast RTL styling
```

### Add Or Update Arabic Font

Switching the Arabic font used in the application for improved typography and readability.

**Frequency**: ~2 times per month

**Steps**:
1. Update src/app/[locale]/layout.tsx to use the new font.
2. Update src/lib/fonts.ts to import and configure the new font.

**Files typically involved**:
- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`

**Example commit sequence**:
```
Update src/app/[locale]/layout.tsx to use the new font.
Update src/lib/fonts.ts to import and configure the new font.
```

### Adjust Arabic Font Weight And Rtl

Tuning Arabic font weight and directionality for better UX and correct LTR/RTL rendering.

**Frequency**: ~3 times per month

**Steps**:
1. Update src/app/globals.css to change base font-weight for Arabic.
2. Update src/components/prompts/prompt-card.tsx and related prompt components to adjust font weights and set dir attributes.

**Files typically involved**:
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/components/prompts/prompt-form.tsx`

**Example commit sequence**:
```
Update src/app/globals.css to change base font-weight for Arabic.
Update src/components/prompts/prompt-card.tsx and related prompt components to adjust font weights and set dir attributes.
```

### Refine Form Label Spacing

Tweaking spacing between form labels and fields for better visual alignment.

**Frequency**: ~3 times per month

**Steps**:
1. Update src/components/prompts/prompt-form.tsx to change spacing utilities (e.g., mb-2, space-y-2, space-y-3).

**Files typically involved**:
- `src/components/prompts/prompt-form.tsx`

**Example commit sequence**:
```
Update src/components/prompts/prompt-form.tsx to change spacing utilities (e.g., mb-2, space-y-2, space-y-3).
```

### Update Global Css And Prompt Components For Theme Or Typography

Making broad theme, typography, or dark mode changes that affect multiple prompt-related components and global styles.

**Frequency**: ~2 times per month

**Steps**:
1. Update src/app/globals.css with new theme variables or typography.
2. Update multiple src/components/prompts/*.tsx files to use new tokens or classes.
3. Update src/components/logo.tsx and/or navbar.tsx if branding is affected.

**Files typically involved**:
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-snippet.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/components/prompts/prompt-form.tsx`
- `src/components/prompts/prompt-grid.tsx`
- `src/components/logo.tsx`
- `src/components/navbar.tsx`

**Example commit sequence**:
```
Update src/app/globals.css with new theme variables or typography.
Update multiple src/components/prompts/*.tsx files to use new tokens or classes.
Update src/components/logo.tsx and/or navbar.tsx if branding is affected.
```

### Add Feature With I18n Support

Adding a new feature or UI element that requires updates to both English and Arabic translations.

**Frequency**: ~2 times per month

**Steps**:
1. Update messages/ar.json and messages/en.json with new strings.
2. Update or create relevant src/components/*.tsx files to use the new translations.
3. Update src/lib/supabase/queries.ts or similar data files if the feature involves data queries.

**Files typically involved**:
- `messages/ar.json`
- `messages/en.json`
- `src/components/explore-view.tsx`
- `src/lib/supabase/queries.ts`

**Example commit sequence**:
```
Update messages/ar.json and messages/en.json with new strings.
Update or create relevant src/components/*.tsx files to use the new translations.
Update src/lib/supabase/queries.ts or similar data files if the feature involves data queries.
```

### Add Or Update Prompt Card Layout

Making visual or layout changes to the prompt card component, often in conjunction with global style or theme changes.

**Frequency**: ~4 times per month

**Steps**:
1. Update src/components/prompts/prompt-card.tsx for layout, size, or style changes.
2. Optionally update src/app/globals.css and related prompt components for consistency.

**Files typically involved**:
- `src/components/prompts/prompt-card.tsx`
- `src/app/globals.css`

**Example commit sequence**:
```
Update src/components/prompts/prompt-card.tsx for layout, size, or style changes.
Optionally update src/app/globals.css and related prompt components for consistency.
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
