import { Truck, PackageCheck, Clock, MapPin } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { BRAND } from "@/lib/constants";

const SHIPPING_TABLE = [
  { method: "Standard (Metro & major cities)", time: "2–4 business days", cost: "Free above ₹999 · else ₹99" },
  { method: "Standard (Other India)", time: "4–7 business days", cost: "Free above ₹999 · else ₹99" },
  { method: "Express (Metro cities)", time: "1–2 business days", cost: "₹199" },
  { method: "Made-to-order designs", time: "Dispatched in 5–7 business days", cost: "Free above ₹999 · else ₹99" },
];

const STEPS = [
  {
    Icon: PackageCheck,
    title: "Order confirmed",
    description: "You'll receive an email confirmation with your order summary the moment we accept your order.",
  },
  {
    Icon: Clock,
    title: "Quality checked & packed",
    description: "Every piece is inspected and gift-boxed in our signature Zhanna packaging before dispatch.",
  },
  {
    Icon: Truck,
    title: "On its way",
    description: "Once shipped, you'll get a tracking number by SMS and email to follow your order door to door.",
  },
  {
    Icon: MapPin,
    title: "Delivered to your door",
    description: "Signature on delivery is required. You can also track delivery windows with our courier partner.",
  },
];

export default function ShippingPage() {
  return (
    <>
      <PublicPageHeader
        eyebrow="Shipping & Delivery"
        title={
          <>
            From our atelier to your door,{" "}
            <span className="text-gradient-gold italic">beautifully.</span>
          </>
        }
        description="Free shipping on all orders above ₹999. Every Zhanna piece travels insured, well-packed and fully trackable across India."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shipping" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
              Delivery options
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
              Timelines & costs
            </h2>

            <div className="mt-8 overflow-hidden rounded-2xl border border-champagne-deep">
              <div className="grid grid-cols-3 gap-4 bg-navy-deep px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:px-6">
                <span>Method</span>
                <span>Delivery time</span>
                <span className="text-right">Cost</span>
              </div>
              {SHIPPING_TABLE.map((row) => (
                <div
                  key={row.method}
                  className="grid grid-cols-3 gap-4 border-t border-champagne-deep bg-background px-5 py-4 text-sm text-navy sm:px-6"
                >
                  <span className="font-medium">{row.method}</span>
                  <span className="text-muted-foreground">{row.time}</span>
                  <span className="text-right text-muted-foreground">{row.cost}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5 text-sm leading-relaxed text-navy">
              <span className="font-semibold">Free shipping note:</span>{" "}
              Free standard shipping applies automatically at checkout once your
              cart total reaches ₹999. Made-to-order items are included.
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
              The journey
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
              What to expect
            </h2>

            <div className="mt-8 space-y-5">
              {STEPS.map(({ Icon, title, description }, index) => (
                <div key={title} className="relative flex gap-4 rounded-2xl border border-champagne-deep bg-champagne/30 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-playfair text-base text-navy">{title}</p>
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold-dark uppercase">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-champagne-deep bg-navy-deep p-8 text-white sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
            A few small notes
          </p>
          <div className="mt-6 grid gap-6 text-sm leading-relaxed text-white/65 sm:grid-cols-2">
            <p>
              Delivery addresses with P.O. boxes, armed-forces locations or remote
              pin codes may take 1–2 days longer. We&apos;ll keep you informed of any
              change in timeline.
            </p>
            <p>
              All orders are shipped insured against loss or damage in transit. If
              a piece arrives damaged, photograph it and write to{" "}
              <a href={`mailto:${BRAND.email}`} className="text-gold-light underline-offset-4 hover:underline">
                {BRAND.email}
              </a>{" "}
              within 48 hours of delivery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
