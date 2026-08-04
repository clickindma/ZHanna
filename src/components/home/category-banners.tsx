"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { HomeCollectionContent } from "@/types/homepage";

const GRADIENTS = [
  "from-navy-brand via-[#0d2435] to-teal",
  "from-[#1a3040] via-navy-brand to-[#0d2a38]",
  "from-teal/80 via-navy-brand to-navy-brand",
];

export function CategoryBanners({
  collections,
}: {
  collections: HomeCollectionContent[];
}) {
  const visible = collections.filter((c) => c.enabled);
  if (visible.length === 0) return null;

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
                Shop by story
              </p>
              <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
                Featured Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden shrink-0 items-center gap-1.5 border-b border-gold/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark transition-colors hover:border-gold sm:inline-flex"
            >
              Explore all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-champagne-deep to-transparent" />
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((collection, i) => (
            <motion.div
              key={`${collection.title}-${i}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={i === 0 ? "md:col-span-2 xl:col-span-1" : ""}
            >
              <Link
                href={collection.ctaHref}
                className="group relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-18px_rgba(11,21,34,0.35)]"
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                />

                {/* Image */}
                {collection.image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-brand/85 via-navy-brand/35 to-transparent"
                      style={{ opacity: (collection.overlayOpacity ?? 66) / 100 }}
                    />
                  </>
                )}

                {/* Hover shade */}
                <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/25" />

                {/* Content */}
                <div className="relative p-7 sm:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-aqua">
                    {collection.eyebrow}
                  </p>
                  <h3 className="mt-2.5 font-playfair text-2xl font-semibold leading-tight text-snow sm:text-3xl">
                    {collection.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-silver/80">
                    {collection.subtitle}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua transition-colors duration-300 group-hover:text-snow">
                    {collection.ctaLabel}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-snow/70 transition-all duration-500 ease-out group-hover:w-full" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
