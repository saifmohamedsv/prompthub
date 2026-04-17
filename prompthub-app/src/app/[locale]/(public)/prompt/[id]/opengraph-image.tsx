import { ImageResponse } from "next/og";
import { fetchPromptForOG } from "@/lib/og/data";
import { getModelName } from "@/lib/config";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  BrandMark,
  OGFrame,
  loadOGFonts,
} from "@/lib/og/brand";

export const runtime = "nodejs";
export const alt = "Syntaxa prompt preview";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function PromptOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const fonts = await loadOGFonts();
  const prompt = await fetchPromptForOG(id);

  // Fallback to site-wide layout if the prompt can't be loaded
  if (!prompt) {
    return new ImageResponse(
      (
        <OGFrame>
          <BrandMark size={44} />
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontFamily: "Lora",
              fontWeight: 500,
              fontSize: 72,
              color: BRAND.nearBlack,
            }}
          >
            A prompt on Syntaxa
          </div>
        </OGFrame>
      ),
      { ...size, fonts }
    );
  }

  const authorName =
    prompt.profiles?.full_name ??
    prompt.profiles?.username ??
    prompt.source_contributor ??
    "Syntaxa";
  const categoryName = prompt.categories?.name;
  const models = (prompt.best_with_models ?? []).slice(0, 3).map(getModelName);

  return new ImageResponse(
    (
      <OGFrame>
        {/* Top row: brand mark + category pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <BrandMark size={36} />
          {categoryName && (
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: BRAND.terracotta,
                background: BRAND.terracottaSoft,
                padding: "8px 18px",
                borderRadius: 999,
              }}
            >
              {categoryName}
            </span>
          )}
        </div>

        {/* Middle: title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 48,
            flex: 1,
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: "Lora",
              fontWeight: 500,
              fontSize: 68,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: BRAND.nearBlack,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxWidth: 1040,
            }}
          >
            {prompt.title}
          </div>
          {prompt.description && (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 26,
                lineHeight: 1.45,
                color: BRAND.oliveGray,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: 1040,
              }}
            >
              {prompt.description}
            </div>
          )}

          {models.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {models.map((m) => (
                <span
                  key={m}
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: 16,
                    color: BRAND.charcoalWarm,
                    background: BRAND.warmSand,
                    padding: "6px 14px",
                    borderRadius: 8,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author + stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: "Inter",
              fontSize: 22,
              color: BRAND.charcoalWarm,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: BRAND.warmSand,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Lora",
                fontWeight: 500,
                fontSize: 22,
                color: BRAND.terracotta,
              }}
            >
              {(authorName[0] ?? "S").toUpperCase()}
            </div>
            <span style={{ fontWeight: 500 }}>by {authorName}</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              fontFamily: "Inter",
              fontSize: 20,
              color: BRAND.oliveGray,
            }}
          >
            <span>👁 {prompt.views_count.toLocaleString()} views</span>
            <span>▲ {prompt.likes_count.toLocaleString()} upvotes</span>
          </div>
        </div>
      </OGFrame>
    ),
    { ...size, fonts }
  );
}
