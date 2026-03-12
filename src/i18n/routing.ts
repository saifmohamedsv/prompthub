import { defineRouting } from "next-intl/routing";
import { Locale } from "@/lib/config";

export const routing = defineRouting({
  locales: [Locale.EN, Locale.AR],
  defaultLocale: Locale.AR,
  localePrefix: {
    mode: "as-needed",
  },
});
