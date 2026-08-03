"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { PartnerBrands } from "@/components/layout/partner-brands";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterProps {
  description?: string;
  footerLinks?: FooterLinkGroup[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const SOCIAL_ICON_MAP: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
  youtube: YoutubeIcon,
  pinterest: PinterestIcon,
};

const FOOTER_COLUMNS: FooterLinkGroup[] = [
  {
    heading: "Shop by Categories",
    links: [
      { label: "All Jewellery", href: "/shop" },
      { label: "Rings", href: "/shop?category=rings" },
      { label: "Earrings", href: "/shop?category=earrings" },
      { label: "Necklaces", href: "/shop?category=necklaces" },
      { label: "Bracelets", href: "/shop?category=bracelets" },
      { label: "Pendants", href: "/shop?category=pendants" },
      { label: "Bridal Collection", href: "/shop" },
      { label: "Men's Jewellery", href: "/shop" },
    ],
  },
  {
    heading: "About Us",
    links: [
      { label: "About Zhanna", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/contact" },
      { label: "Our Journal", href: "/blog" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Size Guide", href: "/shipping" },
      { label: "Track Order", href: "/orders" },
      { label: "Care Guide", href: "/blog" },
      { label: "Order Help", href: "/contact" },
    ],
  },
  {
    heading: "Learning Center",
    links: [
      { label: "How to Choose a Diamond", href: "/blog" },
      { label: "Jewellery Care", href: "/blog" },
      { label: "Certification", href: "/about" },
      { label: "Styling Guide", href: "/blog" },
      { label: "Gift Guide", href: "/blog" },
    ],
  },
  {
    heading: "Others",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Sitemap", href: "/shop" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "My Account", href: "/account" },
      { label: "Sign In", href: "/login" },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function FooterColumn({ group }: { group: FooterLinkGroup }) {
  return (
    <div>
      <h3 className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
        {group.heading}
        <span className="absolute -bottom-1.5 left-0 h-px w-8 bg-gradient-to-r from-turquoise to-transparent" />
      </h3>
      <ul className="mt-6 space-y-3">
        {group.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group/link relative inline-block text-[13px] text-white/55 transition-colors duration-300 hover:text-turquoise"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-turquoise/60 transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaymentChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-8 items-center justify-center rounded-md border border-white/12 bg-white/5 px-3 text-[10px] font-semibold tracking-wider text-white/60 uppercase transition-colors duration-300 hover:border-turquoise/40 hover:text-white",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Footer({
  description,
  socialLinks: propSocialLinks,
  copyrightText,
  email: propEmail,
  phone: propPhone,
  address: propAddress,
}: FooterProps) {
  const footerDescription =
    description ||
    `Luxury artificial diamond, oxidized and fashion jewellery, handcrafted to celebrate life's most radiant moments. Every piece carries the promise of timeless brilliance.`;
  const email = propEmail || BRAND.email;
  const phone = propPhone || BRAND.phone;
  const address = propAddress || BRAND.address;
  const copyright =
    copyrightText || `© ${new Date().getFullYear()} ${BRAND.company}. All rights reserved.`;

  const socials =
    propSocialLinks && propSocialLinks.length > 0
      ? propSocialLinks.map((s) => ({ label: s.platform, href: s.url, icon: s.icon }))
      : [
          { label: "Instagram", href: BRAND.instagram, icon: "instagram" },
          { label: "Facebook", href: BRAND.facebook, icon: "facebook" },
          { label: "WhatsApp", href: "", icon: "whatsapp" },
          { label: "YouTube", href: BRAND.youtube, icon: "youtube" },
          { label: "Pinterest", href: "", icon: "pinterest" },
        ];

  return (
    <>
      <PartnerBrands />

      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative overflow-hidden bg-navy-brand text-white"
      >
        {/* Decorative elements */}
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-teal/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-turquoise/6 blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16 lg:px-10">
          {/* Brand intro row */}
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
            <div className="max-w-md">
              <Link href="/" aria-label="Zhanna — Home" className="inline-block">
                <BrandLogo className="h-12 w-auto sm:h-16" />
              </Link>
              <p className="mt-5 text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
                {footerDescription}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-end">
              <p className="flex items-center gap-3 text-[13px] text-white/55">
                <Mail className="h-4 w-4 shrink-0 text-turquoise/70" />
                {email}
              </p>
              <p className="flex items-center gap-3 text-[13px] text-white/55">
                <Phone className="h-4 w-4 shrink-0 text-turquoise/70" />
                {phone}
              </p>
              <p className="flex items-center gap-3 text-[13px] text-white/55">
                <MapPin className="h-4 w-4 shrink-0 text-turquoise/70" />
                {address}
              </p>
            </div>
          </div>

          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Main 5-column grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-12 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((group) => (
              <FooterColumn key={group.heading} group={group} />
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Social + Payment row */}
          <div className="flex flex-col items-center justify-between gap-10 py-10 lg:flex-row lg:gap-8">
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                Follow Us On
              </p>
              <div className="flex items-center gap-2.5">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICON_MAP[social.icon] || InstagramIcon;
                  const isLink = Boolean(social.href);
                  const inner = <Icon className="h-4 w-4" strokeWidth={1.6} />;
                  return isLink ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all duration-400 hover:-translate-y-0.5 hover:border-turquoise/50 hover:text-turquoise hover:shadow-[0_4px_16px_-4px_rgba(22,181,216,0.3)]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span
                      key={social.label}
                      aria-label={social.label}
                      aria-disabled="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 text-white/25"
                    >
                      {inner}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-end">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                We Accept
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                <PaymentChip>
                  <span className="text-[13px] font-bold tracking-widest italic">VISA</span>
                </PaymentChip>
                <PaymentChip className="gap-1">
                  <span className="h-4 w-4 rounded-full bg-turquoise/70" />
                  <span className="-ml-1.5 h-4 w-4 rounded-full bg-silver/60" />
                </PaymentChip>
                <PaymentChip>UPI</PaymentChip>
                <PaymentChip>Net Banking</PaymentChip>
                <PaymentChip className="font-display text-sm tracking-wide normal-case italic">
                  Razorpay
                </PaymentChip>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Bottom copyright bar */}
          <div className="flex flex-col items-center justify-between gap-5 pt-7 text-center md:flex-row md:text-left">
            <div className="space-y-1.5">
              <p className="text-[12px] text-white/40">{copyright}</p>
              <p className="text-[11px] text-white/30">
                Designed &amp; Developed by{" "}
                <span className="text-turquoise/70">Clickin Digital Marketing Agency</span>{" "}
                — by <span className="text-white/45">Rahul Singh</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link
                href="/privacy-policy"
                className="group/link relative text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-turquoise/60 transition-all duration-300 group-hover/link:w-full" />
              </Link>
              <Link
                href="/terms"
                className="group/link relative text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Terms
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-turquoise/60 transition-all duration-300 group-hover/link:w-full" />
              </Link>
              <Link
                href="/shop"
                className="group/link relative text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Sitemap
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-turquoise/60 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
