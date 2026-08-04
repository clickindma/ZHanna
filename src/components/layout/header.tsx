"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Package,
  Phone,
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
import { NAV_LINKS, CATEGORY_LINKS, BRAND } from "@/lib/constants";
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

const CURRENCIES = [
  { label: "₹ INR", hint: "Indian Rupee" },
  { label: "$ USD", hint: "US Dollar" },
  { label: "€ EUR", hint: "Euro" },
];

const LANGUAGES = [
  { label: "EN", hint: "English" },
  { label: "हिंदी", hint: "Hindi" },
];

/** Compact search bar with a category dropdown (main header, desktop). */
function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (category) params.set("category", category);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="group flex w-full items-center overflow-hidden rounded-full border border-champagne-deep bg-white shadow-sm transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20"
      role="search"
    >
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        aria-label="Search within category"
        className="hidden h-12 shrink-0 cursor-pointer appearance-none border-r border-champagne-deep bg-transparent pl-4 pr-8 text-[12px] font-medium text-emerald-deep outline-none transition-colors hover:text-gold-dark sm:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
        }}
      >
        <option value="">All Categories</option>
        {CATEGORY_LINKS.filter((link) => link.href.includes("category=")).map((child) => (
          <option
            key={child.href}
            value={child.href.split("category=")[1] ?? ""}
          >
            {child.label}
          </option>
        ))}
      </select>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search rings, necklaces, oxidised silver…"
        aria-label="Search jewellery"
        type="search"
        className="h-12 w-full min-w-0 flex-1 bg-transparent pl-4 pr-2 text-[15px] text-emerald-deep outline-none placeholder:text-muted-foreground/60"
      />

      <button
        type="submit"
        aria-label="Search"
        className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-emerald-deep transition-all duration-300 hover:bg-parchment hover:text-gold-dark"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </button>
    </form>
  );
}

/** Thin top bar: contact info left, currency/language/account dropdowns right. */
function UtilityBar() {
  const { data: session, status } = useSession();
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="bg-emerald-deep text-[11px] text-silver/90">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: contact info */}
        <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
          <a
            href={`tel:${BRAND.phone}`}
            className="hidden items-center gap-1.5 whitespace-nowrap text-champagne/85 transition-colors hover:text-gold-light sm:inline-flex"
          >
            <Phone className="h-3 w-3 text-gold" strokeWidth={1.8} />
            {BRAND.phone}
          </a>
          <span className="hidden h-3 w-px bg-white/12 sm:block" />
          <a
            href={`mailto:${BRAND.email}`}
            className="hidden items-center gap-1.5 whitespace-nowrap text-champagne/85 transition-colors hover:text-gold-light md:inline-flex"
          >
            <Mail className="h-3 w-3 text-gold" strokeWidth={1.8} />
            {BRAND.email}
          </a>
          <span className="hidden h-3 w-px bg-white/12 md:block" />
          <p className="flex items-center gap-1.5 truncate text-champagne/75">
            <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
            <span className="truncate">Free shipping on orders above ₹999</span>
          </p>
        </div>

        {/* Right: dropdowns */}
        <div className="flex shrink-0 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="group flex cursor-pointer items-center gap-1.5 px-3 py-1 text-[11px] font-medium tracking-wide text-champagne/85 transition-colors hover:text-gold-light"
                  aria-label="Select currency"
                >
                  <CircleDollarSign className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {currency.label}
                  <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-open:rotate-180" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-40 rounded-xl border-champagne-deep p-1.5">
              {CURRENCIES.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => setCurrency(option)}
                  className="cursor-pointer"
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{option.hint}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="h-3.5 w-px bg-white/12" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="group flex cursor-pointer items-center gap-1.5 px-3 py-1 text-[11px] font-medium tracking-wide text-champagne/85 transition-colors hover:text-gold-light"
                  aria-label="Select language"
                >
                  {language.label}
                  <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-open:rotate-180" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="min-w-36 rounded-xl border-champagne-deep p-1.5">
              {LANGUAGES.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => setLanguage(option)}
                  className="cursor-pointer"
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{option.hint}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="h-3.5 w-px bg-white/12" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="group flex cursor-pointer items-center gap-1.5 px-3 py-1 text-[11px] font-medium tracking-wide text-champagne/85 transition-colors hover:text-gold-light"
                  aria-label="Account"
                >
                  <UserRound className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span className="hidden sm:inline">
                    {isAuthenticated ? (session?.user?.name?.split(" ")[0] ?? "Account") : "Account"}
                  </span>
                  <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-open:rotate-180" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-champagne-deep p-1.5">
              {isAuthenticated ? (
                <>
                  <div className="px-3 pt-2 pb-2.5">
                    <p className="truncate font-playfair text-[15px] text-emerald-deep">
                      {session?.user?.name ?? "Account"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{session?.user?.email}</p>
                    {isAdmin && (
                      <span className="mt-2 inline-block rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-gold-dark uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-champagne-deep" />
                  <DropdownMenuItem render={<Link href="/account/orders" />} className="cursor-pointer">
                    <Package className="h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/account/wishlist" />} className="cursor-pointer">
                    <Heart className="h-4 w-4" />
                    My Wishlist
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem render={<Link href="/admin" />} className="cursor-pointer">
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
                  <DropdownMenuItem render={<Link href="/login" />} className="cursor-pointer">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/register" />} className="cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    Create account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export function Header({ navLinks }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const mounted = useMounted();
  const openCart = useCartStore((s) => s.open);
  const cartCount = useCartStore(selectCartCount);
  const { status } = useSession();

  const links: NavLinkItem[] =
    navLinks && navLinks.length > 0 ? navLinks : (NAV_LINKS as unknown as NavLinkItem[]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setCompact(y > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const collapse = (active: boolean) =>
    active ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100";

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-500 ${
        scrolled ? "shadow-[0_2px_28px_rgba(20,41,35,0.1)]" : "shadow-none"
      }`}
    >
      {/* Tier 1 — Utility bar (collapses on scroll) */}
      <div
        className={`grid transition-all duration-500 ease-out ${collapse(scrolled)}`}
        aria-hidden={scrolled}
      >
        <div className="min-h-0 overflow-hidden">
          <UtilityBar />
        </div>
      </div>

      {/* Tier 2 — Main header: logo | search | icons (collapses when compact) */}
      <div
        className={`grid border-b border-champagne-deep bg-ivory/95 backdrop-blur-xl transition-all duration-500 ease-out ${collapse(compact)}`}
        aria-hidden={compact}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            {/* Left: mobile menu + logo */}
            <div className="flex min-w-0 items-center gap-1.5">
              <MobileMenu />
              <Link href="/" aria-label="Zhanna — Home" className="transition-opacity hover:opacity-80">
                <BrandLogo className="h-11 w-auto sm:h-14 lg:h-16" priority />
              </Link>
            </div>

            {/* Center: search bar */}
            <div className="mx-auto hidden w-full max-w-2xl flex-1 px-2 lg:block">
              <HeaderSearch />
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <Button
                render={<Link href="/search" />}
                variant="ghost"
                size="icon"
                className="inline-flex text-emerald-deep hover:bg-parchment lg:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.6} />
              </Button>

              <Button
                render={<Link href="/account/wishlist" />}
                variant="ghost"
                size="icon"
                className="hidden text-emerald-deep hover:bg-parchment sm:inline-flex"
                aria-label="My wishlist"
              >
                <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
              </Button>

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
        </div>
      </div>

      {/* Tier 3 — Navigation strip (always visible, sticky) */}
      <div
        className={`border-t border-emerald/40 bg-emerald-deep transition-all duration-500 ${
          scrolled ? "shadow-[0_14px_34px_-16px_rgba(11,21,34,0.45)]" : ""
        }`}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Desktop nav links */}
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            <ul className="flex items-center gap-8 xl:gap-11">
              {links.map((link) => {
                const isCollection = link.children && link.children.length > 0;

                if (isCollection) {
                  return (
                    <li key={link.href}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <span className="group inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-champagne/90 transition-colors hover:text-gold-light">
                              {link.label}
                              <ChevronDown className="h-3 w-3 transition-transform duration-300 group-data-open:rotate-180" />
                            </span>
                          }
                          aria-label="Open Collections"
                        />
                        <DropdownMenuContent
                          align="center"
                          sideOffset={16}
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
                      className="group relative inline-block py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-champagne/90 transition-colors hover:text-gold-light"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold-light to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile nav links (horizontal scroll) */}
          <nav className="flex w-full items-center overflow-x-auto scrollbar-none lg:hidden" aria-label="Primary mobile">
            <ul className="flex items-center gap-6 whitespace-nowrap">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group relative inline-block py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-champagne/90 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 bg-gold-light/70 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: wishlist + cart repeated */}
          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            <span className="mr-1 h-4 w-px bg-white/12" />
            {status === "authenticated" && (
              <Button
                render={<Link href="/account/wishlist" />}
                variant="ghost"
                size="icon"
                className="inline-flex text-champagne/90 hover:bg-white/10 hover:text-gold-light"
                aria-label="My wishlist"
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative inline-flex text-champagne/90 hover:bg-white/10 hover:text-gold-light"
              aria-label="Open shopping bag"
              onClick={openCart}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {mounted && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-navy-deep">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <CartSheet />
    </header>
  );
}
