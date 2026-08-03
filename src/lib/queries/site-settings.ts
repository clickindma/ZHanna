import { dbConnect } from "@/lib/db";
import SiteSettings, { type ISiteSettings } from "@/models/SiteSettings";
import { BRAND, NAV_LINKS, COMPANY_LINKS } from "@/lib/constants";

function getDefaultSiteSettings(): ISiteSettings {
  return {
    key: "site-settings",
    logo: "",
    navLinks: NAV_LINKS.map((link) => ({
      label: link.label,
      href: link.href,
      children:
        "children" in link && link.children
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
    aboutStory: [
      "Diamonds were never meant to be out of reach. Zhanna was founded on the conviction that a woman's hands should be adorned with fire — not burdened by price.",
      "Every piece is designed in-house and finished by hand: stones are hand-set, metalwork is polished to a mirror finish, and each design passes a final inspection under 10x magnification before it earns the Zhanna name.",
    ],
    aboutMission:
      "To democratise brilliance — making extraordinary diamond jewellery accessible, honest, and deeply personal for every woman.",
    aboutVision:
      "To be India's most trusted name in artisanal artificial diamond and fashion jewellery, known for craftsmanship, integrity and timeless elegance.",
    aboutValues: [
      { title: "Bespoke Brilliance", description: "Every artificial diamond is hand-set and hand-polished, chosen for fire and clarity.", icon: "gem" },
      { title: "Anti-Tarnish Promise", description: "Rhodium and gold plating layered for longevity — brilliance that refuses to fade.", icon: "shield" },
      { title: "Conscious Luxury", description: "Lab-grown stones, recyclable metals, and honest packaging — radiance without cost to the earth.", icon: "recycle" },
      { title: "Made for You", description: "From bespoke engagement rings to heirloom gift sets, every piece is created in small batches.", icon: "sparkles" },
    ],
    aboutTeam: [],
    aboutStats: [
      { label: "Handcrafted Designs", value: "500+" },
      { label: "Happy Customers", value: "10,000+" },
      { label: "Cities Served", value: "50+" },
      { label: "Years of Craft", value: "5+" },
    ],
    aboutCta: {
      title: "Find Your Perfect Sparkle",
      subtitle: "Every piece tells a story. Discover jewellery that speaks to your style.",
      buttonLabel: "Shop Now",
      buttonHref: "/shop",
    },
    aboutImages: [],
    contactBanner: "",
    contactTitle: "Get in Touch",
    contactSubtitle: "We'd love to hear from you. Our client care team is here for every question.",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Fetches site settings from the database.
 * Falls back to brand defaults if nothing has been saved.
 */
export async function getSiteSettings(): Promise<ISiteSettings> {
  await dbConnect();

  const doc = await SiteSettings.findOne({ key: "site-settings" }).lean();

  if (!doc) {
    return getDefaultSiteSettings();
  }

  // Merge defaults for any missing fields
  const defaults = getDefaultSiteSettings();
  const settings = JSON.parse(JSON.stringify(doc)) as ISiteSettings;

  return {
    ...defaults,
    ...settings,
    navLinks: settings.navLinks?.length ? settings.navLinks : defaults.navLinks,
    socialLinks: settings.socialLinks?.length ? settings.socialLinks : defaults.socialLinks,
    businessHours: settings.businessHours?.length ? settings.businessHours : defaults.businessHours,
    aboutValues: settings.aboutValues?.length ? settings.aboutValues : defaults.aboutValues,
    aboutStats: settings.aboutStats?.length ? settings.aboutStats : defaults.aboutStats,
    aboutStory: settings.aboutStory?.length ? settings.aboutStory : defaults.aboutStory,
    aboutCta: settings.aboutCta?.title ? settings.aboutCta : defaults.aboutCta,
  };
}
