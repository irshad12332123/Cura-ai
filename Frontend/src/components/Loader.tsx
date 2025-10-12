
const SIZE_MAP = {
  xs: 16,
  sm: 20,
  md: 28,
  lg: 40,
  xl: 56,
};

type LoaderSize = keyof typeof SIZE_MAP;

interface LoaderProps {
  variant?: "spinner" | "dots" | "skeleton" | "bar";
  size?: LoaderSize;
  className?: string;
  colorClass?: string;
  label?: string;
  ariaLive?: "polite" | "assertive" | "off";
}

export default function Loader({
  variant = "spinner",
  size = "md",
  className = "",
  colorClass = "text-gray-700",
  label = "Loading",
  ariaLive = "polite",
}: LoaderProps) {
  const px = SIZE_MAP[size ?? "md"];

  return (
    <div
      role="status"
      aria-live={ariaLive}
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <style>{`
        @keyframes loader-slide { 
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {variant === "spinner" && (
        <svg
          width={px}
          height={px}
          viewBox="0 0 50 50"
          className={`animate-spin ${colorClass}`}
          aria-hidden="true"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeOpacity="0.15"
          />
          <path
            fill="currentColor"
            d="M43.94 25c0-10.46-8.48-18.94-18.94-18.94-10.46 0-18.94 8.48-18.94 18.94h6.07c0-7.06 5.82-12.88 12.88-12.88 7.06 0 12.88 5.82 12.88 12.88H43.94z"
            className="opacity-90"
          />
        </svg>
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${colorClass} inline-block rounded-full`}
              style={{
                width: px / 4,
                height: px / 4,
                animation: `loader-dot 1s ${i * 0.12}s infinite ease-in-out`,
                display: "inline-block",
              }}
            />
          ))}

          <style>{`
            @keyframes loader-dot {
              0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
              40% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {variant === "skeleton" && (
        <div
          className={`rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse`}
          style={{ width: px * 3, height: px / 1.6 }}
          aria-hidden="true"
        />
      )}

      {variant === "bar" && (
        <div
          className="relative overflow-hidden rounded-full bg-gray-200/60 dark:bg-gray-700/50"
          style={{ width: px * 3.5, height: px / 6 }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "40%",
              transform: "translateX(-100%)",
              animation: "loader-slide 1.2s linear infinite",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.25), rgba(255,255,255,0))",
            }}
          />
        </div>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}
