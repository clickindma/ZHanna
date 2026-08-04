"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PromoItem {
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

const PROMOS: PromoItem[] = [
  {
    tag: "Hot Sale",
    title: "Diamond Solitaire Rings",
    description: "Up to 40% off on statement rings",
    ctaLabel: "Shop Now",
    ctaHref: "/shop?category=rings",
    image: "/brand/collection-solitaire.jpg",
  },
  {
    tag: "New Collection",
    title: "Gold Hour Edit",
    description: "Warm metallics for golden-hour looks",
    ctaLabel: "Shop Now",
    ctaHref: "/shop?sort=newest",
    image: "/brand/collection-gold-hour.jpg",
  },
  {
    tag: "Bridal Season",
    title: "Bridal Bloom Sets",
    description: "Complete sets for the big day",
    ctaLabel: "Shop Now",
    ctaHref: "/shop?category=necklaces",
    image: "/brand/collection-bridal-bloom.jpg",
  },
];

export function PromoStrip() {
  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PROMOS.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={promo.ctaHref}
                className="group relative flex min-h-[13rem] items-stretch overflow-hidden rounded-2xl border border-champagne-deep bg-gradient-to-br from-parchment via-white to-ice shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_-18px_rgba(11,21,34,0.18)]"
              >
                {/* Text side */}
                <div className="relative z-10 flex w-[55%] flex-col justify-center p-6 sm:p-7">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-dark">
                    {promo.tag}
                  </p>
                  <h3 className="mt-2 font-playfair text-xl leading-tight text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark sm:text-2xl">
                    {promo.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    {promo.description}
                  </p>
                  <span className="relative mt-4 inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dark">
                    {promo.ctaLabel}
                    <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gold-dark transition-all duration-500 ease-out group-hover:w-full" />
                  </span>
                </div>

                {/* Image side */}
                <div className="relative w-[45%] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
