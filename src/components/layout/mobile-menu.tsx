"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Package,
  Phone,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BRAND, CATEGORY_LINKS, COMPANY_LINKS } from "@/lib/constants";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "admin";
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-emerald-deep hover:bg-parchment md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto border-r border-champagne-deep bg-ivory p-0">
        <div className="flex items-center gap-3 border-b border-champagne-deep px-6 py-5">
          <BrandLogo className="h-10 w-auto" />
        </div>

        <nav className="px-6 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Menu
          </p>
          <ul className="space-y-1">
            {[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/shop" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between py-2.5 font-playfair text-xl text-emerald-deep transition-colors hover:text-gold-dark"
                >
                  {link.label}
                  <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Separator className="my-6 bg-parchment-deep" />

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Collections
          </p>
          <ul className="space-y-2">
            {CATEGORY_LINKS.map((category) => (
              <li key={category.href}>
                <Link
                  href={category.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-emerald-deep"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>

          <Separator className="my-6 bg-parchment-deep" />

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Account
          </p>

          {isAuthenticated ? (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-parchment p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-gold-light">
                  <UserRound className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-emerald-deep">
                    {session?.user?.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/account/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-[15px] text-emerald-deep transition-colors hover:text-gold-dark"
                  >
                    <Package className="h-4 w-4 text-gold-dark" />
                    My Orders
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-2.5 text-[15px] text-emerald-deep transition-colors hover:text-gold-dark"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gold-dark" />
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 py-2.5 text-left text-[15px] text-destructive transition-colors hover:text-destructive/80"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="space-y-1">
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-[15px] text-emerald-deep transition-colors hover:text-gold-dark"
                >
                  <LogIn className="h-4 w-4 text-gold-dark" />
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-[15px] text-emerald-deep transition-colors hover:text-gold-dark"
                >
                  <UserPlus className="h-4 w-4 text-gold-dark" />
                  Create account
                </Link>
              </li>
            </ul>
          )}

          <Separator className="my-6 bg-parchment-deep" />

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-dark">
            Client Care
          </p>
          <ul className="space-y-2">
            {COMPANY_LINKS.slice(0, 3).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-emerald-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 rounded-lg bg-parchment p-5 text-sm text-emerald-deep">
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gold-dark" />
              {BRAND.address}
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold-dark" />
              {BRAND.phone}
            </p>
            <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
              {BRAND.company} · TM {BRAND.trademarkNumber}
            </p>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
