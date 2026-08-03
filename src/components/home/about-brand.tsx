"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomeAboutContent } from "@/types/homepage";

export function AboutBrand({ about }: { about: HomeAboutContent }) {
  if (!about.enabled) return null;

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-silver/50 bg-gradient-to-b from-ice via-snow to-ice shadow-[0_30px_60px_-20px_rgba(14,143,176,0.15)]">
              {about.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.image}
                  alt="About Zhanna"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-[10rem] italic text-teal/10">Z</span>
                </div>
              )}
            </div>
            {/* Decorative corner accents */}
            <div className="pointer-events-none absolute -left-3 -top-3 h-20 w-20 rounded-tl-xl border-l-2 border-t-2 border-teal/30" />
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 rounded-br-xl border-b-2 border-r-2 border-teal/30" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-teal">
              {about.eyebrow}
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-semibold leading-tight tracking-tight text-charcoal-brand sm:text-4xl lg:text-5xl">
              {about.title}
            </h2>
            <div className="mt-6 h-px w-16 bg-gradient-to-r from-teal to-transparent" />

            <div className="mt-8 space-y-5">
              {about.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[15px] leading-relaxed text-slate-brand"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Points */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {about.points.map((point, index) => (
                <li
                  key={index}
                  className="rounded-full border border-silver/70 bg-ice px-4 py-2 text-xs font-medium text-charcoal-brand"
                >
                  {point}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={about.ctaHref}
              className="group mt-10 inline-flex items-center gap-2.5 border border-teal px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal transition-all duration-500 hover:-translate-y-0.5 hover:bg-teal hover:text-snow hover:shadow-[0_16px_40px_-12px_rgba(14,143,176,0.4)]"
            >
              {about.ctaLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
