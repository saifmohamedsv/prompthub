import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { UserProfileView } from "@/components/user-profile-view";
import { fetchProfileForOG } from "@/lib/og/data";
import { routes, siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await fetchProfileForOG(id);

  if (!profile) {
    return {
      title: "User not found",
    };
  }

  const displayName = profile.full_name ?? profile.username ?? "Syntaxa member";
  const title = `${displayName} on Syntaxa`;
  const description = `${displayName}'s AI prompts on Syntaxa. Browse, upvote, and remix their work.`;
  const url = `${siteConfig.url}${routes.userProfile(profile.id)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <UserProfileView userId={id} />
    </div>
  );
}
