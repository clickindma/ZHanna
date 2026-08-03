import { model, models, Schema, type Model } from "mongoose";
import type { SeoSocialLinks } from "@/types/seo";

const socialSchema = new Schema<SeoSocialLinks>(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    youtube: { type: String, default: "" },
    pinterest: { type: String, default: "" },
  },
  { _id: false }
);

export interface SeoSettingDocument {
  key: string;
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: string | null;
  favicon: string | null;
  social: SeoSocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const seoSettingSchema = new Schema<SeoSettingDocument>(
  {
    key: { type: String, unique: true, default: "seo" },
    siteTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: [String], default: [] },
    ogImage: { type: String, default: null },
    favicon: { type: String, default: null },
    social: { type: socialSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const SeoSetting: Model<SeoSettingDocument> =
  (models.SeoSetting as Model<SeoSettingDocument> | undefined) ??
  model<SeoSettingDocument>("SeoSetting", seoSettingSchema);

export default SeoSetting;
