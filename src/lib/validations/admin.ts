import { z } from "zod";
import { MATERIALS } from "@/lib/constants";
import { ORDER_STATUS_FLOW } from "@/types/admin";

const slugField = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(160, "Slug must be under 160 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, using hyphens (e.g. signature-ring)"
  );

/**
 * Normalises empty, NaN or missing number inputs to `null`.
 * Used for optional numeric fields (e.g. compare-at price) that the
 * form leaves blank.
 */
const optionalNumber = z.preprocess(
  (value) => {
    if (typeof value === "number" && Number.isNaN(value)) return null;
    if (value === "" || value == null) return null;
    if (typeof value === "number") return value;
    const coerced = Number(value);
    return Number.isNaN(coerced) ? null : coerced;
  },
  z.number().min(0, "Compare-at price cannot be negative").nullable()
);

/**
 * Normalises empty / NaN inputs to 0 and coerces numeric strings.
 * Used for required-with-default numeric fields.
 */
function requiredNumber(min: number, message: string) {
  return z.preprocess(
    (value) => {
      if (typeof value === "number" && Number.isNaN(value)) return 0;
      if (value === "" || value == null) return 0;
      if (typeof value === "number") return value;
      const coerced = Number(value);
      return Number.isNaN(coerced) ? 0 : coerced;
    },
    z.number().min(min, message)
  );
}

/**
 * Accepts either a string (comma/newline separated) or an array of
 * strings, and always produces a clean array of non-empty strings.
 * This lets the admin form send ready-made arrays while plain string
 * payloads (from external callers or the old textarea) still parse.
 */
function stringArrayInput(separator: RegExp) {
  return z
    .union([z.string(), z.array(z.string())])
    .transform((value) => {
      const parts = Array.isArray(value) ? value : value.split(separator);
      return parts.map((part) => (part ?? "").trim()).filter(Boolean);
    });
}

const imagesInput = stringArrayInput(/[\n,]/)
  .refine((images) => images.length > 0, "Add at least one product image")
  .refine((images) => images.length <= 10, "Maximum 10 images per product");

const tagsInput = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => {
    const parts = Array.isArray(value) ? value : value.split(",");
    return parts
      .map((tag) => (tag ?? "").trim().toLowerCase())
      .filter(Boolean);
  });

const sizeOptionsInput = stringArrayInput(/,/);

export const adminProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(160, "Name must be under 160 characters"),
  slug: slugField,
  sku: z
    .string()
    .trim()
    .min(2, "SKU is required")
    .max(40, "SKU must be under 40 characters"),
  category: z.string().min(1, "Please select a category"),
  price: requiredNumber(1, "Enter a price of at least ₹1"),
  compareAtPrice: optionalNumber,
  stock: z.preprocess(
    (value) => {
      if (typeof value === "number" && Number.isNaN(value)) return 0;
      if (value === "" || value == null) return 0;
      if (typeof value === "number") return value;
      const coerced = Number(value);
      return Number.isNaN(coerced) ? 0 : coerced;
    },
    z
      .number()
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .default(0)
  ),
  weight: z.string().trim().max(30, "Weight must be under 30 characters").optional(),
  shortDescription: z
    .string()
    .trim()
    .max(220, "Short description must be under 220 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  materials: z.array(z.enum(MATERIALS)).default([]),
  tags: tagsInput.default([]),
  sizeOptions: sizeOptionsInput.default([]),
  images: imagesInput.default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().trim().max(160, "SEO title must be under 160 characters").optional(),
  seoDescription: z.string().trim().max(220, "SEO description must be under 220 characters").optional(),
});

export type AdminProductInput = z.input<typeof adminProductSchema>;
export type AdminProductValues = z.output<typeof adminProductSchema>;

export function toAdminProductPayload(values: AdminProductValues) {
  return {
    ...values,
    compareAtPrice: values.compareAtPrice ?? null,
    tags: values.tags ?? [],
    sizeOptions: values.sizeOptions ?? [],
    images: values.images ?? [],
  };
}

export const adminCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),
  slug: slugField,
  description: z.string().trim().max(200, "Description must be under 200 characters").optional(),
  image: z
    .union([
      z.string().trim().max(500, "Image must be under 500 characters"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => (value ? value : null)),
  isActive: z.boolean().default(true),
});

export type AdminCategoryInput = z.input<typeof adminCategorySchema>;
export type AdminCategoryValues = z.output<typeof adminCategorySchema>;

export const adminOrderStatusSchema = z.object({
  orderStatus: z.enum(ORDER_STATUS_FLOW),
});

export type AdminOrderStatusValues = z.infer<typeof adminOrderStatusSchema>;

const trackingInput = z
  .union([
    z.string().trim().max(120, "Tracking number must be under 120 characters"),
    z.literal(""),
    z.null(),
    z.undefined(),
  ])
  .transform((value) => (value ? value.trim() : null));

export const adminOrderUpdateSchema = z.object({
  orderStatus: z.enum(ORDER_STATUS_FLOW),
  trackingNumber: trackingInput,
  trackingUrl: z
    .union([
      z
        .string()
        .trim()
        .max(400, "Tracking link must be under 400 characters")
        .refine(
          (value) => !value || /^https?:\/\/.+/.test(value),
          "Tracking link must start with http:// or https://"
        ),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => (value ? value.trim() : null)),
  adminNotes: z
    .union([
      z.string().trim().max(2000, "Notes must be under 2000 characters"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => (value ? value.trim() : null)),
  cancelReason: z
    .union([
      z.string().trim().max(500, "Cancel reason must be under 500 characters"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .transform((value) => (value ? value.trim() : null)),
});

export type AdminOrderUpdateValues = z.output<typeof adminOrderUpdateSchema>;
