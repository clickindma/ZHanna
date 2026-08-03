import { Gem } from "lucide-react";
import { BRAND } from "@/lib/constants";

const STATS = [
  { value: "4.9★", label: "Average customer rating" },
  { value: "500+", label: "Handcrafted designs" },
  { value: "100%", label: "Anti-tarnish promise" },
  { value: "7-Day", label: "Easy returns" },
];

export function CraftSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-sapphire/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">
            The House of Zhanna
          </p>
          <h2 className="mt-5 font-playfair text-4xl font-medium leading-tight sm:text-5xl">
            Crafted with reverence,{" "}
            <span className="text-gradient-gold italic">finished with obsession.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/60">
            Behind every Zhanna creation lies hours of meticulous craftsmanship —
            from hand-polished artificial diamonds to hand-finished oxidized silver.
            We believe luxury is not in the metal, but in the feeling a piece
            awakens when worn.
          </p>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
            As a registered house under {BRAND.company}, our craftsmanship is
            protected and our promise is absolute:{" "}
            <span className="text-gold-light">brilliance, always.</span>
          </p>

          <div className="mt-9 inline-flex items-center gap-3 rounded-lg border border-gold/30 bg-gold/10 px-5 py-3.5">
            <Gem className="h-5 w-5 text-gold" />
            <div className="text-sm">
              <p className="font-medium text-gold-light">Trademark No. {BRAND.trademarkNumber}</p>
              <p className="text-xs text-white/50">Registered · {BRAND.trademarkClass} · Trade Marks Act, 1999</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-navy-deep p-8 transition-colors duration-300 hover:bg-navy-mid sm:p-10">
              <p className="font-playfair text-4xl font-medium text-gold-light sm:text-5xl">
                {stat.value}
              </p>
              <div className="mt-3 h-px w-8 bg-gold/60" />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/55">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
