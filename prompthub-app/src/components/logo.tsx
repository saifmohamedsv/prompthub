type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "text-lg gap-1.5",
  md: "text-xl gap-2",
  lg: "text-3xl gap-2.5 sm:text-4xl",
} as const;

const iconSizes = {
  sm: "size-5",
  md: "size-6",
  lg: "size-8 sm:size-9",
} as const;

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span dir="ltr" className={`inline-flex items-center font-extrabold tracking-tight ${sizes[size]} ${className}`}>
      <SparkIcon className={iconSizes[size]} />
      <span>
        <span className="text-foreground">Syntax</span>
        <span className="text-primary">a</span>
      </span>
    </span>
  );
}
