<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

<h1 align="center">PromptHub (Syntaxa)</h1>

<p align="center">
  <strong>An AI prompt marketplace where creators share, discover, and curate high-quality prompts for ChatGPT, Claude, Gemini, Midjourney, DALL-E, and more.</strong>
</p>

<p align="center">
  Built with Next.js 16 &bull; Supabase &bull; React Query &bull; shadcn/ui &bull; Framer Motion
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#database-schema">Database</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#roadmap">Roadmap</a>
</p>

---

## Why PromptHub?

The AI ecosystem is flooded with powerful models — but crafting the *right prompt* is the difference between a mediocre output and a brilliant one. **PromptHub** is a community-driven marketplace where prompt engineers share their best work, discover trending prompts, and follow top creators.

---

## Features

### Prompt Marketplace
- **Browse & Explore** — Infinite-scroll grid with filtering by category, tags, sort order (recent, most viewed, most liked, hot), and prompt type (text/image/video)
- **Full-Text Search** — Lightning-fast search across titles, descriptions, and prompt text powered by PostgreSQL `tsvector` with GIN indexing
- **Prompt Detail View** — Rich prompt pages with syntax-highlighted code blocks, one-click copy, hero images, author cards, and "Similar Syntaxes" recommendations
- **Quick Preview** — Side-panel sheet for previewing prompts without navigating away from the grid

### Prompt of the Day
A daily featured prompt selected from the top 20 most-liked prompts with deterministic daily rotation — always fresh, always high quality.

### Trending Section
Top prompts ranked by community engagement (likes + views), displayed in a horizontally scrollable showcase.

### Social Features
- **Upvote System** — Toggle-based upvoting with optimistic UI updates and atomic database triggers for accurate like counts
- **Follow Creators** — Follow your favorite prompt engineers. Atomic `toggle_follow` RPC with self-follow prevention
- **Personalized Feed** — A dedicated feed page showing prompts exclusively from creators you follow, with infinite scroll
- **User Profiles** — Public profiles displaying avatar, username, join date, prompt count, total likes received, and follower count

### Prompt Management
- **Create & Edit** — Rich form with title, description, prompt text, external links, image upload (Supabase Storage), category selection, multi-tag support, and prompt type (text/image/video)
- **My Prompts Dashboard** — Full CRUD management for your published prompts
- **Liked Prompts** — View all prompts you've upvoted in one place
- **Image Upload** — Direct upload to Supabase Storage with public CDN delivery

### Authentication
- **Social Login** — Google and GitHub OAuth via Supabase Auth
- **Auto Profile Creation** — Database triggers automatically create user profiles from OAuth metadata
- **Row Level Security** — All database operations are security-scoped. Public reads, authenticated writes, ownership-scoped mutations
- **Session Management** — Middleware-based session refresh with cookie persistence

### UI/UX
- **Dark Mode** — System-aware theme toggle with `next-themes`
- **Responsive Design** — Mobile-first layouts with adaptive grids, mobile filter sheets, and hamburger navigation
- **Framer Motion Animations** — Smooth page transitions, hover effects, and micro-interactions
- **Skeleton Loading** — Comprehensive loading states for all async content
- **Debounced Search** — 300ms input debounce for performant real-time search
- **Toast Notifications** — Non-intrusive feedback for copy, success, and error states via Sonner
- **Top Loading Bar** — Visual route transition indicator
- **First Visit Gate** — New visitors land on a marketing page; returning users go straight to the explore view

---

## Categories

| Category | Icon |
|----------|------|
| Writing | ✍️ |
| Coding | 💻 |
| Marketing | 📢 |
| Education | 🎓 |
| Business | 💼 |
| Creative | 🎨 |
| Productivity | ⚡ |
| Other | 📦 |

### Supported AI Model Tags
`gpt-4` · `gpt-4o` · `claude` · `gemini` · `midjourney` · `dall-e` · `stable-diffusion` · `coding` · `writing` · `marketing` · `seo` · `portrait` · `landscape` · `productivity` · `education` · `creative` · `business` · `data-analysis` · `summarization` · `translation`

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | 5.x |
| **Backend & Database** | Supabase (PostgreSQL) | supabase-js 2.98 |
| **Data Fetching** | TanStack React Query | 5.90 |
| **UI Components** | shadcn/ui + Radix primitives | Latest |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.35 |
| **Theming** | next-themes | 0.4 |
| **Icons** | Lucide React | 0.577 |
| **Toasts** | Sonner | 2.0 |
| **CSS Utilities** | clsx, tailwind-merge, CVA | Latest |

---

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │   prompts    │       │  categories  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (uuid)    │◄──────│ user_id (FK) │   ┌──►│ id (uuid)    │
│ username     │       │ id (uuid)    │   │   │ name         │
│ full_name    │       │ title        │   │   │ slug         │
│ avatar_url   │       │ description  │   │   └──────────────┘
│ followers_   │       │ prompt_text  │   │
│   count      │       │ link         │   │   ┌──────────────┐
│ following_   │       │ image_url    │   │   │    tags      │
│   count      │       │ likes_count  │   │   ├──────────────┤
└──────┬───────┘       │ views_count  │   │   │ id (uuid)    │
       │               │ category_id──┘   │   │ name         │
       │               │ type (enum)  │       │ slug         │
┌──────┴───────┐       │ fts (vector) │       └──────┬───────┘
│   follows    │       └──────┬───────┘              │
├──────────────┤              │               ┌──────┴───────┐
│ follower_id  │       ┌──────┴───────┐       │ prompt_tags  │
│ following_id │       │    likes     │       ├──────────────┤
│ (no self-    │       ├──────────────┤       │ prompt_id    │
│  follow)     │       │ user_id      │       │ tag_id       │
└──────────────┘       │ prompt_id    │       └──────────────┘
                       └──────────────┘

                       RLS: Enabled on all tables
                       Triggers: auto-profile, auto-like-count
                       RPC: increment_views, toggle_follow
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/callback` | GET | OAuth callback handler (code exchange) |
| `/api/me` | GET | Current authenticated user + profile |
| `/api/seed` | POST | Seed categories and tags data |

---

## App Pages

| Path | Description | Auth |
|------|-------------|------|
| `/` | Explore — browse all prompts | Public |
| `/landing` | Marketing landing page | Public |
| `/feed` | Personalized feed from followed creators | Required |
| `/likes` | Your upvoted prompts | Required |
| `/my-prompts` | Manage your prompts | Required |
| `/my-prompts/new` | Create a new prompt | Required |
| `/my-prompts/[id]/edit` | Edit an existing prompt | Required |
| `/prompt/[id]` | Prompt detail view | Public |
| `/user/[id]` | Public user profile | Public |
| `/login` | Social authentication | Public |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A Supabase project ([create one free](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/saifmohamedsv/prompthub.git
cd prompthub/prompthub-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Run the schema migration in your Supabase SQL editor:
   ```
   supabase/schema.sql
   supabase/migration-002-prompt-text-views-tags.sql
   supabase/20260326_add_follows.sql
   supabase/20260401_add_prompt_type.sql
   ```

2. Seed initial data:
   ```
   supabase/seed-prompts-v2.sql
   ```

3. Configure OAuth providers (Google, GitHub) in your Supabase dashboard under Authentication → Providers.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Roadmap

### Coming Soon

| Feature | Status |
|---------|--------|
| **My Collection** | 🔜 Save & bookmark prompts into personal collections (UI ready, badge visible in navigation) |
| **Trending on Explore** | 🔜 Trending section on the main explore page (component built, integration pending) |
| **Following on Explore** | 🔜 Show followed creators' latest prompts on explore (component built, integration pending) |
| **Prompt Quick Preview** | 🔜 Hover-to-preview prompts in the grid (sheet component built, trigger pending) |
| **Popularity Badges** | 🔜 "Popular" (50+ likes) and "Rising" (10+ likes in 7 days) badges on prompt cards |
| **Type Filtering** | 🔜 Filter prompts by type (text/image/video) in the sidebar |

### Future Vision

- **Prompt Templates** — Parameterized prompts with variable placeholders
- **Comments & Discussions** — Community feedback on prompts
- **Prompt Chains** — Multi-step prompt workflows
- **Analytics Dashboard** — Views, likes, and engagement metrics for creators
- **API Access** — Public API for programmatic prompt access
- **Monetization** — Premium prompts and creator tipping

---

## Project Structure

```
prompthub-app/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login page
│   │   ├── (dashboard)/         # Prompt management (create/edit)
│   │   ├── (public)/            # Public pages (explore, feed, likes, profiles)
│   │   └── api/                 # API routes (auth, me, seed)
│   ├── components/
│   │   ├── auth/                # Login, social auth, avatar
│   │   ├── prompts/             # Prompt card, detail, form, grid, preview
│   │   └── ui/                  # shadcn/ui primitives
│   ├── hooks/                   # Custom hooks (auth, prompts, follows, etc.)
│   ├── lib/
│   │   ├── react-query/         # Query keys & provider
│   │   └── supabase/            # Client, server, middleware, queries
│   └── types/                   # TypeScript definitions
└── supabase/                    # Schema, migrations, seed data
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/saifmohamedsv">Saif Mohamed</a>
</p>
