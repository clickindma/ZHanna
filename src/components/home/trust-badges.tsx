"use client";

import { motion } from "framer-motion";
import { Award, Lock, Package, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import type { HomeTrustItemContent } from "@/types/homepage";

const ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCcw,
  sparkles: Package,
  award: Award,
  lock: Lock,
} as const;

const DEFAULT_BADGES = [
  { icon: "shield" as const, title: "Certified", subtitle: "Premium 925 Silver" },
  { icon: "refresh" as const, title: "Lifetime Exchange", subtitle: "Hassle-free returns" },
  { icon: "truck" as const, title: "Free Shipping", subtitle: "On orders above ₹499" },
  { icon: "award" as const, title: "Easy Returns", subtitle: "Within 7 days" },
  { icon: "lock" as const, title: "Secure Packaging", subtitle: "Gift-ready delivery" },
];

export function TrustBadges({ items }: { items: HomeTrustItemContent[] }) {
  const visible = items.filter((item) => item.enabled);
  const badges = visible.length > 0 ? visible : DEFAULT_BADGES;

  return (
    <section className="bg-ice">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((badge, i) => {
            const Icon = ICONS[badge.icon] ?? ShieldCheck;
            return (
              <motion.div
                key={`${badge.title}-${i}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                className="flex cursor-default flex-col items-center text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-silver/60 bg-snow shadow-sm transition-shadow duration-500 hover:shadow-[0_8px_24px_-8px_rgba(14,143,176,0.25)]">
                  <Icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-charcoal-brand">
                  {badge.title}
                </h3>
                <p className="mt-1 text-xs text-slate-brand">
                  {badge.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
