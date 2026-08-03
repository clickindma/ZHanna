import { cn } from "@/lib/utils";

export function GemMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient id="zhGemTable" x1="24" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6FD7EE" />
          <stop offset="1" stopColor="#16B5D8" />
        </linearGradient>
        <linearGradient id="zhGemBody" x1="24" y1="12" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16B5D8" />
          <stop offset="0.55" stopColor="#0E8FB0" />
          <stop offset="1" stopColor="#0B6C88" />
        </linearGradient>
        <linearGradient id="zhGold" x1="16" y1="16" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9BE7F7" />
          <stop offset="1" stopColor="#16B5D8" />
        </linearGradient>
      </defs>

      <g>
        <path
          d="M24 3.5 L34.5 7.75 L40.5 16.25 L33.25 32 L24 44.5 L14.75 32 L7.5 16.25 L13.5 7.75 Z"
          fill="url(#zhGemBody)"
        />
        <path
          d="M24 3.5 L34.5 7.75 L40.5 16.25 L33.25 32 L24 44.5 L14.75 32 L7.5 16.25 L13.5 7.75 Z"
          stroke="#062B3A"
          strokeWidth="0.75"
        />
      </g>

      <g stroke="#16B5D8" strokeOpacity="0.85" strokeWidth="0.6">
        <path d="M13.5 7.75 L24 21 L34.5 7.75" />
        <path d="M7.5 16.25 L14.9 18.4 L24 21 L33.1 18.4 L40.5 16.25" />
        <path d="M14.75 32 L24 21 L33.25 32" />
        <path d="M24 44.5 L33.25 32 M24 44.5 L14.75 32" />
      </g>

      <path
        d="M24 9.5 L30.5 12 L33 18.25 L24 22 L15 18.25 L17.5 12 Z"
        fill="url(#zhGemTable)"
      />
      <path
        d="M24 9.5 L30.5 12 L33 18.25 L24 22 L15 18.25 L17.5 12 Z"
        stroke="#16B5D8"
        strokeOpacity="0.7"
        strokeWidth="0.55"
      />

      <g>
        <circle cx="24" cy="20.75" r="8.1" stroke="url(#zhGold)" strokeWidth="1.35" />
        <path
          d="M19.5 17.35 H28.5 L19.5 24.15 H28.5"
          stroke="url(#zhGold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  const wordmark = variant === "dark" ? "text-navy" : "text-white";
  const caption = variant === "dark" ? "text-sapphire/80" : "text-gold-light/90";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <GemMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-playfair text-2xl font-semibold tracking-[0.22em]",
            wordmark
          )}
        >
          ZHANNA
        </span>
        <span
          className={cn(
            "mt-1 text-[8.5px] font-medium uppercase tracking-[0.42em]",
            caption
          )}
        >
          Fine Jewellery
        </span>
      </span>
    </span>
  );
}
