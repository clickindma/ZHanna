"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { HomeCollectionContent } from "@/types/homepage";
import { cn } from "@/lib/utils";

const TEXT_GRADIENTS = [
  "bg-gradient-to-br from-navy-brand via-[#0d2435] to-teal",
  "bg-gradient-to-br from-[#1a3040] via-navy-brand to-[#0d2a38]",
];

export function CategoryBanners({
  collections,
}: {
  collections: HomeCollectionContent[];
}) {
  const visible = collections.filter((c) => c.enabled).slice(0, 2);
  if (visible.length === 0) return null;

  return (
    <section className="bg-transparent">
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
                Dazzle in every moment
              </p>
              <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
                Featured Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden shrink-0 items-center gap-1.5 border-b border-gold/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark transition-colors hover:border-gold sm:inline-flex"
            >
              Shop Now
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-champagne-deep to-transparent" />
        </motion.div>

        <div className="mt-8 space-y-6">
          {visible.map((collection, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={`${collection.title}-${i}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={collection.ctaHref}
                  className="group grid overflow-hidden rounded-2xl bg-ivory shadow-sm ring-1 ring-champagne-deep/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(11,21,34,0.35)] md:grid-cols-2"
                >
                  {/* Image */}
                  <div
                    className={cn(
                      "relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem]",
                      reversed && "md:order-2"
                    )}
                  >
                    {collection.image && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-navy-brand/40 to-transparent md:bg-gradient-to-r"
                          style={
                            reversed
                              ? {
                                  backgroundImage:
                                    "linear-gradient(to left, rgba(11,21,34,0.45), transparent)",
                                }
                              : {
                                  backgroundImage:
                                    "linear-gradient(to right, rgba(11,21,34,0.45), transparent)",
                                }
                          }
                        />
                      </>
                    )}
                  </div>

                  {/* Copy */}
                  <div
                    className={cn(
                      `relative flex flex-col justify-center ${TEXT_GRADIENTS[i % TEXT_GRADIENTS.length]} p-8 sm:p-10 lg:p-12`,
                      reversed && "md:order-1"
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-aqua">
                      {collection.eyebrow}
                    </p>
                    <h3 className="mt-3 font-playfair text-2xl font-semibold leading-tight text-snow sm:text-3xl">
                      {collection.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[13px] leading-relaxed text-silver/80">
                      {collection.subtitle}
                    </p>

                    <span className="group/btn mt-7 inline-flex w-fit items-center gap-2.5 rounded-full bg-turquoise px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-navy-brand uppercase shadow-[0_14px_30px_-12px_rgba(22,181,216,0.5)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua active:scale-[0.98]">
                      {collection.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
