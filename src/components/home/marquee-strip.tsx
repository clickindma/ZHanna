import { Award, RefreshCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, label: "Certified Quality" },
  { icon: RefreshCcw, label: "Lifetime Exchange" },
  { icon: Truck, label: "Free Shipping" },
  { icon: Sparkles, label: "Handcrafted" },
  { icon: Award, label: "Trademark Registered" },
];

export function MarqueeStrip() {
  return (
    <section className="border-b border-silver/50 bg-ice py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6 lg:px-8">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5"
          >
            <Icon className="h-4 w-4 text-teal" strokeWidth={1.6} />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal-brand">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
