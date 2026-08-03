import { MATERIALS } from "@/lib/constants";

/**
 * Bulk product import — shared CSV column definitions and helpers.
 */

export const IMPORT_COLUMNS = [
  "name",
  "slug",
  "sku",
  "price",
  "compareAtPrice",
  "stock",
  "category",
  "description",
  "materials",
  "isFeatured",
  "isNewArrival",
  "images",
  "tags",
  "shortDescription",
] as const;

export type ImportColumn = (typeof IMPORT_COLUMNS)[number];

/** Sample rows for the downloadable template. */
export const IMPORT_TEMPLATE_ROWS: string[][] = [
  ["Signature Solitaire Ring", "", "SSR-001", "2999", "3999", "12", "Rings",
    "A brilliant-cut cubic zirconia solitaire set in a rhodium-plated gold band.", "Diamond-like, Gold Plated", "true", "true",
    "https://res.cloudinary.com/example/image/upload/v1/solitaire-ring.jpg", "solitaire, bridal", "Everyday luxury for the modern bride."],
  ["Oxidised Jhumka Earrings", "", "OJ-002", "899", "", "25", "Earrings",
    "Handcrafted oxidised silver jhumkas with a filigree finish.", "Oxidized, Silver", "false", "true",
    "", "oxidised, ethnic", "Festive favourite with an earthy charm."],
];

/** Turns a product name into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function parseBoolean(value: string | undefined): boolean {
  const normalized = (value ?? "").trim().toLowerCase();
  return ["true", "yes", "1", "y"].includes(normalized);
}

export function parseNumber(
  value: string | undefined
): number | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return String(value)
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isKnownMaterial(value: string): boolean {
  return (MATERIALS as readonly string[]).includes(value);
}
