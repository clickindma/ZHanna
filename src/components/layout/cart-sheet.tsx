"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BRAND, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import {
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

export function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(selectCartSubtotal);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-champagne-deep bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-champagne-deep px-6 py-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-playfair text-xl tracking-wide text-emerald-deep">
              Your Bag
              <span className="ml-2 align-middle text-xs font-normal tracking-widest text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close bag">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-champagne">
              <ShoppingBag className="h-8 w-8 text-gold-dark" strokeWidth={1.4} />
            </div>
            <div>
              <h3 className="font-playfair text-lg text-emerald-deep">Your bag is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover pieces crafted to be treasured.
              </p>
            </div>
            <Button
              render={<Link href="/shop" onClick={close} />}
              variant="outline"
              className="border-gold text-gold-dark hover:bg-parchment"
            >
              Explore the Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {freeShippingRemaining > 0 && (
                <div className="mb-5 rounded-lg bg-parchment px-4 py-3 text-xs text-emerald-deep">
                  <p>
                    You are <span className="font-semibold text-gold-dark">{BRAND.currency}{freeShippingRemaining.toLocaleString("en-IN")}</span> away
                    from free shipping.
                  </p>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-champagne-deep">
                    <div
                      className="h-full bg-gradient-to-r from-gold-dark to-gold"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-champagne-deep bg-champagne">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-playfair text-emerald-deep/40">
                          {BRAND.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-emerald-deep">
                            {item.slug ? (
                              <Link href={`/product/${item.slug}`} onClick={close} className="transition-colors hover:text-gold-dark">
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </h4>
                          {item.size && (
                            <p className="mt-0.5 text-xs text-muted-foreground">Size: {item.size}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-champagne-deep">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-emerald-deep transition-colors hover:text-gold-dark"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-emerald-deep transition-colors hover:text-gold-dark"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-medium text-emerald-deep">
                          {BRAND.currency}{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-champagne-deep px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-playfair text-xl text-emerald-deep">
                  {BRAND.currency}{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <Separator className="my-4 bg-champagne-deep" />
              <Button
                render={<Link href="/checkout" onClick={close} />}
                className="h-12 w-full rounded-none bg-navy font-medium tracking-[0.2em] uppercase transition-colors hover:bg-navy-mid"
              >
                Proceed to Checkout
              </Button>
              <Button
                render={<Link href="/shop" onClick={close} />}
                variant="ghost"
                className="mt-2 w-full text-gold-dark hover:bg-parchment"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
