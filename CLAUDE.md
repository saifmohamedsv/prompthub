# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Syntaxa is a bilingual (Arabic/English) AI prompt marketplace built with Next.js 16 App Router, Supabase, and React Query. Users browse, share, like, and manage AI prompts across categories.

## Tech Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| Framework       | Next.js 16.1.6 (App Router, RSC)                                  |
| Language        | TypeScript 5 (strict mode)                                        |
| React           | 19.2.3                                                            |
| Styling         | Tailwind CSS v4, shadcn/ui (base-nova), CSS variables for theming |
| State           | React Query v5 (TanStack Query), React Context for auth           |
| Auth & DB       | Supabase (auth, postgres, storage, RPC)                           |
| i18n            | next-intl v4 — locales: `ar` (default), `en`                      |
| Animation       | Framer Motion v12                                                 |
| Icons           | Lucide React                                                      |
| Toasts          | Sonner                                                            |
| Package manager | Yarn                                                              |
| Linting         | ESLint 9 (flat config, next core-web-vitals + typescript)         |

## Commands

All commands run from `prompthub-app/`:

```bash
cd prompthub-app && yarn dev        # Start dev server
cd prompthub-app && yarn build      # Production build
cd prompthub-app && yarn lint       # Run ESLint
```

## Project Structure

```
src/
├── app/[locale]/           # Locale-based routing (ar default, en)
│   ├── (public)/           # Public pages: home, explore, prompt/[id]
│   ├── (auth)/             # Login page
│   └── (dashboard)/        # Protected: my-prompts, likes
├── components/
│   ├── ui/                 # shadcn/ui primitives (don't modify directly)
│   └── ...                 # Feature components
├── hooks/                  # Custom React hooks (use-auth, use-prompts, etc.)
├── lib/
│   ├── supabase/           # Client, server, queries, middleware
│   └── react-query/        # Query keys, provider
├── i18n/                   # Routing, navigation, request config
├── types/                  # database.ts (auto-generated), prompt.ts
└── messages/               # en.json, ar.json translation files
```

## Architecture Rules

### Data Flow

- **Query keys**: Always use `queryKeys` from `@/lib/react-query/keys.ts` — never inline query keys
- **Supabase queries**: All DB calls live in `@/lib/supabase/queries.ts` — hooks in `src/hooks/` wrap them with React Query
- **Cache strategy**: staleTime 1-5min for lists, Infinity for mutation-driven data; gcTime 10min
- **Mutations**: Always invalidate via `queryKeys.prompts.all` to cascade

### Components

- Default to **Server Components**; add `"use client"` only when hooks/interactivity are needed
- Use `@/i18n/navigation` for `Link` and `useRouter` (locale-aware)
- Use `useTranslations()` for all user-facing strings — never hardcode text
- Use `useLocale()` to pick locale-specific fields (e.g., `name` vs `name_ar`)

### Styling

- Tailwind utility classes only — no custom CSS files beyond `globals.css`
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) not raw colors
- Mobile-first responsive: base styles are mobile, add `sm:`, `md:`, `lg:` for larger
- Dark mode via `dark:` variant (next-themes handles class toggling)
- shadcn/ui components use `data-slot` attributes — avoid overriding those patterns

### i18n & RTL

- Arabic is RTL — use logical properties (`ps-4`, `me-2`) over `pl-4`, `mr-2` where direction matters
- Default locale is `ar`; locale prefix mode is `as-needed` (no `/ar` prefix in URLs)
- Translation keys in `messages/{locale}.json` — flat namespace per feature

### TypeScript

- Path alias: `@/*` → `./src/*`
- Types in `src/types/` — `database.ts` is auto-generated from Supabase, don't edit manually
- Use `as unknown as T` pattern for Supabase query returns (matches existing convention)
- Prefer explicit types over `any`; use `never` for Supabase insert/update casts

### Auth

- `useAuth()` hook from `@/hooks/use-auth.tsx` provides `{ user, loading }`
- Auth state via `AuthProvider` wrapping the locale layout
- Server-side auth via `createClient()` from `@/lib/supabase/server.ts`
- OAuth callback at `/api/auth/callback`

## Code Quality Standards

- No unused imports or variables
- No `console.log` in committed code (use toast for user feedback)
- Prefer named exports for components, hooks, and utilities
- Keep components focused — extract into `components/` when a component exceeds ~150 lines
- Don't add comments for obvious code; only comment non-obvious business logic
- Don't add tests unless explicitly asked (no test framework is configured)
- Run `yarn lint` before considering work complete

## Agent Routing

Role-based agents are defined in `.claude/agents/`. For any task, delegate to the appropriate agent via the `task-orchestrator`:

| Task Type                      | Agent                     | Role                                          |
| ------------------------------ | ------------------------- | --------------------------------------------- |
| Task routing & coordination    | `task-orchestrator`       | Routes tasks, manages 5-phase workflow        |
| Unclear requirements           | `product-owner`           | Produces task briefs with acceptance criteria |
| Backend architecture & review  | `tech-lead-backend`       | Plans architecture, reviews implementation    |
| Backend implementation         | `staff-backend-engineer`  | Implements across all 10 backend apps + libs  |
| Frontend architecture & review | `tech-lead-frontend`      | Plans architecture, reviews implementation    |
| Frontend implementation        | `staff-frontend-engineer` | Implements across dashboard + storefront      |

**Workflow**: Requirements → Architecture (tech lead) → Implementation (staff engineer) → Review (tech lead) → Knowledge Capture (orchestrator).
Simple tasks skip the architecture phase. Knowledge capture never skips.

Cross-domain tasks: run backend first (API dependencies), then frontend.

## Git Workflow

- **Always use git worktrees** (`isolation: "worktree"`) when launching implementation agents. This keeps the main working directory clean and allows parallel work on multiple features.
- **Always branch from `main`** — all new feature branches must be created from the latest `main` branch.
