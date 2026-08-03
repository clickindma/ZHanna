import { BRAND } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div className="bg-emerald-deep text-[11px] text-champagne/90">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="hidden items-center gap-2 sm:flex">
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span>
            Trademark&nbsp;
            <span className="text-gold-light">#{BRAND.trademarkNumber}</span>
            &nbsp;· Registered · {BRAND.trademarkClass}
          </span>
        </p>
        <p className="flex w-full items-center justify-center gap-2 sm:justify-end sm:w-auto">
          <span>Free shipping on orders above ₹999</span>
          <span className="text-gold">·</span>
          <span className="hidden md:inline">Easy 7-day returns</span>
        </p>
      </div>
    </div>
  );
}
