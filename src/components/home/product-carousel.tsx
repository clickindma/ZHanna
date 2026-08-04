"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProductListItem } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: ProductListItem[];
  viewAllHref?: string;
}

export function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-snow">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Heading row: left + arrows right + divider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-dark">
                Fresh drops
              </p>
              <h2 className="mt-2 font-playfair text-3xl font-semibold tracking-tight text-emerald-deep sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {products.length > 1 && (
              <div className="flex shrink-0 items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  disabled={!canPrev}
                  aria-label="Previous products"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-champagne-deep bg-white text-emerald-deep shadow-sm transition-all duration-300 hover:border-gold/50 hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  disabled={!canNext}
                  aria-label="Next products"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-champagne-deep bg-white text-emerald-deep shadow-sm transition-all duration-300 hover:border-gold/50 hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 via-champagne-deep to-transparent" />
        </motion.div>

        {/* 5-column carousel */}
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="scrollbar-none -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:gap-5"
        >
          {products.map((product, i) => (
            <div
              key={product._id}
              className="w-1/2 shrink-0 snap-start sm:w-[38%] lg:w-1/5"
            >
              <ProductCard product={product} priority={i < 5} index={i} className="h-full" />
            </div>
          ))}
        </div>

        {viewAllHref && (
          <div className="mt-8 flex justify-center">
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-2 border-b border-gold/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-colors duration-300 hover:border-gold"
            >
              View all arrivals
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
