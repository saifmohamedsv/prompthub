import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { inter, lora, jetbrainsMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/react-query/provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Syntaxa",
    template: "%s | Syntaxa",
  },
  description: "Discover, share, and remix AI prompts for ChatGPT, Claude, Midjourney, and more.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <NextTopLoader color="#c96442" height={3} showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
                <Toaster position="bottom-right" />
              </NextIntlClientProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
