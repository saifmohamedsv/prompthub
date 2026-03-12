// ============================================
// App-wide configuration — single source of truth
// ============================================

export enum Locale {
  AR = "ar",
  EN = "en",
}

export const siteConfig = {
  name: "PromptHub",
  description: "Discover and share AI prompts",
  developer: {
    name: "Saif Mohamed",
    github: "https://github.com/saifmohamedsv",
    portfolio: "https://saifmohamedsv.vercel.app",
  },
} as const;

export const routes = {
  home: "/",
  explore: "/explore",
  login: "/login",
  myPrompts: "/my-prompts",
  newPrompt: "/my-prompts/new",
  editPrompt: (id: string) => `/my-prompts/${id}/edit` as const,
  promptDetail: (id: string) => `/prompt/${id}` as const,
  likes: "/likes",
  apiAuthCallback: "/api/auth/callback",
  apiMe: "/api/me",
  apiSeed: "/api/seed",
} as const;

export const pagination = {
  defaultPageSize: 12,
} as const;
