"use client";

import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Tilt3D } from "@/components/shared/tilt-3d";
import type { ProductListItem } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { cn, discountPercent, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ProductListItem;
  priority?: boolean;
  className?: string;
  index?: number;
}

export function ProductCard({
  product,
  priority,
  className,
  index = 0,
}: ProductCardProps) {
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      >
        {/* Image Container */}
        <Tilt3D maxTilt={5} scale={1.01} className="rounded-2xl">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-champagne-deep bg-parchment shadow-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_-12px_rgba(14,143,176,0.3)] group-hover:border-turquoise/50">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            name={product.name}
            priority={priority}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
            {product.isNewArrival && (
              <Badge className="bg-emerald/90 px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-ivory uppercase backdrop-blur-sm shadow-sm">
                New
              </Badge>
            )}
            {discount != null && (
              <Badge className="bg-gold px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-emerald-deep uppercase shadow-sm">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Wishlist functionality handled at page level
            }}
            aria-label="Add to wishlist"
            className="absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 hover:text-gold-dark sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Heart className="h-4 w-4 text-emerald-deep" strokeWidth={1.8} />
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-emerald-deep/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:flex">
            <span className="mb-5 inline-flex translate-y-2 items-center gap-1.5 rounded-full border border-gold/40 bg-white/95 px-5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-emerald-deep uppercase backdrop-blur-md shadow-md transition-transform duration-500 group-hover:translate-y-0">
              View piece
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
        </Tilt3D>

        {/* Product Info */}
        <div className="flex flex-1 flex-col pt-3.5 px-0.5">
          <p className="text-[9px] font-semibold tracking-[0.22em] text-gold-dark uppercase sm:text-[10px] sm:tracking-[0.24em]">
            {product.category?.name ?? "Zhanna"}
          </p>
          <h3 className="mt-1.5 font-playfair text-[15px] leading-snug text-emerald-deep line-clamp-2 transition-colors duration-300 group-hover:text-gold-dark sm:text-[17px]">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-[14px] font-semibold text-emerald-deep sm:text-[15px]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice != null && (
              <span className="text-[12px] text-ink-soft line-through decoration-ink-soft/50 sm:text-[13px]">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.materials.length > 0 && (
            <p className="mt-2 hidden text-[11px] text-muted-foreground line-clamp-1 sm:block">
              {product.materials.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
