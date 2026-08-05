"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Gem } from "lucide-react";
import type { ProductListItem } from "@/types/product";
import { WavyBackground } from "@/components/ui/wavy";
import { CylinderCarousel } from "@/components/ui/cylinder-carousel";

const EASE = [0.22, 1, 0.36, 1] as const;

const GEMS = [
  { left: "4%", top: "16%", size: 16, duration: 8, delay: 0 },
  { left: "13%", top: "72%", size: 11, duration: 9, delay: 1.4 },
  { left: "90%", top: "18%", size: 13, duration: 8.5, delay: 0.7 },
  { left: "80%", top: "78%", size: 18, duration: 10, delay: 2.2 },
  { left: "93%", top: "52%", size: 9, duration: 7.5, delay: 1.8 },
  { left: "47%", top: "86%", size: 12, duration: 9.5, delay: 0.4 },
];

const SPARKLES = [
  { left: "8%", top: "40%", size: 14, delay: 0 },
  { left: "24%", top: "12%", size: 10, delay: 1.6 },
  { left: "60%", top: "8%", size: 12, delay: 2.4 },
  { left: "86%", top: "36%", size: 15, delay: 0.9 },
  { left: "70%", top: "90%", size: 9, delay: 1.1 },
];

/** Floating diamond shards + twinkling sparkles layered over the ocean. */
function FloatingJewels() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {GEMS.map((gem, i) => (
        <span
          key={`gem-${i}`}
          className="absolute"
          style={{ left: gem.left, top: gem.top }}
        >
          <span
            className="block animate-float"
            style={{
              width: gem.size,
              height: gem.size,
              animationDuration: `${gem.duration}s`,
              animationDelay: `${gem.delay}s`,
            }}
          >
            <span className="block h-full w-full [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] bg-gradient-to-br from-white/80 via-aqua/50 to-transparent shadow-[0_0_16px_rgba(111,215,238,0.55)]" />
          </span>
        </span>
      ))}
      {SPARKLES.map((sparkle, i) => (
        <span
          key={`sparkle-${i}`}
          className="absolute text-turquoise"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            fontSize: sparkle.size,
          }}
        >
          <span
            className="block animate-sparkle text-[1em]"
            style={{ animationDelay: `${sparkle.delay}s` }}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Build the rotating ring of product images (pads to at least 4). */
function buildCarouselImages(products: ProductListItem[]) {
  const images = products
    .map((product) => ({ src: product.images[0], alt: product.name }))
    .filter((image) => Boolean(image.src));

  if (images.length === 0) return [];

  const target = Math.max(images.length, 4);
  return Array.from({ length: target }, (_, i) => images[i % images.length]);
}

interface NewsletterBandProps {
  products?: ProductListItem[];
}

export function NewsletterBand({ products = [] }: NewsletterBandProps) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const carouselImages = buildCarouselImages(products);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section className="relative overflow-hidden">
      {/* Contained ocean-wave shader background */}
      <WavyBackground className="absolute inset-0" />

      {/* Depth + readability tint */}
      <div className="pointer-events-none absolute inset-0 bg-navy-brand/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55rem_26rem_at_50%_0%,rgba(22,181,216,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise/15 blur-[130px]" />

      <FloatingJewels />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-white/10 px-4 py-1.5 text-[9px] font-semibold tracking-[0.3em] text-aqua uppercase backdrop-blur-sm">
                <Gem className="h-3 w-3" strokeWidth={1.8} />
                Join the circle
              </span>
              <h2 className="mt-4 font-playfair text-3xl font-semibold leading-tight text-snow sm:text-4xl lg:text-[2.6rem]">
                Stay informed with our
                <span className="block font-display italic text-aqua">
                  latest news and updates
                </span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-silver/85">
                New drops, private sales and styling stories — delivered to your
                inbox, never spam.
              </p>
            </div>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-aqua/40 bg-white/10 px-7 py-3.5 text-sm text-snow backdrop-blur-sm"
              >
                <Check className="h-4 w-4 text-aqua" strokeWidth={2} />
                Welcome to the Zhanna family — check your inbox.
              </motion.div>
            ) : (
              <motion.form
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                className="flex w-full max-w-md shrink-0 items-stretch overflow-hidden rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-md focus-within:border-aqua/70 focus-within:shadow-[0_0_0_4px_rgba(22,181,216,0.15)]"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  className="w-full min-w-0 bg-transparent px-5 text-sm text-snow outline-none placeholder:text-silver/50"
                />
                <button
                  type="submit"
                  className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-turquoise px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-navy-brand uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-[0_14px_30px_-10px_rgba(22,181,216,0.6)] active:scale-[0.98] sm:px-8"
                >
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.form>
            )}
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-aqua/40 to-transparent" />
        </motion.div>

        {/* 3D rotating product showcase */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6"
        >
          {carouselImages.length > 0 && (
            <CylinderCarousel
              images={carouselImages}
              cardWidth={220}
              animationDuration={36}
              cardClassName="ring-1 ring-white/10"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
