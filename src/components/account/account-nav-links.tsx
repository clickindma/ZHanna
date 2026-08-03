"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const LINKS: {
  label: string;
  href: string;
  icon: typeof Package;
  match?: (path: string) => boolean;
}[] = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Profile", href: "/account/profile", icon: UserRound },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Browse Shop", href: "/shop", icon: ShoppingBag },
];

export function AccountNavLinks({ showAdmin }: { showAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 space-y-1" aria-label="Account">
      {LINKS.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gold/15 text-gold-dark"
                : "text-emerald-deep hover:bg-parchment hover:text-gold-dark"
            }`}
          >
            <link.icon className="h-4 w-4" strokeWidth={1.7} />
            {link.label}
            <ChevronRight
              className={`ml-auto h-3.5 w-3.5 transition-transform ${
                active
                  ? "text-gold-dark"
                  : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-gold-dark"
              }`}
            />
          </Link>
        );
      })}

      {showAdmin && (
        <Link
          href="/admin"
          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/admin")
              ? "bg-gold/15 text-gold-dark"
              : "text-emerald-deep hover:bg-parchment hover:text-gold-dark"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={1.7} />
          Admin Panel
          <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-dark" />
        </Link>
      )}
    </nav>
  );
}
