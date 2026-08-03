import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Zhanna order — review your bag, enter your delivery details and place your order securely.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-gold-dark uppercase">
          Secure Checkout
        </p>
        <h1 className="mt-3 font-playfair text-4xl text-navy sm:text-5xl">
          Almost <span className="text-gradient-gold italic">yours</span>
        </h1>
        <div className="mx-auto mt-5 flex w-16 items-center gap-1">
          <span className="h-px flex-1 bg-gold" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Confirm your pieces, share your delivery details and place your order.
          Payment is securely handled by Razorpay.
        </p>
      </div>

      <div className="mt-12">
        <CheckoutView />
      </div>
    </div>
  );
}
