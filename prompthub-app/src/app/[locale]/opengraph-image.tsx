import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OG_CONTENT_TYPE, BrandMark, OGFrame, loadOGFonts } from "@/lib/og/brand";

export const runtime = "nodejs";
export const alt = "Syntaxa — Discover AI prompts that actually work";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  const fonts = await loadOGFonts();

  return new ImageResponse(
    (
      <OGFrame>
        <BrandMark size={44} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 24,
          }}
        >
          <div
            style={{
              fontFamily: "Lora",
              fontWeight: 500,
              fontSize: 88,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: BRAND.nearBlack,
              maxWidth: 1040,
            }}
          >
            Discover AI prompts that actually work.
          </div>

          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 28,
              lineHeight: 1.4,
              color: BRAND.oliveGray,
              maxWidth: 960,
            }}
          >
            1,600+ battle-tested prompts for ChatGPT, Claude, Midjourney, and more.
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {[
              "Writing",
              "Coding",
              "Marketing",
              "Creative",
              "Education",
            ].map((label) => (
              <span
                key={label}
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: 18,
                  color: BRAND.terracotta,
                  background: BRAND.terracottaSoft,
                  padding: "8px 18px",
                  borderRadius: 999,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </OGFrame>
    ),
    { ...size, fonts }
  );
}
