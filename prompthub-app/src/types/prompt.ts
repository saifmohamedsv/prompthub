import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Prompt = Database["public"]["Tables"]["prompts"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type PromptTag = Database["public"]["Tables"]["prompt_tags"]["Row"];

export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"];
export type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"];

export type PromptWithAuthor = Prompt & {
  profiles: Pick<Profile, "username" | "full_name" | "avatar_url"> | null;
  categories: Pick<Category, "name" | "name_ar" | "slug"> | null;
  prompt_tags?: { tags: Pick<Tag, "id" | "name" | "slug"> }[];
  best_with_models?: string[] | null;
  source_contributor?: string | null;
};
