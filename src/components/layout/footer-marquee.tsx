"use client";

const MARQUEE_ITEMS = [
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Pendants",
  "Artificial Diamond Jewellery",
  "Zhanna Luxury Jewellery",
  "Timeless Sparkle",
  "Everyday Luxury",
  "Handcrafted Elegance",
  "Fashion Jewellery",
  "925 Sterling Silver",
];

export function FooterMarquee() {
  // Triple the items for seamless infinite scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="group relative overflow-hidden border-t border-silver/30 bg-navy-brand py-5">
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy-brand to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-navy-brand to-transparent" />

      <div
        className="flex animate-marquee items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{ width: "fit-content" }}
      >
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="font-playfair text-[14px] font-medium tracking-wide text-silver/60 sm:text-[15px]">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-turquoise/50" />
          </span>
        ))}
      </div>
    </section>
  );
}
