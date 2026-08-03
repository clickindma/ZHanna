"use client";

import Link from "next/link";
import { ArrowRight, Gem } from "lucide-react";

const PARTNER_BRANDS = [
  "Aurelia Diamonds",
  "GemVault",
  "Maison Royale",
  "Rajwada Heritage",
  "Surya Fine Cuts",
  "Opalina Atelier",
  "Regal Stones Co.",
  "Nirmal Artisans",
];

export function PartnerBrands() {
  const items = [...PARTNER_BRANDS, ...PARTNER_BRANDS];

  return (
    <section className="group relative overflow-hidden border-b border-silver/50 bg-ice/70">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-turquoise/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        {/* Heading */}
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-teal sm:text-[11px]">
            Trusted Partners
          </p>
          <h2 className="mt-3 font-playfair text-2xl font-medium text-charcoal-brand sm:text-3xl">
            Jewellery houses that craft with us
          </h2>
          <div className="mx-auto mt-4 flex w-40 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-turquoise to-transparent" />
            <span className="h-1.5 w-1.5 rotate-45 border border-turquoise/60 bg-turquoise/30" />
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-turquoise to-transparent" />
          </div>
        </div>

        {/* Marquee */}
        <div className="relative mt-10 overflow-hidden">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ice/90 to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ice/90 to-transparent sm:w-28" />

          <div
            className="flex animate-marquee items-center gap-12 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused] sm:gap-16"
            style={{ width: "fit-content" }}
          >
            {items.map((name, i) => (
              <span key={`${name}-${i}`} className="flex items-center gap-12 sm:gap-16">
                <span className="flex items-center gap-2.5">
                  <Gem className="h-4 w-4 text-turquoise/70" strokeWidth={1.4} />
                  <span className="font-playfair text-lg font-medium tracking-wide text-charcoal-brand/70 italic sm:text-xl">
                    {name}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* View more */}
        <div className="mt-10 text-center">
          <Link
            href="/about"
            className="group/link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-teal transition-colors duration-300 hover:text-turquoise"
          >
            View More Partners
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
