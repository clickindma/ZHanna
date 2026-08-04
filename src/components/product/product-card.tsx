"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Check, Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductListItem } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
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
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const rating = 4 + (index % 2);

  async function toggleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      if (res.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
        return;
      }
      if (!res.ok) return;
      const data = await res.json().catch(() => null);
      setLiked(data?.inWishlist ?? !liked);
    } catch {
      setLiked((prev) => !prev);
    }
  }

  function addToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (adding) return;
    setAdding(true);
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      mrp: product.compareAtPrice ?? undefined,
      image: product.images[0],
      quantity: 1,
    });
    window.setTimeout(() => {
      setAdding(false);
      openCart();
    }, 450);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: (index % 5) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("group relative", className)}
    >
      <div className="flex h-full flex-col rounded-2xl transition-all duration-[350ms] ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_14px_28px_rgba(11,21,34,0.1)]">
        <Link
          href={`/product/${product.slug}`}
          className="flex flex-1 flex-col focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-champagne-deep bg-parchment shadow-sm transition-colors duration-500 group-hover:border-turquoise/50">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              name={product.name}
              priority={priority}
              imgClassName="transition-transform duration-[350ms] ease-out group-hover:scale-110"
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

            {/* Sale ribbon */}
            {discount != null && (
              <span className="absolute top-0 right-0 rounded-bl-xl bg-red-600 px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white uppercase shadow-md">
                Sale
              </span>
            )}

            {/* Wishlist Heart */}
            <motion.button
              type="button"
              onClick={toggleWishlist}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={liked}
              animate={liked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={cn(
                "absolute top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-[1.15] sm:opacity-0 sm:group-hover:opacity-100",
                discount != null ? "right-12" : "right-2.5",
                liked ? "text-gold-dark" : "text-emerald-deep"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors duration-300",
                  liked && "fill-gold text-gold-dark"
                )}
                strokeWidth={1.8}
              />
            </motion.button>

            {/* Circular add-to-cart */}
            <button
              type="button"
              onClick={addToCart}
              aria-label="Add to cart"
              className={cn(
                "absolute right-3 bottom-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-emerald-deep text-gold-light shadow-[0_10px_24px_-8px_rgba(20,41,35,0.55)] transition-all duration-300 ease-out group-hover:scale-110 hover:bg-gold hover:text-navy-deep hover:shadow-[0_14px_28px_-10px_rgba(22,181,216,0.5)] active:scale-95",
                adding && "scale-125 bg-gold text-navy-deep"
              )}
            >
              {adding ? (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Check className="h-4.5 w-4.5" strokeWidth={2.2} />
                </motion.span>
              ) : (
                <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.9} />
              )}
            </button>

            {/* Quick-action overlay */}
            <div className="absolute inset-x-0 bottom-0 hidden translate-y-3 bg-gradient-to-t from-emerald-deep/45 via-emerald-deep/10 to-transparent p-3 pt-10 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:block">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  window.location.href = `/product/${product.slug}`;
                }}
                aria-label="Quick view"
                className="flex h-10 w-full translate-y-3 cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/40 bg-white/95 text-[10px] font-semibold tracking-[0.18em] text-emerald-deep uppercase shadow-md backdrop-blur-md transition-all duration-300 ease-out [transition-delay:0s] group-hover:translate-y-0 hover:bg-gold hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                Quick view
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col pt-3.5 px-0.5">
            <p className="text-[9px] font-semibold tracking-[0.22em] text-gold-dark uppercase sm:text-[10px] sm:tracking-[0.24em]">
              {product.category?.name ?? "Zhanna"}
            </p>
            <h3 className="mt-1.5 truncate font-playfair text-[15px] font-semibold text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark sm:text-[17px]">
              {product.name}
            </h3>

            {/* Star rating */}
            <div className="mt-1.5 flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3.5 w-3.5 transition-colors duration-300",
                    star < rating
                      ? "fill-gold text-gold"
                      : "fill-silver/40 text-silver/40"
                  )}
                  strokeWidth={1.2}
                />
              ))}
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-[14px] font-semibold text-emerald-deep transition-colors duration-300 group-hover:text-gold-dark sm:text-[15px]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice != null && (
                <span className="text-[12px] text-ink-soft line-through decoration-ink-soft/50 sm:text-[13px]">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
