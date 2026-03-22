import { setRequestLocale } from "next-intl/server";
import { LikesView } from "@/components/likes-view";

export default async function LikesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LikesView />;
}
