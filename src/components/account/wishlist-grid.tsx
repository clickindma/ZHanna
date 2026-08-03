"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import type { ProductListItem } from "@/types/product";
import { ProductImage } from "@/components/product/product-image";
import { discountPercent, formatPrice } from "@/lib/utils";

export function WishlistGrid({ products }: { products: ProductListItem[] }) {
  const [items, setItems] = useState(products);
  const [removing, setRemoving] = useState<string | null>(null);

  async function remove(productId: string) {
    setRemoving(productId);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error ?? "Could not remove piece");
        return;
      }
      setItems((current) => current.filter((item) => item._id !== productId));
      toast.success("Removed from your wishlist");
    } catch {
      toast.error("Could not remove piece");
    } finally {
      setRemoving(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-champagne-deep bg-champagne/30 px-6 py-20 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
          <Heart className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="mt-4 font-playfair text-xl text-navy">All cleared</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You removed everything — keep exploring to add more.
        </p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-gold px-7 py-2.5 text-xs font-semibold tracking-[0.2em] text-navy-deep uppercase transition-colors hover:bg-gold-dark hover:text-white"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <div key={product._id} className="group relative">
          <button
            type="button"
            onClick={() => remove(product._id)}
            disabled={removing === product._id}
            aria-label={`Remove ${product.name} from wishlist`}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-champagne-deep bg-white/90 text-gold-dark shadow-sm backdrop-blur-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            {removing === product._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4 fill-gold" />
            )}
          </button>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-champagne-deep bg-parchment">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              name={product.name}
              imgClassName="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col pt-4">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-gold-dark uppercase">
              {product.category?.name ?? "Zhanna"}
            </p>
            <h3 className="mt-1.5 font-playfair text-[17px] leading-snug text-emerald-deep">
              {product.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-[15px] font-semibold text-emerald-deep">
                {formatPrice(product.price)}
              </span>
              {discountPercent(product.price, product.compareAtPrice) != null && (
                <span className="text-[13px] text-ink-soft line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <Link
              href={`/product/${product.slug}`}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-gold/40 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-gold-dark uppercase transition-colors hover:bg-gold hover:text-white"
            >
              View piece
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
