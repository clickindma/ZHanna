"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeGenderTileContent } from "@/types/homepage";

export function ShopByGender({ tiles }: { tiles: HomeGenderTileContent[] }) {
  const visible = tiles.filter((tile) => tile.enabled);
  if (visible.length === 0) return null;

  return (
    <section className="bg-ice/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((tile, i) => (
            <motion.div
              key={`${tile.title}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={tile.ctaHref}
                className="group relative block min-h-[22rem] overflow-hidden rounded-xl transition-transform duration-500 hover:-translate-y-1 sm:min-h-[28rem]"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 ${i === 0 ? "bg-gradient-to-br from-navy-brand via-[#0d2838] to-teal/70" : "bg-gradient-to-br from-[#1e293b] via-navy-brand to-[#0b2030]"} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                />

                {/* Image if available */}
                {tile.image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tile.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-brand/80 via-navy-brand/40 to-transparent"
                      style={{ opacity: (tile.overlayOpacity ?? 70) / 100 }}
                    />
                  </>
                )}

                {/* Decorative ring */}
                <div className="pointer-events-none absolute -right-10 top-10 h-44 w-44 rounded-full border border-aqua/10" />

                {/* Content */}
                <div className="relative flex h-full min-h-[22rem] flex-col justify-between p-8 sm:min-h-[28rem] sm:p-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-aqua/80">
                    {tile.eyebrow}
                  </p>

                  <div>
                    <h3 className="font-playfair text-4xl font-semibold leading-tight text-snow sm:text-5xl">
                      {tile.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-silver/75">
                      {tile.subtitle}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 border-b border-aqua/50 pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua transition-all duration-300 group-hover:border-snow group-hover:text-snow">
                      {tile.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
