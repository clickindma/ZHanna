"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import type { ProductListItem } from "@/types/product";

export function BestSellersGrid({ products }: { products: ProductListItem[] }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{
            duration: 0.65,
            delay: (i % 4) * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full"
        >
          <ProductCard product={product} priority={i < 4} className="h-full" />
        </motion.div>
      ))}
    </div>
  );
}
