import { dbConnect } from "@/lib/db";
import { SeoSetting, type SeoSettingDocument } from "@/models";
import { SEO_DEFAULTS, type SeoSettings } from "@/types/seo";

/**
 * Loads the admin-editable SEO settings, merging any saved document over
 * the brand defaults. Falls back to defaults when nothing has been saved.
 */
export async function getSeoSettings(): Promise<SeoSettings> {
  await dbConnect();

  const doc = await SeoSetting.findOne({ key: "seo" })
    .lean<SeoSettingDocument>()
    .exec();

  if (!doc) {
    return SEO_DEFAULTS;
  }

  return {
    siteTitle: doc.siteTitle || SEO_DEFAULTS.siteTitle,
    metaDescription: doc.metaDescription || SEO_DEFAULTS.metaDescription,
    metaKeywords:
      Array.isArray(doc.metaKeywords) && doc.metaKeywords.length
        ? doc.metaKeywords
        : SEO_DEFAULTS.metaKeywords,
    ogImage: doc.ogImage ?? SEO_DEFAULTS.ogImage,
    favicon: doc.favicon ?? SEO_DEFAULTS.favicon,
    social: { ...SEO_DEFAULTS.social, ...doc.social },
  };
}
