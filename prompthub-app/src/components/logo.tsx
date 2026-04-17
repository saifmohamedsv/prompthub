import { LogoIcon, LogoWordmark } from "./logo-svg";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  className?: string;
};

const logoHeight = {
  sm: 24,
  md: 32,
  lg: 44,
} as const;

const iconSize = {
  sm: 20,
  md: 28,
  lg: 36,
} as const;

export function Logo({ size = "md", iconOnly = false, className = "" }: LogoProps) {
  if (iconOnly) {
    const s = iconSize[size];
    return <LogoIcon width={s} height={s} className={className} />;
  }

  const h = logoHeight[size];

  return <LogoWordmark height={h} className={`text-foreground ${className}`} />;
}
