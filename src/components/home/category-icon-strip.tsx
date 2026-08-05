"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Circle, CircleDot, Flower2, Gem, Link2, Sparkles } from "lucide-react";

interface IconStripItem {
  label: string;
  slug: string;
  icon: React.ElementType;
}

const ITEMS: IconStripItem[] = [
  { label: "Earrings", slug: "earrings", icon: Gem },
  { label: "Chains", slug: "chains", icon: Link2 },
  { label: "Finger Rings", slug: "rings", icon: CircleDot },
  { label: "Bangles", slug: "bangles", icon: Circle },
  { label: "Necklaces", slug: "necklaces", icon: Flower2 },
  { label: "Pendants", slug: "pendants", icon: Sparkles },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function CategoryIconStrip() {
  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-6 sm:gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              >
                <Link
                  href={`/shop?category=${item.slug}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-champagne-deep bg-ivory text-gold-dark shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-turquoise group-hover:bg-turquoise group-hover:text-navy-brand group-hover:shadow-[0_14px_30px_-10px_rgba(22,181,216,0.5)] sm:h-[4.5rem] sm:w-[4.5rem]">
                    <Icon
                      className="h-6 w-6 transition-transform duration-300 ease-out group-hover:rotate-[8deg] group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
