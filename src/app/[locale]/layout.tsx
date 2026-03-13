import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { inter, cairo } from "@/lib/fonts";
import { Locale } from "@/lib/config";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/react-query/provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "PromptHub",
    template: "%s | PromptHub",
  },
  description:
    "Discover and share the best AI prompts for ChatGPT, Claude, Midjourney, and more.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const isArabic = locale === Locale.AR;
  const fontClass = isArabic ? cairo.variable : inter.variable;

  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${fontClass} font-sans antialiased`}>
        <NextTopLoader color="#b45309" height={5} showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
                <Toaster dir={isArabic ? "rtl" : "ltr"} position={isArabic ? "bottom-left" : "bottom-right"} />
              </NextIntlClientProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
