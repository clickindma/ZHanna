import { z } from "zod";

const urlOrEmpty = z
  .string()
  .max(600)
  .nullable()
  .refine((value) => value === null || value === "" || /^https?:\/\/.+/.test(value), {
    message: "Must be a valid http(s) URL or empty.",
  });

const socialLink = z
  .string()
  .max(600)
  .refine(
    (value) => value === "" || /^https?:\/\/.+/.test(value),
    { message: "Must be a valid http(s) URL or empty." }
  );

export const seoSettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required.").max(140),
  metaDescription: z
    .string()
    .min(1, "Meta description is required.")
    .max(320, "Keep the meta description under 320 characters."),
  metaKeywords: z
    .array(z.string().trim().min(1).max(80))
    .max(30, "Too many keywords — keep it under 30."),
  ogImage: urlOrEmpty,
  favicon: urlOrEmpty,
  social: z.object({
    instagram: socialLink,
    facebook: socialLink,
    whatsapp: socialLink,
    youtube: socialLink,
    pinterest: socialLink,
  }),
});

export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
