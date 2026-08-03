"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Gem,
  Minus,
  Plus,
  Ruler,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  Undo2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

const TRUST_BADGES = [
  { icon: Sparkles, label: "Anti-tarnish finish" },
  { icon: Undo2, label: "7-day easy returns" },
  { icon: Truck, label: "Free shipping over ₹999" },
  { icon: Shield, label: "Secure checkout" },
];

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-champagne-deep last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-gold-dark"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 text-sm font-medium text-emerald-deep">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="pb-4 text-[14px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function ProductInfo({
  product,
  wishlistButton,
}: {
  product: ProductListItem;
  wishlistButton?: React.ReactNode;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const needsSize = product.sizeOptions.length > 1;
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const [size, setSize] = useState<string | null>(
    product.sizeOptions.length === 1 ? product.sizeOptions[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const discount = discountPercent(product.price, product.compareAtPrice);

  function handleAddToCart() {
    if (needsSize && !size) {
      setSizeError("Please select a size to continue.");
      return;
    }
    setSizeError(null);

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      mrp: product.compareAtPrice ?? undefined,
      image: product.images[0],
      size: size ?? undefined,
      quantity,
    });

    toast.success("Added to your bag", {
      description: `${product.name}${size ? ` · ${size}` : ""} × ${quantity}`,
    });
    openCart();
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-7"
    >
      {/* Header */}
      <div>
        {product.category && (
          <Link
            href={`/shop?category=${product.category.slug}`}
            className="text-[10px] font-semibold tracking-[0.3em] text-gold-dark uppercase transition-colors hover:text-emerald-deep"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-2.5 font-playfair text-3xl leading-tight text-emerald-deep sm:text-4xl lg:text-[42px]">
          {product.name}
        </h1>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold text-emerald-deep sm:text-3xl">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice != null && (
            <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          {discount != null && (
            <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-gold-dark">
              Save {discount}%
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-champagne-deep via-champagne-deep to-transparent" />

      {/* Short Description */}
      {product.shortDescription && (
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
      )}

      {/* Materials Badges */}
      {product.materials.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.materials.map((material) => (
            <span
              key={material}
              className="inline-flex items-center gap-1.5 rounded-full border border-champagne-deep bg-parchment/80 px-3.5 py-2 text-xs font-medium text-emerald-deep shadow-sm"
            >
              <Gem className="h-3 w-3 text-gold-dark" />
              {material}
            </span>
          ))}
        </div>
      )}

      {/* Size + Quantity + Add to Cart */}
      <div className="space-y-5">
        {needsSize && (
          <div>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-emerald-deep uppercase">
                <Ruler className="h-3.5 w-3.5 text-gold-dark" />
                Size
              </p>
              <span className="text-xs text-muted-foreground">
                {size ? `Selected: ${size}` : "Select a size"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.sizeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSize(option);
                    setSizeError(null);
                  }}
                  className={cn(
                    "min-w-14 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200",
                    size === option
                      ? "border-gold bg-gold/10 font-medium text-gold-dark shadow-sm ring-2 ring-gold/20"
                      : "border-champagne-deep bg-white text-emerald-deep hover:border-gold/60 hover:shadow-sm"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-2.5 text-xs text-red-600">{sizeError}</p>
            )}
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 items-center rounded-xl border border-champagne-deep bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-full w-11 items-center justify-center text-emerald-deep transition-colors hover:text-gold-dark disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-emerald-deep">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center text-emerald-deep transition-colors hover:text-gold-dark"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="h-12 flex-1 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-sm font-semibold tracking-[0.18em] text-emerald-deep-deep uppercase shadow-md transition-all hover:brightness-110 hover:shadow-lg disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            {inStock ? "Add to bag" : "Out of stock"}
          </Button>

          {wishlistButton}
        </div>

        {/* Stock Status */}
        {inStock ? (
          <p
            className={cn(
              "text-xs tracking-wide",
              lowStock ? "text-amber-700" : "text-emerald-700"
            )}
          >
            {lowStock
              ? `Only ${product.stock} left in stock — order soon`
              : "✓ In stock · Ready to ship"}
          </p>
        ) : (
          <p className="text-xs text-red-600">
            This piece is currently out of stock.
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="rounded-xl border border-champagne-deep bg-parchment/50 p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5 text-[13px] text-muted-foreground"
            >
              <badge.icon className="h-4 w-4 shrink-0 text-gold-dark" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-champagne-deep via-champagne-deep to-transparent" />

      {/* Product Details Accordion */}
      <div className="rounded-xl border border-champagne-deep bg-white shadow-sm">
        <div className="px-5">
          <AccordionItem
            title="Description"
            icon={<Sparkles className="h-4 w-4 text-gold-dark" />}
            defaultOpen
          >
            <p>{product.description}</p>
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-champagne-deep bg-parchment px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </AccordionItem>

          <AccordionItem
            title="Materials & Care"
            icon={<Gem className="h-4 w-4 text-gold-dark" />}
          >
            {product.materials.length > 0 ? (
              <div className="space-y-3">
                <p>
                  Crafted with: {product.materials.join(", ")}
                </p>
                <ul className="list-inside list-disc space-y-1 text-[13px]">
                  <li>Store in a dry, cool place away from direct sunlight</li>
                  <li>Avoid contact with perfumes, lotions, and chemicals</li>
                  <li>Clean gently with a soft, dry cloth</li>
                  <li>Remove before swimming, exercising, or sleeping</li>
                </ul>
              </div>
            ) : (
              <p>Please contact us for material details about this piece.</p>
            )}
            {product.weight && (
              <p className="mt-3 text-[13px]">
                <span className="font-medium text-emerald-deep">Weight:</span>{" "}
                {product.weight}
              </p>
            )}
            <p className="mt-2 text-[13px]">
              <span className="font-medium text-emerald-deep">SKU:</span>{" "}
              {product.sku}
            </p>
          </AccordionItem>

          <AccordionItem
            title="Shipping & Returns"
            icon={<Package className="h-4 w-4 text-gold-dark" />}
          >
            <div className="space-y-3">
              <div>
                <p className="font-medium text-emerald-deep">Shipping</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-[13px]">
                  <li>Free standard shipping on orders over ₹999</li>
                  <li>Standard delivery: 5–7 business days</li>
                  <li>Express delivery: 2–3 business days</li>
                  <li>Beautifully packaged in our signature gift box</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-emerald-deep">Returns</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-[13px]">
                  <li>7-day easy return policy</li>
                  <li>Items must be unused and in original packaging</li>
                  <li>Refunds processed within 5–7 business days</li>
                </ul>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
    </motion.div>
  );
}
