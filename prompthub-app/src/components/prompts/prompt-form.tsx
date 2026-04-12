"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { X, Upload, Sparkles, Shield, Tag } from "lucide-react";
import { routes } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { useAuth } from "@/hooks/use-auth";
import { usePromptDetail, useCreatePrompt, useUpdatePrompt } from "@/hooks/use-prompts";
import { uploadPromptImage } from "@/lib/supabase/queries";

type FormErrors = {
  title?: string;
  description?: string;
  category_id?: string;
  link?: string;
};

export function PromptForm({ promptId }: { promptId?: string }) {
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data: existing } = usePromptDetail(promptId ?? "");
  const createMutation = useCreatePrompt();
  const updateMutation = useUpdatePrompt();
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [link, setLink] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
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
    return cat.name;
  })();

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
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
      description: description.trim(),
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
        },
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
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Title + Category — two-column row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("title")}</label>
          <Input
            placeholder={t("titlePlaceholder")}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
          />
          {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("category")}</label>
          <Select
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v ?? "");
              if (errors.category_id) setErrors((p) => ({ ...p, category_id: undefined }));
            }}
          >
            <SelectTrigger>
              <span>{selectedCategoryLabel}</span>
            </SelectTrigger>
            <SelectContent>
              {categories
                ?.slice()
                .sort((a, b) => (a.slug === "other" ? 1 : b.slug === "other" ? -1 : 0))
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="mt-1 text-sm text-destructive">{errors.category_id}</p>}
        </div>
      </div>

      {/* Description / Detailed Objective */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("detailedObjective")}</label>
        <Textarea
          placeholder={t("descriptionPlaceholder")}
          className="min-h-[100px]"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((p) => ({ ...p, description: undefined }));
          }}
        />
        {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
      </div>

      {/* Prompt Syntax — monospace recessed textarea */}
      <div className="flex flex-col">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("promptSyntaxLabel")}</label>
          <span className="text-xs text-muted-foreground">{t("charCount", { count: promptText.length })}</span>
        </div>
        <Textarea dir="ltr" placeholder={t("promptTextPlaceholder")} className="min-h-32 bg-background font-mono text-sm" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
        <p className="mt-1 text-xs text-muted-foreground">{t("promptTextHint")}</p>
      </div>

      {/* Link */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("link")}</label>
        <Input
          placeholder={t("linkPlaceholder")}
          type="url"
          dir="ltr"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            if (errors.link) setErrors((p) => ({ ...p, link: undefined }));
          }}
        />
        {errors.link && <p className="mt-1 text-sm text-destructive">{errors.link}</p>}
      </div>

      {/* Tags */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("tags")}</label>
        <div dir="ltr" className="flex flex-wrap gap-2">
          {tags?.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected ? "border-brand/20 bg-brand-muted text-brand" : "border-transparent bg-surface-3 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag.name}
                {isSelected && <X className="size-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image upload */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("image")}</label>
        {imagePreview && (
          <div className="relative mb-3">
            <img src={imagePreview} alt="" className="h-40 w-full rounded-xl border object-cover" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border/30 bg-background p-8 text-center transition-colors hover:border-brand/20"
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

      {/* Submit row — Cancel + Submit */}
      <div className="flex justify-start gap-3 pt-4">
        <Button type="submit" disabled={isPending} className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground hover:bg-brand-hover">
          {isPending ? t("saving") : promptId ? t("editPrompt") : t("addNew")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(routes.myPrompts)} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium">
          {tCommon("cancel")}
        </Button>
      </div>

      {/* Feature tips */}
      <div className="grid gap-4 pt-6 sm:grid-cols-3">
        {[
          { icon: Sparkles, title: t("tip1Title"), desc: t("tip1Desc") },
          { icon: Shield, title: t("tip2Title"), desc: t("tip2Desc") },
          { icon: Tag, title: t("tip3Title"), desc: t("tip3Desc") },
        ].map(({ icon: Icon, title: tipTitle, desc }) => (
          <div key={tipTitle} className="rounded-xl bg-surface-1 p-4 shadow-sm">
            <Icon className="mb-2 size-5 text-primary" />
            <h4 className="text-sm font-bold">{tipTitle}</h4>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </form>
  );
}
