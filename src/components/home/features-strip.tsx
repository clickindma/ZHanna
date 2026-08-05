"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Gem,
  Lock,
  Package,
  RefreshCcw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { HomeTrustItemContent } from "@/types/homepage";
import { ShaderBackground } from "@/components/ui/manu";

const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCcw,
  sparkles: Package,
  award: Award,
  lock: Lock,
  gem: Gem,
};

const DEFAULT_BADGES = [
  { icon: "shield", title: "Certified Quality", subtitle: "Premium 925 silver & AAA cubic zirconia" },
  { icon: "truck", title: "Free Shipping", subtitle: "On all orders above ₹499" },
  { icon: "refresh", title: "Lifetime Exchange", subtitle: "Hassle-free returns within 7 days" },
  { icon: "award", title: "Handcrafted", subtitle: "Individually polished and finished" },
];

export interface FeatureStat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

function CountUp({ value, decimals = 0, suffix = "", prefix = "" }: FeatureStat & { prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [display, setDisplay] = useState(decimals > 0 ? value.toFixed(decimals) : "0");

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame = 0;
    const duration = 1700;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

interface FeaturesStripProps {
  badges: HomeTrustItemContent[];
  stats: FeatureStat[];
}

export function FeaturesStrip({ badges, stats }: FeaturesStripProps) {
  const enabled = badges.filter((badge) => badge.enabled);
  const items = enabled.length > 0 ? enabled.slice(0, 4) : DEFAULT_BADGES;

  return (
    <section className="relative overflow-hidden bg-navy-brand">
      <ShaderBackground className="absolute inset-0 h-full w-full" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-navy-brand/55" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-teal/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Trust columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {items.map((badge, i) => {
            const Icon = ICONS[badge.icon] ?? ShieldCheck;
            return (
              <motion.div
                key={`${badge.title}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-light shadow-[0_0_30px_-8px_rgba(22,181,216,0.4)] transition-all duration-500 group-hover:scale-110">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <h3 className="mt-4 font-playfair text-lg text-snow">{badge.title}</h3>
                <p className="mt-1.5 max-w-[13rem] text-[12px] leading-relaxed text-silver/65">
                  {badge.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Counter stats */}
        {stats.length > 0 && (
          <>
            <div className="mt-14 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="font-playfair text-4xl font-semibold text-gold-light sm:text-5xl">
                    <CountUp {...stat} />
                  </span>
                  <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-silver/60">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
