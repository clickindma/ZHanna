"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { BRAND, CATEGORY_LINKS, COMPANY_LINKS } from "@/lib/constants";

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
  youtube: YoutubeIcon,
};

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer({
  description,
  footerLinks,
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

  const socialLinksData =
    propSocialLinks && propSocialLinks.length > 0
      ? propSocialLinks.map((s) => ({
          label: s.platform,
          href: s.url,
          icon: s.icon,
        }))
      : [
          { label: "Instagram", href: BRAND.instagram, icon: "instagram" },
          { label: "Facebook", href: BRAND.facebook, icon: "facebook" },
          { label: "YouTube", href: BRAND.youtube, icon: "youtube" },
        ].filter((s) => s.href);

  const linkGroups = footerLinks && footerLinks.length > 0 ? footerLinks : null;

  return (
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

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" aria-label="Zhanna — Home" className="inline-block">
              <BrandLogo className="h-16 w-auto sm:h-20" />
            </Link>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-white/55">
              {footerDescription}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socialLinksData.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.icon] || InstagramIcon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/60 transition-all duration-400 hover:-translate-y-0.5 hover:border-turquoise/50 hover:text-turquoise hover:shadow-[0_4px_16px_-4px_rgba(22,181,216,0.3)]"
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
              Explore
            </h3>
            <ul className="mt-5 space-y-3.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections / Dynamic Links Column */}
          {linkGroups ? (
            linkGroups.slice(0, 1).map((group) => (
              <div key={group.heading} className="lg:col-span-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                  {group.heading}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
                Collections
              </h3>
              <ul className="mt-5 space-y-3.5">
                {CATEGORY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Client Care + Contact Column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-turquoise">
              Client Care
            </h3>
            <ul className="mt-5 space-y-3.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7 space-y-3 border-t border-white/8 pt-7">
              <p className="flex items-start gap-3 text-[13px] text-white/50">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-turquoise/70" />
                {address}
              </p>
              <p className="flex items-center gap-3 text-[13px] text-white/50">
                <Mail className="h-4 w-4 shrink-0 text-turquoise/70" />
                {email}
              </p>
              <p className="flex items-center gap-3 text-[13px] text-white/50">
                <Phone className="h-4 w-4 shrink-0 text-turquoise/70" />
                {phone}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/8 pt-7">
          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <p className="text-[12px] text-white/40">{copyright}</p>
            <p className="text-[11px] text-white/35">
              {BRAND.name}® · Trademark No. {BRAND.trademarkNumber} · {BRAND.trademarkClass}
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-turquoise/50">
              Crafted with pride in India
            </p>
          </div>

          {/* Credit Line */}
          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            <p className="text-[11px] leading-relaxed text-white/30">
              This website is designed & developed by{" "}
              <span className="text-turquoise/60">Clickin Digital Marketing Agency</span>{" "}
              — by{" "}
              <span className="text-white/50">Rahul Singh</span>
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
