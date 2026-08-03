import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BRAND } from "@/lib/constants";

interface AuthLayoutProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-sapphire/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-44 -bottom-52 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-[160px]" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Zhanna
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full max-w-[430px]">
            <div className="flex flex-col items-center text-center">
              <BrandLogo className="h-16 w-auto" priority />
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-playfair text-4xl leading-tight tracking-tight sm:text-[2.75rem]">
                {title}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                {subtitle}
              </p>
              <div className="mt-9 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>

            <div className="relative mt-10 rounded-2xl border border-gold/25 bg-white/[0.05] p-6 shadow-[0_30px_80px_-20px_rgba(7,18,38,0.9)] backdrop-blur-xl sm:p-9">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              {children}
            </div>

            <div className="mt-8 text-center text-sm text-white/50">{footer}</div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
          {BRAND.company} · TM {BRAND.trademarkNumber} · {BRAND.trademarkClass}
        </p>
      </div>
    </section>
  );
}
