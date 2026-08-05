import Link from "next/link";
import { Home, Gem, Crown, MapPin, User, Heart, Scale, ShieldCheck, ListTree } from "lucide-react";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { CATEGORY_LINKS } from "@/lib/constants";

const SITEMAP_GROUPS = [
  {
    title: "Main Pages",
    icon: Home,
    links: [
      { label: "Home", href: "/" },
      { label: "Collections / Shop", href: "/shop" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Our Journal / Blog", href: "/blog" },
    ],
  },
  {
    title: "Shop by Category",
    icon: Gem,
    links: CATEGORY_LINKS.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    title: "Account & Orders",
    icon: User,
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "My Account", href: "/account" },
      { label: "My Orders", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Track an Order", href: "/orders" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Customer Care",
    icon: Crown,
    links: [
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PublicPageHeader
        eyebrow="Sitemap"
        title={
          <>
            Everything,{" "}
            <span className="text-gradient-gold italic">one click away.</span>
          </>
        }
        description="A complete map of the Zhanna website — browse collections, manage your account, or find the answers you need."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SITEMAP_GROUPS.map(({ title, icon: Icon, links }, groupIndex) => (
            <div
              key={title}
              className="rounded-2xl border border-champagne-deep bg-background p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </span>
                <h2 className="font-playfair text-xl font-medium text-navy sm:text-2xl">
                  {title}
                </h2>
              </div>

              <div className="mt-6 h-px w-12 bg-gradient-to-r from-gold-dark to-gold" />

              <ul className="mt-6 space-y-1">
                {links.map((link, linkIndex) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-champagne/30 hover:text-navy"
                    >
                      <span className="font-playfair text-xs text-gold-dark">
                        {String(groupIndex + 1).padStart(2, "0")}.
                        {String(linkIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/10 p-6 text-sm leading-relaxed text-navy sm:p-8">
          <div className="flex items-start gap-3">
            <ListTree className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" strokeWidth={1.6} />
            <div>
              <span className="font-semibold">Need a helping hand?</span>{" "}
              Can&apos;t find what you&apos;re looking for? Visit our{" "}
              <Link href="/contact" className="font-medium text-gold-dark underline-offset-4 hover:underline">
                Contact page
              </Link>{" "}
              or explore our full{" "}
              <Link href="/shop" className="font-medium text-gold-dark underline-offset-4 hover:underline">
                collection
              </Link>
              .
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a
            href="mailto:care@zhannajewels.in"
            className="group flex items-center gap-3 rounded-xl border border-champagne-deep bg-background px-5 py-4 text-sm text-muted-foreground transition-all duration-300 hover:border-gold/40 hover:text-navy"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-gold-dark" strokeWidth={1.6} />
            Secure &amp; trusted shopping
          </a>
          <a
            href="/returns"
            className="group flex items-center gap-3 rounded-xl border border-champagne-deep bg-background px-5 py-4 text-sm text-muted-foreground transition-all duration-300 hover:border-gold/40 hover:text-navy"
          >
            <Scale className="h-4 w-4 shrink-0 text-gold-dark" strokeWidth={1.6} />
            Easy 7-day returns
          </a>
          <a
            href="/shipping"
            className="group flex items-center gap-3 rounded-xl border border-champagne-deep bg-background px-5 py-4 text-sm text-muted-foreground transition-all duration-300 hover:border-gold/40 hover:text-navy"
          >
            <MapPin className="h-4 w-4 shrink-0 text-gold-dark" strokeWidth={1.6} />
            Free shipping above ₹999
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-gold-dark" strokeWidth={1.6} />
          Thank you for exploring Zhanna
        </div>
      </section>
    </>
  );
}
