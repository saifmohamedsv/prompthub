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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <UserProfileView userId={id} />
    </div>
  );
}
