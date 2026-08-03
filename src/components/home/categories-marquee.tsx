"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeCategory {
  name: string;
  slug: string;
}

const FALLBACK_CATEGORIES: MarqueeCategory[] = [
  { name: "Rings", slug: "rings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Earrings", slug: "earrings" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Pendants", slug: "pendants" },
  { name: "Mangalsutra", slug: "mangalsutra" },
  { name: "Daily Wear", slug: "daily-wear" },
  { name: "Sets", slug: "sets" },
  { name: "For Men", slug: "for-men" },
  { name: "Gifting", slug: "gifting" },
];

export function CategoriesMarquee() {
  const [categories, setCategories] = useState<MarqueeCategory[]>(FALLBACK_CATEGORIES);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.categories?.length > 0) {
            setCategories(data.categories.map((c: { name: string; slug: string }) => ({
              name: c.name,
              slug: c.slug,
            })));
          }
        }
      } catch {
        // Use fallback
      }
    }
    fetchCategories();
  }, []);

  // Duplicate the list for seamless infinite scroll
  const duplicated = [...categories, ...categories, ...categories];

  return (
    <section
      className="relative overflow-hidden border-b border-silver/40 bg-snow py-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-snow to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-snow to-transparent" />

      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{ x: isPaused ? undefined : "-33.33%" }}
        transition={
          isPaused
            ? { duration: 0 }
            : {
                x: {
                  duration: 30,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }
        }
        style={{ width: "fit-content" }}
      >
        {duplicated.map((category, i) => (
          <Link
            key={`${category.slug}-${i}`}
            href={`/shop?category=${category.slug}`}
            className="group inline-flex items-center gap-2.5 rounded-full border border-silver/50 bg-ice/50 px-6 py-2.5 transition-all duration-400 hover:scale-105 hover:border-teal/50 hover:bg-teal/10 hover:shadow-[0_4px_16px_-4px_rgba(14,143,176,0.25)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal/60 transition-colors duration-300 group-hover:bg-teal" />
            <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal-brand transition-colors duration-300 group-hover:text-teal">
              {category.name}
            </span>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
