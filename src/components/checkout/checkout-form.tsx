"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Lock, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkoutSchema,
  INDIAN_STATES,
  type CheckoutValues,
} from "@/lib/validations/checkout";
import { cn, formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import {
  selectCartSubtotal,
  useCartStore,
} from "@/store/cart-store";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Field({ label, error, id, className, ...props }: FieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-[0.18em] text-navy uppercase"
      >
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          "mt-2 h-12 rounded-lg border-champagne-deep bg-white px-3.5 text-[15px] text-navy placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25",
          className
        )}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
}

const SHIPPING_FEE = 79;

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const [placed, setPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "" as CheckoutValues["state"],
      pincode: "",
    },
  });

  function onSubmit(values: CheckoutValues) {
    // Razorpay payment flow will be wired in the next step.
    console.log("Checkout order:", { values, items, subtotal, shipping, total });
    setPlaced(true);
    toast.success("Order details received", {
      description:
        "Payment gateway (Razorpay) is coming in the next step. Nothing has been charged.",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      <section className="rounded-2xl border border-champagne-deep bg-white p-6 shadow-[0_1px_0_rgba(11,27,51,0.04)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-playfair text-sm text-gold-light">
            1
          </span>
          <div>
            <h2 className="font-playfair text-xl text-navy">Contact</h2>
            <p className="text-xs text-muted-foreground">
              We will only use these details to fulfil your order.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            id="checkout-fullName"
            autoComplete="name"
            placeholder="Aarav Sharma"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Field
            label="Phone number"
            id="checkout-phone"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            maxLength={13}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Field
            label="Email (optional)"
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-champagne-deep bg-white p-6 shadow-[0_1px_0_rgba(11,27,51,0.04)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-playfair text-sm text-gold-light">
            2
          </span>
          <div>
            <h2 className="font-playfair text-xl text-navy">Delivery Address</h2>
            <p className="text-xs text-muted-foreground">
              We ship across India with tracked, insured delivery.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Address"
              id="checkout-address"
              autoComplete="street-address"
              placeholder="Flat, house no., street, area / landmark"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
          <Field
            label="City"
            id="checkout-city"
            autoComplete="address-level2"
            placeholder="Gurgaon"
            error={errors.city?.message}
            {...register("city")}
          />
          <div>
            <Label
              htmlFor="checkout-state"
              className="text-[11px] font-semibold tracking-[0.18em] text-navy uppercase"
            >
              State
            </Label>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger
                    id="checkout-state"
                    aria-invalid={Boolean(errors.state?.message)}
                    className="mt-2 h-12 w-full rounded-lg border-champagne-deep bg-white px-3.5 text-[15px] text-navy data-placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent align="center" className="max-h-64">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.state?.message} />
          </div>
          <Field
            label="Pincode"
            id="checkout-pincode"
            autoComplete="postal-code"
            inputMode="numeric"
            placeholder="122001"
            maxLength={6}
            error={errors.pincode?.message}
            {...register("pincode")}
          />
          <div className="flex items-end sm:col-span-2">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-gold-dark" />
              This address will be used for shipping & order confirmation.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-champagne-deep bg-white p-6 shadow-[0_1px_0_rgba(11,27,51,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Total payable
            <span className="ml-2 font-playfair text-2xl text-navy">
              {formatPrice(total)}
            </span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold-dark" />
            100% secure · Razorpay
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || items.length === 0 || placed}
          className="mt-5 h-14 w-full rounded-lg bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-sm font-semibold tracking-[0.2em] text-navy-deep uppercase hover:brightness-110 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {placed ? "Details received" : `Place Order · ${formatPrice(total)}`}
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          By placing this order you agree to our{" "}
          <Link href="/terms" className="text-gold-dark underline-offset-2 hover:underline">
            terms
          </Link>{" "}
          &{" "}
          <Link href="/privacy-policy" className="text-gold-dark underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
