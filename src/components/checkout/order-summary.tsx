"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShoppingBag, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BRAND, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

const SHIPPING_FEE = 79;

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <aside className="rounded-2xl border border-champagne-deep bg-white shadow-[0_1px_0_rgba(11,27,51,0.04)]">
      <div className="flex items-center justify-between border-b border-champagne-deep px-6 py-5">
        <h2 className="font-playfair text-xl text-navy">Order Summary</h2>
        <span className="text-xs tracking-widest text-muted-foreground">
          {items.length} {items.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {items.length > 0 && (
        <div className="max-h-72 overflow-y-auto px-6 py-4">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-champagne-deep bg-champagne">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-playfair text-navy/40">
                      {BRAND.name[0]}
                    </span>
                  )}
                  <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-navy px-1 text-[10px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-navy">{item.name}</span>
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    {item.size ? `Size: ${item.size} · ` : ""}
                    Qty {item.quantity}
                  </span>
                  <span className="mt-1 text-sm font-medium text-navy">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-6 pb-6 pt-2">
        {freeShippingRemaining > 0 ? (
          <div className="mb-5 rounded-lg bg-champagne px-4 py-3">
            <p className="flex items-center gap-2 text-xs text-navy">
              <Truck className="h-4 w-4 shrink-0 text-gold-dark" />
              Add <span className="font-semibold text-gold-dark">{formatPrice(freeShippingRemaining)}</span> more for free shipping
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-champagne-deep">
              <div
                className="h-full bg-gradient-to-r from-gold-dark to-gold"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-champagne px-4 py-3 text-xs text-navy">
            <Truck className="h-4 w-4 text-gold-dark" />
            Your order qualifies for <span className="font-semibold text-gold-dark">free shipping</span>
          </div>
        )}

        <dl className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium text-navy">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium text-navy">
              {shipping === 0 ? (
                <span className="text-emerald-700">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </dd>
          </div>
          <Separator className="my-1 bg-champagne-deep" />
          <div className="flex items-center justify-between">
            <dt className="font-playfair text-base text-navy">Total</dt>
            <dd className="font-playfair text-2xl text-navy">{formatPrice(total)}</dd>
          </div>
          <p className="pt-0.5 text-[11px] text-muted-foreground">
            Inclusive of all taxes. Shipping & COD fees calculated at checkout.
          </p>
        </dl>

        <div className="mt-5 space-y-2 border-t border-champagne-deep pt-5">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-gold-dark" />
            7-day easy returns & exchanges
          </p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShoppingBag className="h-4 w-4 text-gold-dark" />
            COD, UPI, cards & net banking — Razorpay coming soon
          </p>
          {items.length === 0 && (
            <ButtonLink href="/shop" label="Explore the Collection" />
          )}
        </div>
      </div>
    </aside>
  );
}

function ButtonLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg border border-gold bg-gold/10 text-sm font-semibold tracking-[0.18em] text-gold-dark uppercase transition-colors hover:bg-champagne"
    >
      {label}
    </Link>
  );
}
