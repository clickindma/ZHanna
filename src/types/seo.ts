import { BRAND } from "@/lib/constants";

export interface SeoSocialLinks {
  instagram: string;
  facebook: string;
  whatsapp: string;
  youtube: string;
  pinterest: string;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: string | null;
  favicon: string | null;
  social: SeoSocialLinks;
}

export const SEO_DEFAULTS: SeoSettings = {
  siteTitle: `${BRAND.name} | Artificial Diamond & Fashion Jewellery`,
  metaDescription:
    "Zhanna — luxury artificial diamond, oxidized and fashion jewellery by Malna Industries (OPC) Private Limited. Handcrafted brilliance, trademark registered, Class 14.",
  metaKeywords: [
    "Zhanna",
    "artificial diamond jewellery",
    "oxidized jewellery",
    "fashion jewellery",
    "imitation jewellery",
    "artificial gold jewellery",
    "artificial silver jewellery",
  ],
  ogImage: null,
  favicon: null,
  social: {
    instagram: BRAND.instagram,
    facebook: BRAND.facebook,
    whatsapp: "",
    youtube: BRAND.youtube,
    pinterest: "",
  },
};
