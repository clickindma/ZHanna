import { model, models, Schema, type Model } from "mongoose";
import type {
  HomeAboutContent,
  HomeBannerContent,
  HomeCollectionContent,
  HomeGenderTileContent,
  HomeHeroContent,
  HomeTrustItemContent,
} from "@/types/homepage";

const heroSchema = new Schema<HomeHeroContent>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: [String], default: [] },
    subheadline: { type: String, default: "" },
    ctaPrimaryLabel: { type: String, default: "" },
    ctaPrimaryHref: { type: String, default: "" },
    ctaSecondaryLabel: { type: String, default: "" },
    ctaSecondaryHref: { type: String, default: "" },
    backgroundImage: { type: String, default: null },
    overlayOpacity: { type: Number, default: 82 },
    accentColor: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const bannerSchema = new Schema<HomeBannerContent>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    theme: { type: String, default: "ivory" },
    image: { type: String, default: null },
    overlayOpacity: { type: Number, default: 72 },
    accentColor: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const trustSchema = new Schema<HomeTrustItemContent>(
  {
    icon: { type: String, default: "shield" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const collectionSchema = new Schema<HomeCollectionContent>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    theme: { type: String, default: "emerald" },
    tall: { type: Boolean, default: false },
    image: { type: String, default: null },
    overlayOpacity: { type: Number, default: 66 },
    accentColor: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const genderSchema = new Schema<HomeGenderTileContent>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    theme: { type: String, default: "emerald" },
    image: { type: String, default: null },
    overlayOpacity: { type: Number, default: 70 },
    accentColor: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const aboutSchema = new Schema<HomeAboutContent>(
  {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    body: { type: [String], default: [] },
    points: { type: [String], default: [] },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    image: { type: String, default: null },
    accentColor: { type: String, default: null },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

interface HomeStatItem {
  value: string;
  label: string;
}

interface HomeTestimonial {
  name: string;
  text: string;
  image: string;
  rating: number;
}

interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomepageDocument {
  key: string;
  hero: HomeHeroContent;
  featuredBanners: HomeBannerContent[];
  trustBadges: HomeTrustItemContent[];
  collections: HomeCollectionContent[];
  genderTiles: HomeGenderTileContent[];
  about: HomeAboutContent;

  // New hero slider fields
  heroImages: string[];
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCta1Label: string;
  heroCta1Href: string;
  heroCta2Label: string;
  heroCta2Href: string;

  // Sections
  statsSection: HomeStatItem[];
  featuredCategoryIds: string[];
  testimonials: HomeTestimonial[];
  faqItems: HomeFaqItem[];

  // Newsletter
  newsletterTitle: string;
  newsletterSubtitle: string;

  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  ctaImage: string;

  createdAt: Date;
  updatedAt: Date;
}

const statItemSchema = new Schema<HomeStatItem>(
  {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const testimonialSchema = new Schema<HomeTestimonial>(
  {
    name: { type: String, default: "" },
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    rating: { type: Number, default: 5 },
  },
  { _id: false }
);

const faqItemSchema = new Schema<HomeFaqItem>(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const homepageSchema = new Schema<HomepageDocument>(
  {
    key: { type: String, unique: true, default: "homepage" },
    hero: { type: heroSchema, default: () => ({}) },
    featuredBanners: { type: [bannerSchema], default: [] },
    trustBadges: { type: [trustSchema], default: [] },
    collections: { type: [collectionSchema], default: [] },
    genderTiles: { type: [genderSchema], default: [] },
    about: { type: aboutSchema, default: () => ({}) },

    // New hero slider fields
    heroImages: { type: [String], default: [] },
    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    heroCta1Label: { type: String, default: "" },
    heroCta1Href: { type: String, default: "" },
    heroCta2Label: { type: String, default: "" },
    heroCta2Href: { type: String, default: "" },

    // Sections
    statsSection: { type: [statItemSchema], default: [] },
    featuredCategoryIds: { type: [String], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    faqItems: { type: [faqItemSchema], default: [] },

    // Newsletter
    newsletterTitle: { type: String, default: "" },
    newsletterSubtitle: { type: String, default: "" },

    // CTA
    ctaTitle: { type: String, default: "" },
    ctaSubtitle: { type: String, default: "" },
    ctaButtonLabel: { type: String, default: "" },
    ctaButtonHref: { type: String, default: "" },
    ctaImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Homepage: Model<HomepageDocument> =
  (models.Homepage as Model<HomepageDocument> | undefined) ??
  model<HomepageDocument>("Homepage", homepageSchema);

export default Homepage;
