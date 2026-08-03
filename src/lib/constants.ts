export const BRAND = {
  name: "Zhanna",
  legalName: "Zhanna",
  tagline: "Artificial Diamond & Fashion Jewellery",
  company: "MALNA INDUSTRIES (OPC) PRIVATE LIMITED",
  trademarkNumber: "5281381",
  trademarkClass: "Class 14",
  address: "Sector 59, Village Berampur, Gurgaon",
  city: "Gurgaon",
  country: "India",
  email: "care@zhannajewels.in",
  phone: "+91 98XXXXX000",
  currency: "₹",
  instagram: "https://instagram.com/zhannajewels",
  facebook: "https://facebook.com/zhannajewels",
  youtube: "https://youtube.com/@zhannajewels",
} as const;

export const CATEGORIES = [
  {
    name: "Rings",
    slug: "rings",
    description: "Statement rings and everyday bands",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Chokers, chains and bridal neckpieces",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Studs, drops and chandbalis",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Cuffs, bangles and tennis chains",
  },
  {
    name: "Pendants",
    slug: "pendants",
    description: "Solitaires, lockets and celestial charms",
  },
] as const;

export const CATEGORY_LINKS = [
  { label: "All Jewellery", href: "/shop" },
  ...CATEGORIES.map((category) => ({
    label: category.name,
    href: `/shop?category=${category.slug}`,
  })),
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/shop", children: CATEGORY_LINKS },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const COMPANY_LINKS = [
  { label: "About Zhanna", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export const FREE_SHIPPING_THRESHOLD = 999;

export const MATERIALS = [
  "Artificial Gold",
  "Silver",
  "Oxidized",
  "Diamond-like",
  "Gold Plated",
  "Rhodium Plated",
  "Copper",
  "Alloy",
] as const;
