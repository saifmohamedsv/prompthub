export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
    likes: ["auth", "me", "likes"] as const,
  },
  prompts: {
    all: ["prompts"] as const,
    list: (filters?: Record<string, string>) =>
      ["prompts", "list", filters] as const,
    detail: (id: string) => ["prompts", "detail", id] as const,
    my: ["prompts", "my"] as const,
    liked: ["prompts", "liked"] as const,
    featured: ["prompts", "featured"] as const,
    userPublic: (id: string) => ["prompts", "user", id] as const,
  },
  profiles: {
    detail: (id: string) => ["profiles", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  tags: {
    all: ["tags"] as const,
  },
  follows: {
    all: ["follows"] as const,
    myFollowings: ["follows", "my-followings"] as const,
    feed: (filters?: Record<string, string>) =>
      ["follows", "feed", filters] as const,
  },
} as const;
