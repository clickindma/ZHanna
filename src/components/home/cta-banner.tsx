"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  image?: string;
}

export function CtaBanner({
  title = "Find Your Perfect Sparkle",
  subtitle = "Every piece tells a story. Discover jewellery that speaks to your style and stays with you through every moment.",
  buttonLabel = "Shop Now",
  buttonHref = "/shop",
  image,
}: CtaBannerProps) {
  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-brand via-[#0d2838] to-teal px-6 py-20 text-center sm:px-12 lg:py-28">
            {/* Background image if provided */}
            {image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-navy-brand/80 via-navy-brand/60 to-teal/70" />
              </>
            )}

            {/* Decorative elements */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-[30rem] -translate-x-1/2 rounded-full bg-turquoise/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-10 right-10 h-32 w-32 rounded-full border border-aqua/10" />
            <div className="pointer-events-none absolute left-8 top-8 h-20 w-20 rounded-full border border-aqua/10" />

            {/* Content */}
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-playfair text-3xl font-semibold leading-tight text-snow sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-silver/70">
                {subtitle}
              </p>
              <Link
                href={buttonHref}
                className="group mt-10 inline-flex items-center gap-2.5 bg-turquoise px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-navy-brand transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_20px_50px_-12px_rgba(22,181,216,0.5)]"
              >
                {buttonLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
