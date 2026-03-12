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
    <span dir="ltr" className={`inline-flex items-center font-extrabold tracking-tight ${sizes[size]} ${className}`}>
      <span className="text-foreground">Prompt</span>
      <span className="rounded-md bg-primary px-1.5 py-0.5 text-primary-foreground">Hub</span>
    </span>
  );
}
