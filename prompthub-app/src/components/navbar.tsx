"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/auth/user-avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { routes } from "@/lib/config";
import { Menu, Compass, FileText, Heart } from "lucide-react";
import { useState } from "react";

const navIcons = {
  [routes.explore]: Compass,
  [routes.myPrompts]: FileText,
  [routes.likes]: Heart,
} as const;

type NavbarProps = {
  variant?: "full" | "slim";
};

export function Navbar({ variant = "full" }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: routes.explore, label: t("explore") },
    { href: routes.myPrompts, label: t("myPrompts") },
    { href: routes.likes, label: t("likes") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
        <div className="flex items-center gap-2">
          {variant === "slim" && <MobileSidebar />}
          <Link href={routes.home} className="flex items-center">
            <Logo size="sm" />
          </Link>
        </div>

        {variant !== "slim" && (
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <UserAvatar />

          {variant !== "slim" && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" />}
                className="md:hidden"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="px-5 pt-6 pb-4">
                    <Logo size="md" />
                  </div>

                  <Separator />

                  <nav className="flex flex-col gap-1 px-3 py-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = navIcons[link.href as keyof typeof navIcons];
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {Icon && <Icon className="size-4" />}
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </header>
  );
}
