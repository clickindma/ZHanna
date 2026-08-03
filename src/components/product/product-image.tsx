import { cn } from "@/lib/utils";
import { GemMark } from "@/components/layout/logo";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  name?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

/**
 * Renders the product image when available. Falls back to a branded
 * "Zhanna" placeholder so the catalogue always looks premium even before
 * photography is uploaded.
 */
export function ProductImage({
  src,
  alt,
  name,
  className,
  imgClassName,
  priority,
}: ProductImageProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      role="img"
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy-mid via-navy to-navy-deep",
        className
      )}
    >
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-16 -right-12 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-sapphire/25 blur-3xl" />

      <GemMark className="relative h-14 w-14 opacity-95 sm:h-16 sm:w-16" />
      <span className="relative mt-4 text-[10px] font-semibold tracking-[0.35em] text-gold-light/85 uppercase">
        Zhanna
      </span>
      {name && (
        <span className="relative mt-2 line-clamp-1 max-w-[78%] text-center text-xs text-white/45">
          {name}
        </span>
      )}
    </div>
  );
}
