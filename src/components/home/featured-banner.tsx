"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FeaturedBannerProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  image: string;
  points?: string[];
}

export function FeaturedBanner({
  eyebrow = "The Craft",
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  image,
  points = ["925 Sterling Silver", "AAA Cubic Zirconia", "Lifetime Exchange"],
}: FeaturedBannerProps) {
  return (
    <section className="relative overflow-hidden bg-navy-brand">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-teal/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-turquoise/8 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-aqua">
              {eyebrow}
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-semibold leading-[1.1] text-snow sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-silver/80">
              {subtitle}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {points.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] text-champagne/85 uppercase backdrop-blur-sm"
                >
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href={buttonHref}
              className="group mt-9 inline-flex w-full items-center justify-center gap-2.5 bg-turquoise px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-navy-brand transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_20px_50px_-12px_rgba(22,181,216,0.55)] active:scale-[0.98] sm:w-auto"
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Image block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-[500ms] ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-brand/40 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-gold/25 bg-emerald-deep/95 px-5 py-3.5 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-light">
                <span className="font-playfair text-lg italic">Z</span>
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                  Handcrafted in India
                </p>
                <p className="text-[11px] text-champagne/70">Designed to be loved forever</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
