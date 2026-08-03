import { z } from "zod";

const text = z.string().max(200);
const longText = z.string().max(800);
const imageUrl = z.string().max(600).nullable();
const accentColor = z.string().max(20).nullable();
const overlayOpacity = z.number().min(0).max(100);

export const bannerThemeEnum = z.enum(["emerald", "champagne", "ivory", "charcoal", "rose"]);
export const collectionThemeEnum = z.enum(["emerald", "champagne", "charcoal"]);
export const genderThemeEnum = z.enum(["emerald", "charcoal"]);
export const trustIconEnum = z.enum(["truck", "shield", "refresh", "sparkles", "award", "lock"]);

const heroSchema = z.object({
  eyebrow: text,
  title: z.array(text).length(3),
  subheadline: longText,
  ctaPrimaryLabel: text,
  ctaPrimaryHref: text,
  ctaSecondaryLabel: text,
  ctaSecondaryHref: text,
  backgroundImage: imageUrl,
  overlayOpacity,
  accentColor,
  enabled: z.boolean(),
});

const bannerSchema = z.object({
  eyebrow: text,
  title: text,
  subtitle: longText,
  ctaLabel: text,
  ctaHref: text,
  theme: bannerThemeEnum,
  image: imageUrl,
  overlayOpacity,
  accentColor,
  enabled: z.boolean(),
});

const trustSchema = z.object({
  icon: trustIconEnum,
  title: text,
  subtitle: longText,
  image: imageUrl,
  enabled: z.boolean(),
});

const collectionSchema = z.object({
  eyebrow: text,
  title: text,
  subtitle: longText,
  ctaLabel: text,
  ctaHref: text,
  theme: collectionThemeEnum,
  tall: z.boolean(),
  image: imageUrl,
  overlayOpacity,
  accentColor,
  enabled: z.boolean(),
});

const genderSchema = z.object({
  eyebrow: text,
  title: text,
  subtitle: longText,
  ctaLabel: text,
  ctaHref: text,
  theme: genderThemeEnum,
  image: imageUrl,
  overlayOpacity,
  accentColor,
  enabled: z.boolean(),
});

const aboutSchema = z.object({
  eyebrow: text,
  title: text,
  body: z.array(longText).min(1).max(4),
  points: z.array(text).min(1).max(6),
  ctaLabel: text,
  ctaHref: text,
  image: imageUrl,
  accentColor,
  enabled: z.boolean(),
});

export const storefrontContentSchema = z.object({
  hero: heroSchema,
  featuredBanners: z.array(bannerSchema).length(2),
  trustBadges: z.array(trustSchema).length(4),
  collections: z.array(collectionSchema).length(3),
  genderTiles: z.array(genderSchema).length(2),
  about: aboutSchema,
});

export type StorefrontContentInput = z.infer<typeof storefrontContentSchema>;
