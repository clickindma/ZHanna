"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeCollectionContent } from "@/types/homepage";

const GRADIENTS = [
  "from-navy-brand via-[#0d2435] to-teal",
  "from-[#1a3040] via-navy-brand to-[#0d2a38]",
  "from-teal/80 via-navy-brand to-navy-brand",
];

export function CampaignSection({ collections }: { collections: HomeCollectionContent[] }) {
  const visible = collections.filter((c) => c.enabled);
  if (visible.length === 0) return null;

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-playfair text-3xl font-semibold tracking-tight text-charcoal-brand sm:text-4xl lg:text-5xl">
            Our Collections
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-teal to-transparent" />
        </div>

        {/* Grid: 1 large + 2 small OR 2x2 depending on count */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {visible.map((collection, i) => {
            const isFirst = i === 0;
            return (
              <motion.div
                key={`${collection.title}-${i}`}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={isFirst ? "lg:row-span-2" : ""}
              >
                <Link
                  href={collection.ctaHref}
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-xl transition-transform duration-500 hover:-translate-y-1 ${isFirst ? "min-h-[24rem] lg:min-h-full" : "min-h-[18rem]"}`}
                >
                  {/* Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                  />

                  {/* Image if available */}
                  {collection.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={collection.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-navy-brand/80 via-navy-brand/40 to-transparent"
                        style={{ opacity: (collection.overlayOpacity ?? 66) / 100 }}
                      />
                    </>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/20" />

                  {/* Content */}
                  <div className="relative p-8 sm:p-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-aqua">
                      {collection.eyebrow}
                    </p>
                    <h3 className="mt-3 font-playfair text-3xl font-semibold leading-tight text-snow sm:text-4xl">
                      {collection.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-silver/75">
                      {collection.subtitle}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 border-b border-aqua/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua transition-all duration-300 group-hover:border-snow group-hover:text-snow">
                      {collection.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
