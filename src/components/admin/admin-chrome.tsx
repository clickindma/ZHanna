"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  Settings,
  Shapes,
  Store,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/admin";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Storefront", href: "/admin/storefront", icon: Store },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: Shapes },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
  { label: "SEO", href: "/admin/seo", icon: Globe },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-white/10 text-gold-light"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon
              className={cn("h-4.5 w-4.5 shrink-0", active ? "text-gold" : "text-white/40 group-hover:text-gold/70")}
              strokeWidth={1.7}
            />
            {item.label}
            {active && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-navy-deep">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <BrandLogo className="h-9 w-auto" priority />
        <div>
          <p className="font-playfair text-[17px] leading-tight text-white">
            Zhanna <span className="text-gold-light">Admin</span>
          </p>
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Suite</p>
        </div>
      </div>
      <NavLinks pathname={pathname} onNavigate={onNavigate} />
      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Back to storefront
        </Link>
      </div>
    </div>
  );
}

export function AdminChrome({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function handleSignOut() {
    setSigningOut(true);
    void signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="min-h-svh bg-champagne">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar pathname={pathname} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-svh flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-champagne-deep bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-champagne-deep text-slate-600 transition-colors hover:bg-champagne lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="hidden font-playfair text-base text-slate-400 sm:inline">
              Management Console
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg border border-champagne-deep px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-champagne hover:text-gold-dark sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Store
            </Link>
            <div className="h-6 w-px bg-champagne-deep" />
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-playfair text-sm text-gold-light">
                {user.name?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
              <div className="hidden leading-tight md:block">
                <p className="text-sm font-medium text-navy">{user.name}</p>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-dark uppercase">
                  Admin
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={signingOut}
              className="border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
