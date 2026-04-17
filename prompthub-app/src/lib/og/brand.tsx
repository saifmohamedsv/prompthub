import type { ReactNode } from "react";

/**
 * Design tokens mirrored from DESIGN.md.
 * CSS variables don't work in Satori — these must be literal hex values.
 */
export const BRAND = {
  parchment: "#f5f4ed",
  ivory: "#faf9f5",
  warmSand: "#e8e6dc",
  borderCream: "#f0eee6",
  terracotta: "#c96442",
  terracottaSoft: "rgba(201, 100, 66, 0.12)",
  nearBlack: "#141413",
  charcoalWarm: "#4d4c48",
  oliveGray: "#5e5d59",
  stoneGray: "#87867f",
  darkSurface: "#30302e",
  warmSilver: "#b0aea5",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

/**
 * Load Lora (serif) and Inter (sans) from Google Fonts for Satori rendering.
 * Returns an array suitable for the `fonts` option on `new ImageResponse(...)`.
 */
export async function loadOGFonts() {
  const [lora500, inter400, inter500] = await Promise.all([
    fetchFont("Lora", 500),
    fetchFont("Inter", 400),
    fetchFont("Inter", 500),
  ]);

  return [
    { name: "Lora", data: lora500, style: "normal" as const, weight: 500 as const },
    { name: "Inter", data: inter400, style: "normal" as const, weight: 400 as const },
    { name: "Inter", data: inter500, style: "normal" as const, weight: 500 as const },
  ];
}

async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&display=swap`;
  const css = await fetch(url, {
    headers: {
      // Old IE UA makes Google Fonts return TTF (Satori doesn't support woff2)
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
    },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) throw new Error(`Unable to parse font URL for ${family} ${weight}`);
  const res = await fetch(match[1]);
  return await res.arrayBuffer();
}

/** Compact inline SVG wordmark that mirrors the brand logo */
export function BrandMark({ color = BRAND.nearBlack, size = 36 }: { color?: string; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color }}
      >
        <path
          d="M19.6 1h24.7c5.2 0 9.4 4.2 9.4 9.4v28.3c0 5.2-4.2 9.4-9.4 9.4H32l-9 8v-8h-3.4c-5.2 0-9.4-4.2-9.4-9.4V10.4C10.2 5.2 14.4 1 19.6 1Zm12.6 7.5L19.6 31h9l-5 16 16-22h-9l5-16.5Z"
          fill="currentColor"
        />
      </svg>
      <span
        style={{
          fontSize: size * 0.72,
          fontFamily: "Lora",
          fontWeight: 500,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        Syntaxa
      </span>
    </div>
  );
}

/**
 * Parchment-background frame used by all OG images.
 * Handles absolute positioning, padding, and the bottom-bar attribution.
 */
export function OGFrame({
  children,
  accent = BRAND.terracotta,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        background: BRAND.parchment,
        fontFamily: "Inter",
        color: BRAND.nearBlack,
        padding: 64,
        position: "relative",
      }}
    >
      {/* Terracotta accent bar on the left edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          background: accent,
        }}
      />
      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        {children}
      </div>
      {/* Bottom attribution bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: 24,
          borderTop: `1px solid ${BRAND.borderCream}`,
          fontSize: 20,
          color: BRAND.stoneGray,
        }}
      >
        <span>syntaxa.dev</span>
        <span>Prompts that actually work</span>
      </div>
    </div>
  );
}
