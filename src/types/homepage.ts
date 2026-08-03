export type HomeBannerTheme =
  | "emerald"
  | "champagne"
  | "ivory"
  | "charcoal"
  | "rose";

export type HomeCollectionTheme = "emerald" | "champagne" | "charcoal";

export type HomeGenderTheme = "emerald" | "charcoal";

export type HomeTrustIcon =
  | "truck"
  | "shield"
  | "refresh"
  | "sparkles"
  | "award"
  | "lock";

export interface HomeHeroContent {
  eyebrow: string;
  title: string[];
  subheadline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundImage: string | null;
  overlayOpacity: number;
  accentColor: string | null;
  enabled: boolean;
}

export interface HomeBannerContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  theme: HomeBannerTheme;
  image: string | null;
  overlayOpacity: number;
  accentColor: string | null;
  enabled: boolean;
}

export interface HomeCollectionContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  theme: HomeCollectionTheme;
  tall: boolean;
  image: string | null;
  overlayOpacity: number;
  accentColor: string | null;
  enabled: boolean;
}

export interface HomeGenderTileContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  theme: HomeGenderTheme;
  image: string | null;
  overlayOpacity: number;
  accentColor: string | null;
  enabled: boolean;
}

export interface HomeTrustItemContent {
  icon: HomeTrustIcon;
  title: string;
  subtitle: string;
  image: string | null;
  enabled: boolean;
}

export interface HomeAboutContent {
  eyebrow: string;
  title: string;
  body: string[];
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  image: string | null;
  accentColor: string | null;
  enabled: boolean;
}

export interface HomepageContent {
  hero: HomeHeroContent;
  featuredBanners: HomeBannerContent[];
  trustBadges: HomeTrustItemContent[];
  collections: HomeCollectionContent[];
  genderTiles: HomeGenderTileContent[];
  about: HomeAboutContent;
}
