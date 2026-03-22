import { setRequestLocale } from "next-intl/server";
import { UserProfileView } from "@/components/user-profile-view";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileView userId={id} />
    </div>
  );
}
