import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  categories,
  tags,
  prompts,
} from "../../../../supabase/seed-data";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding disabled in production" }, { status: 403 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Delete ALL current user's prompts (prompt_tags cascade)
    await supabase.from("prompts").delete().eq("user_id", user.id);

    // 2. Upsert categories
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .upsert(categories.map((c) => ({ ...c })) as never, { onConflict: "slug" })
      .select("id, slug");
    if (catError) throw catError;

    const catMap = new Map(
      (catData as unknown as { id: string; slug: string }[]).map((c) => [c.slug, c.id])
    );

    // 3. Upsert tags
    const tagRows = tags.map((name) => ({ name, slug: name }));
    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .upsert(tagRows as never, { onConflict: "slug" })
      .select("id, slug");
    if (tagError) throw tagError;

    const tagMap = new Map(
      (tagData as unknown as { id: string; slug: string }[]).map((t) => [t.slug, t.id])
    );

    // 4. Seed prompts with views, likes, and links
    let seededCount = 0;
    for (const p of prompts) {
      const categoryId = catMap.get(p.category_slug);
      if (!categoryId) continue;

      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .insert({
          title: p.title,
          title_ar: p.title_ar || null,
          description: p.description,
          description_ar: p.description_ar || null,
          prompt_text: p.prompt_text,
          category_id: categoryId,
          user_id: user.id,
          link: p.link || null,
          views_count: p.views_count ?? 0,
          likes_count: p.likes_count ?? 0,
        } as never)
        .select("id")
        .single();
      if (promptError) throw promptError;

      const promptId = (promptData as unknown as { id: string }).id;

      const tagLinks = p.tag_slugs
        .map((slug) => tagMap.get(slug))
        .filter(Boolean)
        .map((tagId) => ({ prompt_id: promptId, tag_id: tagId }));

      if (tagLinks.length > 0) {
        const { error: linkError } = await supabase
          .from("prompt_tags")
          .insert(tagLinks as never);
        if (linkError) throw linkError;
      }

      seededCount++;
    }

    return NextResponse.json({
      success: true,
      seeded: {
        categories: catData?.length ?? 0,
        tags: tagData?.length ?? 0,
        prompts: seededCount,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
