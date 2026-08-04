"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { PartnerBrands } from "@/components/layout/partner-brands";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
import { BRAND, CATEGORY_LINKS } from "@/lib/constants";
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

const DEFAULT_PRODUCT_LINKS: FooterLink[] = [
  ...CATEGORY_LINKS.map((link) => ({ label: link.label, href: link.href })),
];

const DEFAULT_COMPANY_LINKS: FooterLink[] = [
  { label: "About Zhanna", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Our Journal", href: "/blog" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <Link
        href={link.href}
        className="group/link inline-flex items-center gap-1 text-[13px] text-white/55 transition-all duration-300 hover:translate-x-[3px] hover:text-turquoise"
      >
        <span className="h-px w-0 bg-turquoise transition-all duration-300 group-hover/link:w-2" />
        {link.label}
      </Link>
    </li>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-turquoise/30 bg-turquoise/10 px-5 py-4 text-sm text-turquoise">
        Thank you for subscribing — welcome to the Zhanna family!
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full items-stretch overflow-hidden rounded-xl border border-white/15 bg-white/5 focus-within:border-turquoise/50">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        aria-label="Email for newsletter"
        className="w-full min-w-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
      <button
        type="submit"
        aria-label="Subscribe to newsletter"
        className="flex shrink-0 cursor-pointer items-center gap-1.5 bg-turquoise px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-brand transition-all duration-300 hover:bg-aqua hover:brightness-110 sm:px-5"
      >
        <span className="hidden sm:inline">Join</span>
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
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
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-teal/8 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-turquoise/6 blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-10 sm:px-8 sm:pt-20 lg:px-10">
          {/* 4-column layout */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.3fr] lg:gap-10">
            {/* Brand + Social */}
            <div>
              <Link href="/" aria-label="Zhanna — Home" className="inline-block">
                <BrandLogo className="h-14 w-auto" />
              </Link>
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
                {footerDescription}
              </p>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                Follow Us On
              </p>
              <div className="mt-4 flex items-center gap-2.5">
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
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all duration-500 hover:scale-110 hover:border-turquoise hover:bg-turquoise hover:text-navy-brand hover:shadow-[0_6px_20px_-4px_rgba(22,181,216,0.5)]"
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

            {/* Product Links */}
            <div>
              <h3 className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                Shop by Category
                <span className="absolute -bottom-1.5 left-0 h-px w-8 bg-gradient-to-r from-turquoise to-transparent" />
              </h3>
              <ul className="mt-7 space-y-3">
                {DEFAULT_PRODUCT_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                About Us
                <span className="absolute -bottom-1.5 left-0 h-px w-8 bg-gradient-to-r from-turquoise to-transparent" />
              </h3>
              <ul className="mt-7 space-y-3">
                {DEFAULT_COMPANY_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} link={link} />
                ))}
              </ul>
              <div className="mt-6 space-y-3">
                <p className="flex items-start gap-3 text-[13px] leading-relaxed text-white/55">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turquoise/70" />
                  {address}
                </p>
                <p className="flex items-center gap-3 text-[13px] text-white/55">
                  <Phone className="h-4 w-4 shrink-0 text-turquoise/70" />
                  {phone}
                </p>
                <p className="flex items-center gap-3 text-[13px] text-white/55">
                  <Mail className="h-4 w-4 shrink-0 text-turquoise/70" />
                  {email}
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="relative text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                Join Our Circle
                <span className="absolute -bottom-1.5 left-0 h-px w-8 bg-gradient-to-r from-turquoise to-transparent" />
              </h3>
              <p className="mt-7 text-[13px] leading-relaxed text-white/50">
                Be the first to know about new collections, private sales and styling stories.
              </p>
              <div className="mt-5">
                <NewsletterForm />
              </div>
              <p className="mt-4 text-[11px] text-white/35">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <p className="text-center text-[12px] text-white/40 lg:text-left">{copyright}</p>

              <div className="flex flex-wrap items-center justify-center gap-2">
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

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href="/privacy-policy"
                className="text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Terms
              </Link>
              <Link
                href="/shipping"
                className="text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Shipping
              </Link>
              <Link
                href="/returns"
                className="text-[11px] uppercase tracking-[0.16em] text-white/40 transition-colors duration-300 hover:text-turquoise"
              >
                Returns
              </Link>
            </div>

            <p className="mt-7 text-center text-[11px] text-white/30">
              Designed &amp; Developed by{" "}
              <span className="text-turquoise/70">Clickin Digital Marketing Agency</span> — by{" "}
              <span className="text-white/45">Rahul Singh</span>
            </p>
          </div>
        </div>
      </motion.footer>
    </>
  );
}
