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

Follow these commit message conventions based on 72 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `refactor`
- `chore`

### Message Guidelines

- Average message length: ~54 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
fix: streamline LocaleLayout function and improve formatting
```

*Commit message example*

```text
feat: add top progress bar for route transitions
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
fix: increase progress bar height to 5px
```

*Commit message example*

```text
fix: bump all prompt card sizes one level up
```

*Commit message example*

```text
fix: remove custom typography tokens, use standard Tailwind sizes
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

**Frequency**: ~17 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `src/app/[locale]/(dashboard)/my-prompts/*`
- `src/app/[locale]/(public)/*`
- `src/app/[locale]/*`
- `**/api/**`

**Example commit sequence**:
```
feat: integrate onboarding flow and update page layouts
refactor: update global styles and prompt grid
chore: remove old locale home page and update dependencies
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~6 times per month

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

### Update Arabic Font Or Typography

Update the Arabic font or adjust typography and font-weight for Arabic locale for improved readability and style consistency.

**Frequency**: ~4 times per month

**Steps**:
1. Edit src/app/[locale]/layout.tsx to update font-family or font logic.
2. Edit src/lib/fonts.ts to import or switch font definitions.
3. Edit src/app/globals.css to adjust global font-weight, font-size, or RTL-specific styles.
4. Optionally, update prompt card or detail components for per-component font/size tweaks.

**Files typically involved**:
- `src/app/[locale]/layout.tsx`
- `src/lib/fonts.ts`
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-detail.tsx`

**Example commit sequence**:
```
Edit src/app/[locale]/layout.tsx to update font-family or font logic.
Edit src/lib/fonts.ts to import or switch font definitions.
Edit src/app/globals.css to adjust global font-weight, font-size, or RTL-specific styles.
Optionally, update prompt card or detail components for per-component font/size tweaks.
```

### Add Or Update Design Tokens And Theme

Introduce or refactor design tokens (colors, typography, shadows) and update theme system for consistent UI styling.

**Frequency**: ~2 times per month

**Steps**:
1. Edit src/app/globals.css to define or update CSS variables for theme tokens.
2. Update components (e.g., prompt-card, prompt-snippet, navbar, logo) to use new or updated token classes.
3. Normalize usage of utility classes (e.g., size-N, text-N) across components.
4. Optionally, update logo or branding assets for visual consistency.

**Files typically involved**:
- `src/app/globals.css`
- `src/components/prompts/prompt-card.tsx`
- `src/components/prompts/prompt-snippet.tsx`
- `src/components/logo.tsx`
- `src/components/navbar.tsx`

**Example commit sequence**:
```
Edit src/app/globals.css to define or update CSS variables for theme tokens.
Update components (e.g., prompt-card, prompt-snippet, navbar, logo) to use new or updated token classes.
Normalize usage of utility classes (e.g., size-N, text-N) across components.
Optionally, update logo or branding assets for visual consistency.
```

### Add Or Change Prompt Form Or Detail Layout

Modify the prompt form or detail component for UX improvements, spacing, validation, or new fields.

**Frequency**: ~3 times per month

**Steps**:
1. Edit src/components/prompts/prompt-form.tsx to adjust form fields, spacing, or validation.
2. Edit src/components/prompts/prompt-detail.tsx for layout or display changes.
3. Optionally, update prompt-card or prompt-snippet for consistency.
4. Update global styles if spacing or color changes are needed.

**Files typically involved**:
- `src/components/prompts/prompt-form.tsx`
- `src/components/prompts/prompt-detail.tsx`
- `src/app/globals.css`

**Example commit sequence**:
```
Edit src/components/prompts/prompt-form.tsx to adjust form fields, spacing, or validation.
Edit src/components/prompts/prompt-detail.tsx for layout or display changes.
Optionally, update prompt-card or prompt-snippet for consistency.
Update global styles if spacing or color changes are needed.
```

### Add Or Switch Logo Or Branding

Update the logo or branding component for a new style, weight, or visual identity.

**Frequency**: ~2 times per month

**Steps**:
1. Edit src/components/logo.tsx to update SVG, font-weight, or layout.
2. Optionally, update global styles or navbar for logo integration.

**Files typically involved**:
- `src/components/logo.tsx`
- `src/components/navbar.tsx`

**Example commit sequence**:
```
Edit src/components/logo.tsx to update SVG, font-weight, or layout.
Optionally, update global styles or navbar for logo integration.
```

### Add Or Update Dashboard Or User Pages

Add or modify dashboard pages for user prompts, likes, or authentication flows.

**Frequency**: ~2 times per month

**Steps**:
1. Create or edit src/app/[locale]/(dashboard)/* page files for new dashboard sections.
2. Update or create supporting view components (e.g., my-prompts-view, likes-view).
3. Update navbar or navigation components to link to new pages.
4. Update i18n message files for new labels.

**Files typically involved**:
- `src/app/[locale]/(dashboard)/*.tsx`
- `src/components/my-prompts-view.tsx`
- `src/components/likes-view.tsx`
- `src/components/navbar.tsx`
- `messages/ar.json`
- `messages/en.json`

**Example commit sequence**:
```
Create or edit src/app/[locale]/(dashboard)/* page files for new dashboard sections.
Update or create supporting view components (e.g., my-prompts-view, likes-view).
Update navbar or navigation components to link to new pages.
Update i18n message files for new labels.
```

### Add Or Update I18n Messages

Add or update translation strings for new features or UI changes.

**Frequency**: ~3 times per month

**Steps**:
1. Edit messages/ar.json and messages/en.json to add or update translation keys.
2. Update components to use new or changed translation keys.

**Files typically involved**:
- `messages/ar.json`
- `messages/en.json`

**Example commit sequence**:
```
Edit messages/ar.json and messages/en.json to add or update translation keys.
Update components to use new or changed translation keys.
```

### Add Or Update Supabase Schema And Migrations

Add new database tables, columns, or features and generate corresponding migration and type updates.

**Frequency**: ~2 times per month

**Steps**:
1. Edit supabase/schema.sql to define new tables or columns.
2. Create new migration SQL file in supabase/migration-*.sql.
3. Update src/types/database.ts to reflect new schema.
4. Update src/lib/supabase/queries.ts for new queries or mutations.
5. Update seed files if initial data is required.

**Files typically involved**:
- `supabase/schema.sql`
- `supabase/migration-*.sql`
- `src/types/database.ts`
- `src/lib/supabase/queries.ts`
- `supabase/seed-prompts.sql`
- `supabase/seed-data.ts`

**Example commit sequence**:
```
Edit supabase/schema.sql to define new tables or columns.
Create new migration SQL file in supabase/migration-*.sql.
Update src/types/database.ts to reflect new schema.
Update src/lib/supabase/queries.ts for new queries or mutations.
Update seed files if initial data is required.
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
