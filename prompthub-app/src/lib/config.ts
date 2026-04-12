// ============================================
// App-wide configuration — single source of truth
// ============================================

export const siteConfig = {
  name: "Syntaxa",
  description: "Discover and share AI prompts",
  developer: {
    name: "Saif Mohamed",
    github: "https://github.com/saifmohamedsv",
    portfolio: "https://saifmohamedsv.vercel.app",
  },
} as const;

export const routes = {
  home: "/",
  landing: "/landing",
  explore: "/explore",
  login: "/login",
  myPrompts: "/my-prompts",
  newPrompt: "/my-prompts/new",
  editPrompt: (id: string) => `/my-prompts/${id}/edit` as const,
  promptDetail: (id: string) => `/prompt/${id}` as const,
  likes: "/likes",
  feed: "/feed",
  userProfile: (id: string) => `/user/${id}` as const,
  apiAuthCallback: "/api/auth/callback",
  apiMe: "/api/me",
  apiSeed: "/api/seed",
} as const;

export const pagination = {
  defaultPageSize: 12,
} as const;

/** Maps category slug to a CSS badge class from globals.css */
const BADGE_MAP: Record<string, string> = {
  writing: "badge-writing",
  coding: "badge-coding",
  marketing: "badge-marketing",
  education: "badge-midjourney",
  business: "badge-claude",
  creative: "badge-image-gen",
  productivity: "badge-chatgpt",
  other: "badge-draft",
};

/** All badge classes for hash-based fallback */
const BADGE_CLASSES = [
  "badge-chatgpt", "badge-claude", "badge-midjourney", "badge-coding",
  "badge-writing", "badge-marketing", "badge-image-gen", "badge-trending",
];

function hashSlug(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCategoryBadgeClass(slug?: string): string {
  if (!slug) return "badge-draft";
  const key = slug.toLowerCase();
  if (BADGE_MAP[key]) return BADGE_MAP[key];
  return BADGE_CLASSES[hashSlug(key) % BADGE_CLASSES.length];
}
