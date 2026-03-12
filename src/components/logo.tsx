type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl sm:text-4xl",
} as const;

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span dir="ltr" className={`inline-flex items-baseline font-semibold tracking-tight ${sizes[size]} ${className}`}>
      <span className="text-foreground">prompt</span>
      <span className="text-primary">hub</span>
      <span className="mb-auto ml-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
    </span>
  );
}
