"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

const IMAGES = [
  { src: "/brand/hero-banner-1.png", className: "col-span-2 lg:col-span-2 lg:row-span-2" },
  { src: "/brand/collection-solitaire.jpg", className: "lg:col-span-2" },
  { src: "/brand/collection-gold-hour.jpg", className: "" },
  { src: "/brand/category-bridal.jpg", className: "" },
  { src: "/brand/hero-banner-2.png", className: "col-span-2 lg:col-span-2 lg:row-span-2" },
  { src: "/brand/featured-banner-1.jpg", className: "lg:col-span-2" },
  { src: "/brand/featured-banner-2.jpg", className: "lg:col-span-2" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function GalleryMosaic() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-dark">
            Moments in gold
          </p>
          <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
            Gallery
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:auto-rows-[200px]">
          {IMAGES.map((image, i) => (
            <motion.button
              key={image.src}
              type="button"
              onClick={() => setSelected(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE }}
              aria-label={`Open gallery image ${i + 1}`}
              className={`group relative overflow-hidden rounded-xl ${image.className}`}
            >
              <Image
                src={image.src}
                alt={`Zhanna jewellery look ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy-brand/0 transition-colors duration-500 group-hover:bg-navy-brand/25" />
              <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100">
                <Plus className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              aria-label="Close gallery preview"
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white hover:text-navy-deep"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
              className="relative aspect-[3/4] max-h-full w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={IMAGES[selected].src}
                alt={`Zhanna jewellery look ${selected + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
