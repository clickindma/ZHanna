"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem, Heart, Home, ShoppingBag, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { selectCartCount, useCartStore } from "@/store/cart-store";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Collections", href: "/shop", icon: Gem },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const mounted = useMounted();
  const openCart = useCartStore((s) => s.open);
  const cartCount = useCartStore(selectCartCount);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/account/wishlist") return pathname === "/account/wishlist";
    if (href === "/account") {
      return pathname.startsWith("/account") && pathname !== "/account/wishlist";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-silver/60 bg-snow/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-20px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid w-full max-w-lg grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex flex-col items-center gap-1 pb-2 pt-2.5 transition-colors duration-300",
                active ? "text-turquoise" : "text-slate-brand hover:text-teal"
              )}
            >
              {active && (
                <span className="absolute top-0 h-[2.5px] w-9 rounded-b-full bg-gradient-to-r from-turquoise to-aqua shadow-[0_2px_12px_rgba(22,181,216,0.6)]" />
              )}
              <Icon
                className="h-[22px] w-[22px] transition-transform duration-300 group-active:scale-90"
                strokeWidth={1.6}
              />
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-[0.12em] uppercase transition-colors duration-300",
                  active ? "text-turquoise" : "text-slate-brand/80"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={openCart}
          aria-label="Open shopping bag"
          className="group relative flex flex-col items-center gap-1 pb-2 pt-2.5 text-slate-brand transition-colors duration-300 hover:text-teal"
        >
          <span className="relative">
            <ShoppingBag
              className="h-[22px] w-[22px] transition-transform duration-300 group-active:scale-90"
              strokeWidth={1.6}
            />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-turquoise px-1 text-[9px] font-bold text-white shadow-[0_0_12px_rgba(22,181,216,0.55)]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
          <span className="text-[9px] font-semibold tracking-[0.12em] text-slate-brand/80 uppercase">
            Bag
          </span>
        </button>
      </div>
    </nav>
  );
}
