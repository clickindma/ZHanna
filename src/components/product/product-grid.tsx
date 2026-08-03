"use client";

import { motion } from "framer-motion";
import type { ProductListItem } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductListItem[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-parchment/60 px-6 py-24 text-center"
      >
        <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="font-playfair text-2xl text-navy">
          Nothing matches your selection
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Try adjusting the filters, or explore the full collection to discover
          something beautiful.
        </p>
        <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={index < 4}
          index={index}
        />
      ))}
    </motion.div>
  );
}
