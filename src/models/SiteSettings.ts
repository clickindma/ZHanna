import { model, models, Schema, type Model } from "mongoose";

/* ──────────────────── Sub-document interfaces ──────────────────── */

interface NavLinkChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavLinkChild[];
}

interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface BusinessHour {
  day: string;
  hours: string;
}

interface AboutValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutTeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface AboutStat {
  label: string;
  value: string;
}

interface AboutCta {
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
}

/* ──────────────────── Main interface ──────────────────── */

export interface ISiteSettings {
  key: string;

  // Header
  logo: string;
  navLinks: NavLink[];

  // Footer
  footerLogo: string;
  footerDescription: string;
  footerLinks: FooterLinkGroup[];
  socialLinks: SocialLink[];
  copyrightText: string;

  // Contact Info
  email: string;
  phone: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  businessHours: BusinessHour[];

  // About Page
  aboutBanner: string;
  aboutTitle: string;
  aboutStory: string[];
  aboutMission: string;
  aboutVision: string;
  aboutValues: AboutValue[];
  aboutTeam: AboutTeamMember[];
  aboutStats: AboutStat[];
  aboutCta: AboutCta;
  aboutImages: string[];

  // Contact Page
  contactBanner: string;
  contactTitle: string;
  contactSubtitle: string;

  createdAt: Date;
  updatedAt: Date;
}

export type SiteSettingsDocument = ISiteSettings;

/* ──────────────────── Sub-schemas ──────────────────── */

const navLinkChildSchema = new Schema<NavLinkChild>(
  {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
  },
  { _id: false }
);

const navLinkSchema = new Schema<NavLink>(
  {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
    children: { type: [navLinkChildSchema], default: undefined },
  },
  { _id: false }
);

const footerLinkItemSchema = new Schema(
  {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
  },
  { _id: false }
);

const footerLinkGroupSchema = new Schema<FooterLinkGroup>(
  {
    heading: { type: String, default: "" },
    links: { type: [footerLinkItemSchema], default: [] },
  },
  { _id: false }
);

const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: { type: String, default: "" },
    url: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const businessHourSchema = new Schema<BusinessHour>(
  {
    day: { type: String, default: "" },
    hours: { type: String, default: "" },
  },
  { _id: false }
);

const aboutValueSchema = new Schema<AboutValue>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const aboutTeamMemberSchema = new Schema<AboutTeamMember>(
  {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { _id: false }
);

const aboutStatSchema = new Schema<AboutStat>(
  {
    label: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const aboutCtaSchema = new Schema<AboutCta>(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    buttonLabel: { type: String, default: "" },
    buttonHref: { type: String, default: "" },
  },
  { _id: false }
);

/* ──────────────────── Main schema ──────────────────── */

const siteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    key: { type: String, unique: true, default: "site-settings" },

    // Header
    logo: { type: String, default: "" },
    navLinks: { type: [navLinkSchema], default: [] },

    // Footer
    footerLogo: { type: String, default: "" },
    footerDescription: { type: String, default: "" },
    footerLinks: { type: [footerLinkGroupSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },
    copyrightText: { type: String, default: "" },

    // Contact Info
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    businessHours: { type: [businessHourSchema], default: [] },

    // About Page
    aboutBanner: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutStory: { type: [String], default: [] },
    aboutMission: { type: String, default: "" },
    aboutVision: { type: String, default: "" },
    aboutValues: { type: [aboutValueSchema], default: [] },
    aboutTeam: { type: [aboutTeamMemberSchema], default: [] },
    aboutStats: { type: [aboutStatSchema], default: [] },
    aboutCta: { type: aboutCtaSchema, default: () => ({}) },
    aboutImages: { type: [String], default: [] },

    // Contact Page
    contactBanner: { type: String, default: "" },
    contactTitle: { type: String, default: "" },
    contactSubtitle: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteSettings: Model<SiteSettingsDocument> =
  (models.SiteSettings as Model<SiteSettingsDocument> | undefined) ??
  model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);

export default SiteSettings;
