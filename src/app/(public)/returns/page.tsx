import { Undo2, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { BRAND } from "@/lib/constants";

const RETURN_STEPS = [
  {
    Icon: Undo2,
    title: "Request within 7 days",
    description:
      "Write to us at care@zhannajewels.in with your order number and reason within 7 days of delivery.",
  },
  {
    Icon: Truck,
    title: "We arrange pickup",
    description:
      "Our courier partner picks up the item from your doorstep. Returns are free for eligible items.",
  },
  {
    Icon: ShieldCheck,
    title: "Inspection & refund",
    description:
      "Once received, our team inspects the piece and initiates your refund within 3–5 business days.",
  },
];

const CONDITIONS = [
  {
    title: "Returnable",
    items: [
      "Items returned within 7 days of delivery, unworn and in original packaging",
      "Free size (adjustable) pieces that don't fit",
      "Wrong or damaged items delivered — fully covered, no questions",
    ],
  },
  {
    title: "Not returnable",
    items: [
      "Made-to-order or bespoke/customised pieces",
      "Items worn, resized, altered or damaged by the customer",
      "Products without their original packaging or tags",
      "Items beyond the 7-day window",
    ],
  },
];

const EXCHANGES = [
  {
    Icon: RefreshCcw,
    title: "Size exchanges",
    description:
      "Free one-time size exchange within 7 days for rings, bracelets and bangles where our size chart wasn't a match. We'll arrange pickup and reshipment.",
  },
  {
    Icon: Undo2,
    title: "Lifetime care promise",
    description:
      "Every Zhanna piece carries a lifetime servicing promise — cleaning, rhodium refresh and minor repairs at a nominal fee, forever.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <PublicPageHeader
        eyebrow="Returns & Exchanges"
        title={
          <>
            Loved it or not —{" "}
            <span className="text-gradient-gold italic">we&apos;ve got you.</span>
          </>
        }
        description="A 7-day easy return window on all in-stock pieces, free pickup and fast refunds. Because your happiness with a Zhanna piece is the whole point."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Returns" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
              Easy returns
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
              Returns in three{" "}
              <span className="text-gradient-gold italic">simple steps</span>
            </h2>

            <div className="mt-8 space-y-5">
              {RETURN_STEPS.map(({ Icon, title, description }, index) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-champagne-deep bg-champagne/30 p-5">
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

          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-dark">
              Eligibility
            </p>
            <h2 className="mt-4 font-playfair text-3xl font-medium leading-tight text-navy sm:text-4xl">
              What can be returned
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {CONDITIONS.map(({ title, items }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-champagne-deep bg-background p-6"
                >
                  <p className="font-playfair text-lg text-navy">{title}</p>
                  <ul className="mt-4 space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-dark" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {EXCHANGES.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-champagne-deep bg-navy-deep p-8 text-white"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 font-playfair text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/10 p-6 text-sm leading-relaxed text-navy">
          <span className="font-semibold">Refund timing:</span> Refunds are
          processed to your original payment method within 3–5 business days of
          inspection. UPI and card refunds may take up to 7 days depending on your
          bank. Need help? Write to{" "}
          <a href={`mailto:${BRAND.email}`} className="font-medium text-gold-dark underline-offset-4 hover:underline">
            {BRAND.email}
          </a>
          .
        </div>
      </section>
    </>
  );
}
