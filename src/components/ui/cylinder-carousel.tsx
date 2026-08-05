import * as React from "react";
import { cn } from "@/lib/utils";

export interface CylinderImage {
  src: string;
  alt?: string;
}

interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: CylinderImage[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number;
  cardWidth?: number;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images = [],
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 250,
      ...props
    },
    ref,
  ) => {
    const n = images.length;

    return (
      <div
        ref={ref}
        className={cn("w-full min-h-[500px] h-full grid place-items-center overflow-hidden", className)}
        style={
          {
            "--n": n,
            "--w": `${cardWidth}px`,
            "--ba": `calc(1turn / var(--n))`,
            "--anim-dur": `${animationDuration}s`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={cn("relative grid place-items-center", containerClassName)}
          style={{
            perspective: "35em",
            maskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
          }}
        >
          <div
            className={cn(
              "relative w-full [grid-area:1/1] [transform-style:preserve-3d]",
              "motion-reduce:!animate-[ry_128s_linear_infinite]",
            )}
            style={{ animation: "ry var(--anim-dur) linear infinite" }}
          >
            {images.map(({ src, alt }, i) => (
              <img
                key={src + i}
                alt={alt ?? `Product image ${i + 1}`}
                src={src}
                className={cn(
                  "absolute inset-0 m-auto size-full rounded-2xl bg-white/10 object-cover",
                  "backface-hidden",
                  "shadow-[0_10px_40px_-8px_rgba(0,0,0,0.35)]",
                  cardClassName,
                )}
                style={
                  {
                    "--w": `${cardWidth}px`,
                    "--i": i,
                    width: "var(--w)",
                    aspectRatio: "7 / 10",
                    animation: "ry var(--anim-dur) linear infinite",
                    transform: "rotateY(calc(var(--i) * var(--ba))) translateZ(calc((0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
                    gridArea: "1 / 1",
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <style>
          {`@keyframes ry { to { transform: rotateY(1turn); } }`}
        </style>
      </div>
    );
  },
);

CylinderCarousel.displayName = "CylinderCarousel";
