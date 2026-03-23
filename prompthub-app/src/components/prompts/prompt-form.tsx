"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Locale } from "@/lib/config";
import { toast } from "sonner";
import { X, Plus, Upload } from "lucide-react";
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
  const [showArabic, setShowArabic] = useState(false);

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
      if (existing.title_ar || existing.description_ar) {
        setShowArabic(true);
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
          router.push(routes.myPrompts);
        },
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("title")}</label>
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

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("description")}</label>
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

      <button
        type="button"
        onClick={() => setShowArabic(!showArabic)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {showArabic ? (
          <>
            <X className="size-4" />
            {t("removeArabicVersion")}
          </>
        ) : (
          <>
            <Plus className="size-4" />
            {t("addArabicVersion")}
          </>
        )}
      </button>

      {showArabic && (
        <div className="space-y-4 rounded-xl bg-surface-low p-5">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-bold text-foreground">{t("titleAr")}</label>
            <Input
              dir="rtl"
              placeholder={t("titleArPlaceholder")}
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-bold text-foreground">{t("descriptionAr")}</label>
            <Textarea
              dir="rtl"
              placeholder={t("descriptionArPlaceholder")}
              className="min-h-24"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("promptText")}</label>
        <Textarea
          dir="ltr"
          placeholder={t("promptTextPlaceholder")}
          className="min-h-32 font-mono text-sm"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t("promptTextHint")}</p>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("link")}</label>
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

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("category")}</label>
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

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("tags")}</label>
        <div dir="ltr" className="flex flex-wrap gap-2">
          {tags?.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-transparent bg-primary/20 text-primary"
                    : "border-transparent bg-surface-high text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag.name}
                {isSelected && <X className="size-3" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-bold text-foreground">{t("image")}</label>
        {imagePreview && (
          <div className="relative mb-3">
            <img
              src={imagePreview}
              alt=""
              className="h-40 w-full rounded-xl border object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 end-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border/30 bg-surface-lowest p-8 text-center transition-colors hover:border-primary/30"
        >
          <Upload className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dropImage")}</p>
          <p className="text-xs text-muted-foreground/70">{t("imageHint")}</p>
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="rounded-lg px-8 py-3">
          {isPending
            ? t("saving")
            : promptId
              ? t("editPrompt")
              : t("addNew")}
        </Button>
      </div>
    </form>
  );
}
