import type {
  HomeAboutContent,
  HomeBannerContent,
  HomeCollectionContent,
  HomeGenderTileContent,
  HomeHeroContent,
  HomepageContent,
  HomeTrustItemContent,
} from "@/types/homepage";

export type {
  HomeAboutContent,
  HomeBannerContent,
  HomeBannerTheme,
  HomeCollectionContent,
  HomeCollectionTheme,
  HomeGenderTheme,
  HomeGenderTileContent,
  HomeHeroContent,
  HomepageContent,
  HomeTrustIcon,
  HomeTrustItemContent,
} from "@/types/homepage";

export const HOME_HERO: HomeHeroContent = {
  eyebrow: "Artificial Diamond & Fashion Jewellery",
  title: ["Radiance,", "made for you,", "every day."],
  subheadline:
    "Ethically crafted artificial diamond and fashion jewellery designed to elevate your everyday and every occasion.",
  ctaPrimaryLabel: "Shop Best Sellers",
  ctaPrimaryHref: "/shop?sort=featured",
  ctaSecondaryLabel: "Explore Collections",
  ctaSecondaryHref: "/shop",
  backgroundImage: null,
  overlayOpacity: 82,
  accentColor: null,
  enabled: true,
};

export const HOME_FEATURED_BANNERS: HomeBannerContent[] = [
  {
    eyebrow: "The Edit",
    title: "Everyday Sparkle",
    subtitle: "Lightweight, tarnish-free pieces designed for the modern desk-to-dinner ritual.",
    ctaLabel: "Shop the edit",
    ctaHref: "/shop?category=earrings",
    theme: "ivory",
    image: null,
    overlayOpacity: 72,
    accentColor: null,
    enabled: true,
  },
  {
    eyebrow: "Gifting",
    title: "Gifting, perfected",
    subtitle: "Signature packaging, engraving-ready pieces, and a promise she will remember.",
    ctaLabel: "Find a gift",
    ctaHref: "/shop?sort=featured",
    theme: "emerald",
    image: null,
    overlayOpacity: 72,
    accentColor: null,
    enabled: true,
  },
];

export const HOME_TRUST_ITEMS: HomeTrustItemContent[] = [
  { icon: "shield", title: "Certified Quality", subtitle: "Premium 925 silver & AAA cubic zirconia", image: null, enabled: true },
  { icon: "truck", title: "Free Shipping", subtitle: "On all orders above ₹499", image: null, enabled: true },
  { icon: "refresh", title: "Lifetime Exchange", subtitle: "Hassle-free returns within 7 days", image: null, enabled: true },
  { icon: "sparkles", title: "Handcrafted", subtitle: "Individually polished and finished", image: null, enabled: true },
];

export const HOME_COLLECTIONS: HomeCollectionContent[] = [
  {
    eyebrow: "Editorial",
    title: "The Solitaire Story",
    subtitle: "A single stone, a thousand conversations. Meet our solitaire edit.",
    ctaLabel: "Discover",
    ctaHref: "/shop?category=rings",
    theme: "emerald",
    tall: true,
    image: null,
    overlayOpacity: 66,
    accentColor: null,
    enabled: true,
  },
  {
    eyebrow: "Editorial",
    title: "Gold Hour",
    subtitle: "Warm metallics and soft glows for golden-hour occasions.",
    ctaLabel: "Shop the look",
    ctaHref: "/shop?sort=price-desc",
    theme: "champagne",
    tall: false,
    image: null,
    overlayOpacity: 66,
    accentColor: null,
    enabled: true,
  },
  {
    eyebrow: "Editorial",
    title: "Bridal Bloom",
    subtitle: "Statement sets for the big day and beyond.",
    ctaLabel: "Explore bridal",
    ctaHref: "/shop?category=necklaces",
    theme: "charcoal",
    tall: false,
    image: null,
    overlayOpacity: 66,
    accentColor: null,
    enabled: true,
  },
];

export const HOME_GENDER_TILES: HomeGenderTileContent[] = [
  {
    eyebrow: "For Her",
    title: "Women's Edit",
    subtitle: "Earrings, necklaces, rings and more.",
    ctaLabel: "Shop women",
    ctaHref: "/shop?category=earrings",
    theme: "emerald",
    image: null,
    overlayOpacity: 70,
    accentColor: null,
    enabled: true,
  },
  {
    eyebrow: "For Him",
    title: "Men's Edit",
    subtitle: "Chains, pendants and timeless staples.",
    ctaLabel: "Shop men",
    ctaHref: "/shop?category=pendants",
    theme: "charcoal",
    image: null,
    overlayOpacity: 70,
    accentColor: null,
    enabled: true,
  },
];

export const HOME_ABOUT: HomeAboutContent = {
  eyebrow: "The House of Zhanna",
  title: "Jewellery that feels like yours",
  body: [
    "Zhanna was founded on a simple belief — that fine-feeling jewellery should be accessible, honest, and beautiful enough to live in every day. Every piece is hand-finished in 925 sterling silver and set with precision-cut artificial diamonds.",
    "We design small, craft carefully, and ship across India with a lifetime exchange promise. No fine print, no fuss — just pieces you will reach for again and again.",
  ],
  points: ["925 Sterling Silver", "AAA Cubic Zirconia", "Hypoallergenic & tarnish-resistant"],
  ctaLabel: "Our story",
  ctaHref: "/about",
  image: null,
  accentColor: null,
  enabled: true,
};

export const HOME_DEFAULTS: HomepageContent = {
  hero: HOME_HERO,
  featuredBanners: HOME_FEATURED_BANNERS,
  trustBadges: HOME_TRUST_ITEMS,
  collections: HOME_COLLECTIONS,
  genderTiles: HOME_GENDER_TILES,
  about: HOME_ABOUT,
};
