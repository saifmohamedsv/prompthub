import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PromptDetail } from "@/components/prompts/prompt-detail";
import { fetchPromptForOG } from "@/lib/og/data";
import { routes, siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await fetchPromptForOG(id);

  if (!prompt) {
    return {
      title: "Prompt not found",
      description: "This prompt doesn't exist or has been removed.",
    };
  }

  const url = `${siteConfig.url}${routes.promptDetail(prompt.id)}`;
  const description =
    prompt.description ||
    (prompt.prompt_text ? prompt.prompt_text.slice(0, 180) : siteConfig.description);

  return {
    title: prompt.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: prompt.title,
      description,
      url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: prompt.title,
      description,
    },
  };
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PromptDetail id={id} />
    </div>
  );
}
