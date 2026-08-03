"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProductListItem } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: ProductListItem }) {
  const images = product.images.length > 0 ? product.images : [null];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-4"
    >
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-champagne-deep bg-parchment shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <div
              className={cn(
                "h-full w-full cursor-zoom-in transition-transform duration-500",
                isZoomed && "scale-150 cursor-zoom-out"
              )}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ProductImage
                src={images[activeIndex] ?? null}
                alt={product.name}
                name={product.name}
                priority
                imgClassName="object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm opacity-70 transition-opacity hover:opacity-100">
          <ZoomIn className="h-4 w-4 text-emerald-deep" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => canGoPrev && setActiveIndex(activeIndex - 1)}
              disabled={!canGoPrev}
              aria-label="Previous image"
              className={cn(
                "absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white",
                !canGoPrev && "opacity-30 pointer-events-none"
              )}
            >
              <ChevronLeft className="h-5 w-5 text-emerald-deep" />
            </button>
            <button
              type="button"
              onClick={() => canGoNext && setActiveIndex(activeIndex + 1)}
              disabled={!canGoNext}
              aria-label="Next image"
              className={cn(
                "absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white",
                !canGoNext && "opacity-30 pointer-events-none"
              )}
            >
              <ChevronRight className="h-5 w-5 text-emerald-deep" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-emerald-deep shadow-sm backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${product._id}-thumb-${index}`}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setIsZoomed(false);
              }}
              aria-label={`View image ${index + 1} of ${images.length}`}
              className={cn(
                "relative aspect-square w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 sm:w-22",
                activeIndex === index
                  ? "border-gold shadow-md ring-2 ring-gold/20"
                  : "border-champagne-deep opacity-60 hover:opacity-100 hover:border-gold/40"
              )}
            >
              <ProductImage
                src={image ?? null}
                alt={`${product.name} ${index + 1}`}
                name={index === 0 ? product.name : undefined}
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
