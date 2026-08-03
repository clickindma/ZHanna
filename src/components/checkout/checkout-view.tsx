"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useMounted } from "@/hooks/use-mounted";
import { useCartStore } from "@/store/cart-store";

export function CheckoutView() {
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-sm text-muted-foreground sm:py-32">
        Loading your bag…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-champagne">
          <ShoppingBag className="h-10 w-10 text-gold-dark" strokeWidth={1.4} />
        </div>
        <div>
          <h1 className="font-playfair text-3xl text-navy">
            Your bag is <span className="text-gradient-gold italic">empty</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Add a piece you love before checking out. Every Zhanna creation is
            crafted to celebrate life&apos;s most radiant moments.
          </p>
        </div>
        <Button
          render={<Link href="/shop" />}
          className="h-12 rounded-lg bg-navy px-8 font-medium tracking-[0.2em] text-white uppercase transition-colors hover:bg-navy-mid"
        >
          Explore the Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      <CheckoutForm />
      <div className="lg:sticky lg:top-24">
        <OrderSummary />
      </div>
    </div>
  );
}
