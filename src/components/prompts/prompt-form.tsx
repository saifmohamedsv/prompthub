"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function PromptForm({ promptId }: { promptId?: string }) {
  const t = useTranslations("prompt");

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("title")}</label>
          <Input placeholder={t("titlePlaceholder")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("description")}</label>
          <Textarea
            placeholder={t("descriptionPlaceholder")}
            className="min-h-32"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("link")}</label>
          <Input placeholder={t("linkPlaceholder")} type="url" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("category")}</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {/* Categories populated from Supabase */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("image")}</label>
          <Input type="file" accept="image/*" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit">
            {promptId ? t("editPrompt") : t("addNew")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
