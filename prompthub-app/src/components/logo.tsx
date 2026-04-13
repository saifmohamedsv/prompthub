import Image from "next/image";

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
    return (
      <Image
        src="/icon.png"
        alt="Syntaxa"
        width={iconSize[size]}
        height={iconSize[size]}
        className={className}
        priority
      />
    );
  }

  const h = logoHeight[size];
  const w = h * 4;

  return (
    <>
      <Image
        src="/logo.png"
        alt="Syntaxa"
        height={h}
        width={w}
        className={`h-auto dark:hidden ${className}`}
        style={{ height: h, width: "auto" }}
        priority
      />
      <Image
        src="/logo-dark.png"
        alt="Syntaxa"
        height={h}
        width={w}
        className={`h-auto hidden dark:block ${className}`}
        style={{ height: h, width: "auto" }}
        priority
      />
    </>
  );
}
