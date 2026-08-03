import { dbConnect } from "@/lib/db";
import { Homepage, type HomepageDocument } from "@/models";
import { HOME_DEFAULTS } from "@/lib/home-content";
import type {
  HomeAboutContent,
  HomeBannerContent,
  HomeCollectionContent,
  HomeGenderTileContent,
  HomeHeroContent,
  HomepageContent,
  HomeTrustItemContent,
} from "@/types/homepage";

function mergeListItem<T extends object>(
  saved: T[] | undefined,
  defaults: T[],
  count: number
): T[] {
  const out: T[] = [];
  for (let i = 0; i < count; i += 1) {
    const item = saved?.[i];
    const merged = item != null ? ({ ...defaults[i], ...item } as T) : defaults[i];
    const savedImage = (item as { image?: string | null } | undefined)?.image;
    if (savedImage == null || savedImage === "") {
      (merged as { image: string | null }).image = (defaults[i] as { image: string | null }).image;
    }
    out.push(merged);
  }
  return out;
}

function mergeStringList(
  saved: string[] | undefined,
  defaults: string[],
  count: number
): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(saved?.[i]?.trim() || defaults[i]);
  }
  return out;
}

function mergeHero(saved: Partial<HomeHeroContent> | undefined): HomeHeroContent {
  const defaults = HOME_DEFAULTS.hero;
  return {
    ...defaults,
    ...(saved ?? {}),
    title: mergeStringList(saved?.title, defaults.title, 3),
    backgroundImage: saved?.backgroundImage ?? defaults.backgroundImage,
    accentColor: saved?.accentColor ?? defaults.accentColor,
    overlayOpacity: saved?.overlayOpacity ?? defaults.overlayOpacity,
    enabled: saved?.enabled ?? defaults.enabled,
  };
}

function mergeAbout(saved: Partial<HomeAboutContent> | undefined): HomeAboutContent {
  const defaults = HOME_DEFAULTS.about;
  const body = saved?.body?.filter((p) => p.trim()) ?? [];
  const points = saved?.points?.filter((p) => p.trim()) ?? [];
  return {
    ...defaults,
    ...(saved ?? {}),
    body: body.length ? body : defaults.body,
    points: points.length ? points : defaults.points,
    image: saved?.image ?? defaults.image,
    accentColor: saved?.accentColor ?? defaults.accentColor,
    enabled: saved?.enabled ?? defaults.enabled,
  };
}

/**
 * Loads the admin-editable homepage content, merging any saved
 * storefront document over the design-system defaults. Falls back to
 * the full defaults when nothing has been saved yet.
 */
export async function getHomepageContent(): Promise<HomepageContent & { heroImages: string[]; ctaTitle: string; ctaSubtitle: string; ctaButtonLabel: string; ctaButtonHref: string; ctaImage: string }> {
  await dbConnect();

  const doc = await Homepage.findOne({ key: "homepage" })
    .lean<HomepageDocument>()
    .exec();

  if (!doc) {
    return {
      ...HOME_DEFAULTS,
      heroImages: ["/brand/hero-banner-1.png", "/brand/hero-banner-2.png"],
      ctaTitle: "Find Your Perfect Sparkle",
      ctaSubtitle: "Explore our handcrafted collection of artificial diamond jewellery",
      ctaButtonLabel: "Shop Now",
      ctaButtonHref: "/shop",
      ctaImage: "/brand/cta-banner.jpg",
    };
  }

  return {
    hero: mergeHero(doc.hero),
    featuredBanners: mergeListItem<HomeBannerContent>(
      doc.featuredBanners,
      HOME_DEFAULTS.featuredBanners,
      HOME_DEFAULTS.featuredBanners.length
    ),
    trustBadges: mergeListItem<HomeTrustItemContent>(
      doc.trustBadges,
      HOME_DEFAULTS.trustBadges,
      HOME_DEFAULTS.trustBadges.length
    ),
    collections: mergeListItem<HomeCollectionContent>(
      doc.collections,
      HOME_DEFAULTS.collections,
      HOME_DEFAULTS.collections.length
    ),
    genderTiles: mergeListItem<HomeGenderTileContent>(
      doc.genderTiles,
      HOME_DEFAULTS.genderTiles,
      HOME_DEFAULTS.genderTiles.length
    ),
    about: mergeAbout(doc.about),
    heroImages: doc.heroImages?.length ? doc.heroImages : ["/brand/hero-banner-1.png", "/brand/hero-banner-2.png"],
    ctaTitle: doc.ctaTitle || "Find Your Perfect Sparkle",
    ctaSubtitle: doc.ctaSubtitle || "Explore our handcrafted collection of artificial diamond jewellery",
    ctaButtonLabel: doc.ctaButtonLabel || "Shop Now",
    ctaButtonHref: doc.ctaButtonHref || "/shop",
    ctaImage: doc.ctaImage || "/brand/cta-banner.jpg",
  };
}
