"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SplitPromo() {
  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Overlapping images */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative mx-auto w-full max-w-md"
          >
            <div className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(11,21,34,0.35)]">
              <Image
                src="/brand/collection-solitaire.jpg"
                alt="Solitaire jewellery detail"
                fill
                sizes="(max-width: 1024px) 78vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/10" />
            </div>

            <div className="absolute right-0 bottom-0 w-[46%] overflow-hidden rounded-2xl border-[6px] border-ivory shadow-[0_20px_50px_-20px_rgba(11,21,34,0.45)] transition-transform duration-700 ease-out group-hover:translate-y-[-10px] group-hover:scale-[1.04]">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/brand/collection-gold-hour.jpg"
                  alt="Gold hour styling"
                  fill
                  sizes="(max-width: 1024px) 46vw, 240px"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-dark">
              The Zhanna Edit
            </p>
            <h2 className="mt-3 font-playfair text-3xl font-semibold leading-tight tracking-tight text-emerald-deep sm:text-4xl lg:text-[2.6rem]">
              A collection inspired by quiet luxury and everyday radiance.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Each piece is hand-finished in rhodium-plated silver and set with
              precision-cut artificial diamonds — designed to move from desk to
              dinner, from ceremony to every morning after.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 rounded-full bg-turquoise px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-navy-brand uppercase shadow-[0_16px_36px_-14px_rgba(22,181,216,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua active:scale-[0.98]"
              >
                Explore More
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="text-[11px] font-semibold tracking-[0.22em] text-emerald-deep uppercase underline-offset-8 transition-colors duration-300 hover:text-gold-dark hover:underline"
              >
                Our craft
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
