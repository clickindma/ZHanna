"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RotatingText } from "@/components/shared/rotating-text";
import type { HomeHeroContent } from "@/types/homepage";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

const HERO_WORDS = ["Timeless", "Everyday", "Luxury", "Sparkle", "Elegance"];

interface HeroProps {
  content: HomeHeroContent;
  heroImages?: string[];
}

export function Hero({ content, heroImages = [] }: HeroProps) {
  const images = heroImages.length > 0 ? heroImages : ["/brand/hero-banner-1.png", "/brand/hero-banner-2.png"];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!content.enabled) return null;

  return (
    <section className="relative min-h-[70vh] overflow-hidden sm:min-h-[80vh] lg:min-h-[92vh]">
      {/* Banner Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentSlide]}
            alt="Zhanna Jewellery Collection"
            fill
            priority={currentSlide === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-brand/80 via-navy-brand/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-brand/70 via-transparent to-navy-brand/30" />

      {/* Decorative soft glow */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-turquoise/8 blur-[160px]" />

      {/* Content */}
      <div className="relative flex min-h-[72vh] items-center px-5 py-20 sm:min-h-[80vh] sm:px-6 sm:py-24 lg:min-h-[92vh] lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-7xl"
        >
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-medium uppercase tracking-[0.32em] text-aqua/90 sm:text-[11px] sm:tracking-[0.35em]"
            >
              {content.eyebrow || "Exclusive Collection"}
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mt-5 font-playfair text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-snow sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              The{" "}
              <RotatingText
                words={HERO_WORDS}
                interval={3000}
                className="font-display italic text-aqua"
              />{" "}
              gift,{" "}
              <span className="block font-display italic text-aqua">
                that stays forever
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-[15px] leading-relaxed text-silver/85 sm:mt-6 sm:text-lg"
            >
              {content.subheadline || "Discover handcrafted artificial diamond & fashion jewellery that speaks of elegance, designed for every occasion."}
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href={content.ctaPrimaryHref || "/shop"}
                className="group inline-flex w-full items-center justify-center gap-2.5 bg-turquoise px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-navy-brand transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_20px_50px_-12px_rgba(22,181,216,0.5)] active:scale-[0.98] sm:w-auto"
              >
                {content.ctaPrimaryLabel || "Shop Now"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {content.ctaSecondaryLabel && (
                <Link
                  href={content.ctaSecondaryHref || "/shop?sort=newest"}
                  className="inline-flex w-full items-center justify-center gap-2 border border-silver/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.15em] text-snow/90 backdrop-blur-sm transition-all duration-300 hover:border-aqua/50 hover:text-aqua active:scale-[0.98] sm:w-auto"
                >
                  {content.ctaSecondaryLabel}
                </Link>
              )}
            </motion.div>
          </div>

          {/* Slide dots indicator */}
          {images.length > 1 && (
            <motion.div
              variants={fadeUp}
              className="mt-10 flex items-center gap-3 sm:mt-16"
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-500 ${
                    currentSlide === index
                      ? "h-3 w-3 rounded-full bg-turquoise shadow-[0_0_12px_rgba(22,181,216,0.6)]"
                      : "h-2.5 w-2.5 rounded-full bg-silver/40 hover:bg-silver/60"
                  }`}
                />
              ))}
              <span className="ml-3 text-[10px] font-medium tracking-wider text-silver/50 uppercase">
                {String(currentSlide + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Clean bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-silver/20 to-transparent" />
    </section>
  );
}
