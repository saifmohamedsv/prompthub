export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  prompts: {
    all: ["prompts"] as const,
    list: (filters?: Record<string, string>) =>
      ["prompts", "list", filters] as const,
    detail: (id: string) => ["prompts", "detail", id] as const,
    my: ["prompts", "my"] as const,
    liked: ["prompts", "liked"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
} as const;
