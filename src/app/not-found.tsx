import Link from "next/link";
import { ArrowLeft, Gem, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-navy-deep text-ivory">
      {/* Noise texture overlay */}
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/3 left-0 h-48 w-48 rounded-full bg-gold-dark/8 blur-[80px]" />

      {/* Subtle diagonal lines pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 80px, #16b5d8 80px, #16b5d8 81px)",
        }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        {/* Decorative diamond shapes */}
        <div className="pointer-events-none absolute left-[15%] top-[20%] hidden opacity-20 md:block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#16b5d8" strokeWidth="1" />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-[25%] right-[12%] hidden opacity-15 md:block">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#16b5d8" strokeWidth="0.75" />
          </svg>
        </div>
        <div className="pointer-events-none absolute right-[20%] top-[30%] hidden opacity-10 md:block">
          <Sparkles className="h-5 w-5 text-gold" />
        </div>

        {/* Large 404 number */}
        <div className="mb-8 select-none">
          <p className="font-display text-[8rem] leading-none font-semibold italic sm:text-[11rem] md:text-[14rem]">
            <span className="bg-gradient-to-b from-gold via-gold-dark to-gold/20 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(22,181,216,0.15)]">
              404
            </span>
          </p>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.3em] text-gold uppercase backdrop-blur-sm">
          <Gem className="h-3.5 w-3.5" />
          Lost in the collection
        </span>

        {/* Heading */}
        <h1 className="mt-6 font-playfair text-3xl text-ivory sm:text-4xl md:text-5xl">
          This piece doesn&apos;t exist
        </h1>

        {/* Decorative hairline */}
        <div className="hairline-gold mx-auto mt-5 h-px w-32" />

        {/* Description */}
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/60 sm:text-base">
          The page you&apos;re looking for may have been sold, renamed, or never
          crafted. Let&apos;s bring you back to the jewellery that&apos;s
          waiting.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase shadow-[0_0_20px_rgba(22,181,216,0.2)] transition-all duration-300 hover:bg-gold-dark hover:text-white hover:shadow-[0_0_30px_rgba(22,181,216,0.3)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Return Home
          </Link>
          <Link
            href="/shop"
            className="group inline-flex items-center rounded-full border border-gold/40 px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(22,181,216,0.1)]"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            Browse Collection
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative flex flex-col items-center gap-3 pb-10">
        <div className="rounded-full bg-ivory/10 px-5 py-2 backdrop-blur-sm">
          <BrandLogo className="h-8 w-auto" />
        </div>
        <p className="text-[11px] tracking-wide text-ivory/40">
          {BRAND.name} · {BRAND.tagline}
        </p>
      </footer>
    </main>
  );
}
