"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CartSheet } from "@/components/layout/cart-sheet";
import { NAV_LINKS } from "@/lib/constants";
import { useMounted } from "@/hooks/use-mounted";
import { selectCartCount, useCartStore } from "@/store/cart-store";

export interface NavLinkItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface HeaderProps {
  navLinks?: NavLinkItem[];
}

export function Header({ navLinks }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const mounted = useMounted();
  const openCart = useCartStore((s) => s.open);
  const cartCount = useCartStore(selectCartCount);
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "admin";
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  // Use dynamic navLinks from site settings, falling back to constants
  const links: NavLinkItem[] = navLinks && navLinks.length > 0
    ? navLinks
    : (NAV_LINKS as unknown as NavLinkItem[]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled
          ? "border-champagne-deep bg-cream/95 shadow-[0_2px_28px_rgba(20,41,35,0.08)] backdrop-blur-xl"
          : "border-transparent bg-ivory/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/" aria-label="Zhanna — Home" className="transition-opacity hover:opacity-80">
            <BrandLogo className="h-16 w-auto sm:h-20" priority />
          </Link>
        </div>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-9">
            {links.map((link) => {
              const isCollection = link.children && link.children.length > 0;

              if (isCollection) {
                return (
                  <li key={link.href}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <span
                            className="group inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-deep transition-colors hover:text-gold-dark"
                            aria-label="Open Collections"
                          >
                            {link.label}
                            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-data-open:rotate-180" />
                          </span>
                        }
                      />
                      <DropdownMenuContent
                        align="center"
                        sideOffset={18}
                        className="grid w-[540px] grid-cols-[1fr_190px] gap-0 rounded-2xl border-champagne-deep p-0 shadow-[0_28px_70px_-24px_rgba(20,41,35,0.35)]"
                      >
                        <div className="grid grid-cols-2 gap-1 p-3">
                          {link.children!.map((child) => (
                            <DropdownMenuItem
                              key={child.href}
                              render={<Link href={child.href} />}
                              className="cursor-pointer rounded-lg py-2.5 font-playfair text-[15px] text-emerald-deep hover:bg-parchment hover:text-gold-dark"
                            >
                              {child.label}
                              <ChevronRight className="ml-auto h-4 w-4 text-gold" />
                            </DropdownMenuItem>
                          ))}
                        </div>
                        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald via-emerald-deep to-charcoal p-5 text-ivory">
                          <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]" />
                          <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-gold-soft">
                            New Season
                          </p>
                          <p className="mt-2 font-display text-2xl italic leading-tight">
                            The Solitaire Story
                          </p>
                          <Link
                            href="/shop?sort=newest"
                            className="mt-4 inline-flex w-fit items-center gap-1.5 border-b border-gold/50 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft transition-colors hover:border-gold"
                          >
                            Discover
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative text-[12px] font-medium uppercase tracking-[0.18em] text-emerald-deep transition-colors hover:text-gold-dark"
                  >
                    {link.label}
                    <span className="absolute -bottom-1.5 left-0 h-[1.5px] w-full origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold-dark to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            render={<Link href="/search" />}
            variant="ghost"
            size="icon"
            className="hidden text-emerald-deep hover:bg-parchment sm:inline-flex"
            aria-label="Search"
          >
            <Search className="h-[19px] w-[19px]" strokeWidth={1.6} />
          </Button>

          {status === "loading" ? (
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-emerald-deep hover:bg-parchment sm:inline-flex"
              aria-label="Account"
            >
              <UserRound
                className="h-[19px] w-[19px] animate-pulse"
                strokeWidth={1.6}
              />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-emerald-deep hover:bg-parchment sm:inline-flex"
                    aria-label="Account"
                  />
                }
              >
                <UserRound className="h-[19px] w-[19px]" strokeWidth={1.6} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl border-champagne-deep p-1.5">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 pt-2 pb-2.5">
                      <p className="truncate font-playfair text-[15px] text-emerald-deep">
                        {session?.user?.name ?? "Account"}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {session?.user?.email}
                      </p>
                      {isAdmin && (
                        <span className="mt-2 inline-block rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-gold-dark uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-champagne-deep" />
                    <DropdownMenuItem
                      render={<Link href="/account/orders" />}
                      className="cursor-pointer"
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/account/wishlist" />}
                      className="cursor-pointer"
                    >
                      <Heart className="h-4 w-4" />
                      My Wishlist
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem
                        render={<Link href="/admin" />}
                        className="cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-champagne-deep" />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      render={<Link href="/login" />}
                      className="cursor-pointer"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/register" />}
                      className="cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAuthenticated && (
            <Button
              render={<Link href="/account/wishlist" />}
              variant="ghost"
              size="icon"
              className="hidden text-emerald-deep hover:bg-parchment sm:inline-flex"
              aria-label="My wishlist"
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-emerald-deep hover:bg-parchment"
            aria-label="Open shopping bag"
            onClick={openCart}
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-navy-deep">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <CartSheet />
    </header>
  );
}
