import { ImageResponse } from "next/og";
import { fetchProfileForOG, fetchUserPromptStatsForOG } from "@/lib/og/data";
import {
  BRAND,
  OG_SIZE,
  OG_CONTENT_TYPE,
  BrandMark,
  OGFrame,
  loadOGFonts,
} from "@/lib/og/brand";

export const runtime = "nodejs";
export const alt = "Syntaxa user profile";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function UserOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const fonts = await loadOGFonts();
  const [profile, stats] = await Promise.all([
    fetchProfileForOG(id),
    fetchUserPromptStatsForOG(id),
  ]);

  if (!profile) {
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
            A creator on Syntaxa
          </div>
        </OGFrame>
      ),
      { ...size, fonts }
    );
  }

  const displayName = profile.full_name ?? profile.username ?? "Syntaxa member";
  const handle = profile.username ? `@${profile.username}` : "";
  const promptCount = stats.count;
  const totalLikes = stats.totalLikes;
  const totalViews = stats.totalViews;

  return new ImageResponse(
    (
      <OGFrame>
        <BrandMark size={36} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: 48,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 999,
              background: BRAND.warmSand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Lora",
              fontWeight: 500,
              fontSize: 72,
              color: BRAND.terracotta,
              border: `4px solid ${BRAND.ivory}`,
            }}
          >
            {(displayName[0] ?? "S").toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                fontFamily: "Lora",
                fontWeight: 500,
                fontSize: 60,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: BRAND.nearBlack,
              }}
            >
              {displayName}
            </div>
            {handle && (
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 24,
                  color: BRAND.stoneGray,
                }}
              >
                {handle}
              </div>
            )}
          </div>
        </div>

        {/* Stat chips */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: "auto",
            marginBottom: 24,
          }}
        >
          <StatChip label="Prompts" value={promptCount.toLocaleString()} />
          <StatChip label="Upvotes" value={totalLikes.toLocaleString()} />
          <StatChip label="Views" value={totalViews.toLocaleString()} />
        </div>
      </OGFrame>
    ),
    { ...size, fonts }
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px 32px",
        background: BRAND.ivory,
        border: `1px solid ${BRAND.borderCream}`,
        borderRadius: 16,
        minWidth: 180,
      }}
    >
      <span
        style={{
          fontFamily: "Lora",
          fontWeight: 500,
          fontSize: 40,
          color: BRAND.nearBlack,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Inter",
          fontSize: 18,
          color: BRAND.stoneGray,
          marginTop: 6,
        }}
      >
        {label}
      </span>
    </div>
  );
}
