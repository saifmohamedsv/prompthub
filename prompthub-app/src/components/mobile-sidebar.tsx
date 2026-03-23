"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Locale } from "@/lib/config";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNavItems } from "@/components/sidebar-nav-items";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("sidebar");
  const isRtl = locale === Locale.AR;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
      >
        <Menu className="size-5" />
        <span className="sr-only">{t("title")}</span>
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={isRtl ? "right" : "left"} className="w-72 bg-sidebar p-0">
          <SheetTitle className="px-6 pt-6 pb-2">
            <span className="text-lg font-black">{t("title")}</span>
            <p className="text-xs text-muted-foreground font-normal">{t("subtitle")}</p>
          </SheetTitle>
          <div className="flex flex-col h-full px-3 py-4">
            <SidebarNavItems onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
