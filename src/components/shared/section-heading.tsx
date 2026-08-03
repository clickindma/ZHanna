"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-[0.42em]",
          light ? "text-gold-soft" : "text-gold-dark"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-4xl font-medium leading-[1.06] tracking-tight sm:text-5xl",
          light ? "text-ivory" : "text-emerald-deep"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "hairline-gold mt-6 h-px w-16",
          align === "center" && "mx-auto"
        )}
      />
    </Reveal>
  );
}
