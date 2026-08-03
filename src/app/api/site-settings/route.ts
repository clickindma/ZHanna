import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSettings } from "@/models";
import { BRAND, NAV_LINKS, COMPANY_LINKS } from "@/lib/constants";

export const dynamic = "force-dynamic";

function getDefaultSettings() {
  return {
    key: "site-settings",
    logo: "",
    navLinks: NAV_LINKS.map((link) => ({
      label: link.label,
      href: link.href,
      children: "children" in link && link.children
        ? link.children.map((child) => ({ label: child.label, href: child.href }))
        : undefined,
    })),
    footerLogo: "",
    footerDescription: `${BRAND.name} – ${BRAND.tagline}`,
    footerLinks: [
      {
        heading: "Company",
        links: COMPANY_LINKS.map((l) => ({ label: l.label, href: l.href })),
      },
    ],
    socialLinks: [
      { platform: "Instagram", url: BRAND.instagram, icon: "instagram" },
      { platform: "Facebook", url: BRAND.facebook, icon: "facebook" },
      { platform: "YouTube", url: BRAND.youtube, icon: "youtube" },
    ],
    copyrightText: `© ${new Date().getFullYear()} ${BRAND.legalName}. All rights reserved.`,
    email: BRAND.email,
    phone: BRAND.phone,
    address: BRAND.address,
    city: BRAND.city,
    mapEmbedUrl: "",
    businessHours: [
      { day: "Monday - Friday", hours: "10:00 AM - 7:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    aboutBanner: "",
    aboutTitle: `About ${BRAND.name}`,
    aboutStory: [],
    aboutMission: "",
    aboutVision: "",
    aboutValues: [],
    aboutTeam: [],
    aboutStats: [],
    aboutCta: { title: "", subtitle: "", buttonLabel: "", buttonHref: "" },
    aboutImages: [],
    contactBanner: "",
    contactTitle: "Get in Touch",
    contactSubtitle: "We'd love to hear from you",
  };
}

export async function GET() {
  await dbConnect();

  let settings = await SiteSettings.findOne({ key: "site-settings" }).lean();

  if (!settings) {
    const created = await SiteSettings.create(getDefaultSettings());
    settings = created.toJSON();
  }

  return NextResponse.json({ settings });
}
