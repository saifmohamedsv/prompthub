"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { toast } from "sonner";
import { X } from "lucide-react";
import { routes } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { useAuth } from "@/hooks/use-auth";
import {
  usePromptDetail,
  useCreatePrompt,
  useUpdatePrompt,
} from "@/hooks/use-prompts";
import { uploadPromptImage } from "@/lib/supabase/queries";

type FormErrors = {
  title?: string;
  description?: string;
  category_id?: string;
  link?: string;
};

export function PromptForm({ promptId }: { promptId?: string }) {
  const t = useTranslations("prompt");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data: existing } = usePromptDetail(promptId ?? "");
  const createMutation = useCreatePrompt();
  const updateMutation = useUpdatePrompt();
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [promptText, setPromptText] = useState("");
  const [link, setLink] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill form in edit mode
  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setTitleAr(existing.title_ar ?? "");
      setDescription(existing.description);
      setDescriptionAr(existing.description_ar ?? "");
      setPromptText(existing.prompt_text ?? "");
      setLink(existing.link ?? "");
      setCategoryId(existing.category_id ?? "");
      setImagePreview(existing.image_url ?? null);
      if (existing.prompt_tags?.length) {
        setSelectedTagIds(existing.prompt_tags.map((pt) => pt.tags.id));
      }
    }
  }, [existing]);

  const selectedCategoryLabel = (() => {
    if (!categoryId) return t("selectCategory");
    const cat = categories?.find((c) => c.id === categoryId);
    if (!cat) return t("selectCategory");
    return locale === Locale.AR ? cat.name_ar : cat.name;
  })();

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = t("titleRequired");
    if (!description.trim()) errs.description = t("descriptionRequired");
    if (!categoryId) errs.category_id = t("categoryRequired");
    if (link.trim()) {
      try {
        new URL(link.trim());
      } catch {
        errs.link = t("invalidUrl");
      }
    }
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Upload image if a new file was selected
    let imageUrl: string | null = null;
    const file = fileInputRef.current?.files?.[0];
    if (file && user) {
      try {
        setIsUploading(true);
        imageUrl = await uploadPromptImage(user.id, file);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Image upload failed");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    } else if (imagePreview && imagePreview.startsWith("http")) {
      imageUrl = imagePreview;
    }

    const payload = {
      title: title.trim(),
      title_ar: titleAr.trim() || null,
      description: description.trim(),
      description_ar: descriptionAr.trim() || null,
      prompt_text: promptText.trim() || null,
      link: link.trim() || null,
      category_id: categoryId,
      image_url: imageUrl,
      tag_ids: selectedTagIds,
    };

    if (promptId) {
      updateMutation.mutate(
        { id: promptId, ...payload },
        {
          onSuccess: () => {
            toast.success(t("updateSuccess"));
            router.push(routes.myPrompts);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(t("createSuccess"));
          router.push("/my-prompts");
        },
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("title")}</label>
              <Input
                placeholder={t("titlePlaceholder")}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                }}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("titleAr")}</label>
              <Input
                dir="rtl"
                placeholder={t("titleArPlaceholder")}
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("description")}</label>
              <Textarea
                placeholder={t("descriptionPlaceholder")}
                className="min-h-24"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((p) => ({ ...p, description: undefined }));
                }}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("descriptionAr")}</label>
              <Textarea
                dir="rtl"
                placeholder={t("descriptionArPlaceholder")}
                className="min-h-24"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("promptText")}</label>
            <Textarea
              placeholder={t("promptTextPlaceholder")}
              className="min-h-32 font-mono text-sm"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("promptTextHint")}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("link")}</label>
            <Input
              placeholder={t("linkPlaceholder")}
              type="url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (errors.link) setErrors((p) => ({ ...p, link: undefined }));
              }}
            />
            {errors.link && (
              <p className="text-sm text-destructive">{errors.link}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("category")}</label>
            <Select
              value={categoryId}
              onValueChange={(v) => {
                setCategoryId(v ?? "");
                if (errors.category_id)
                  setErrors((p) => ({ ...p, category_id: undefined }));
              }}
            >
              <SelectTrigger>
                <span>{selectedCategoryLabel}</span>
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {locale === Locale.AR ? cat.name_ar : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("tags")}</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {tag.name}
                    {isSelected && <X className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("image")}</label>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt=""
                  className="h-40 w-full rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("saving")
                : promptId
                  ? t("editPrompt")
                  : t("addNew")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
