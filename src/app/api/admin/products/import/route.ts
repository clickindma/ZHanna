import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { dbConnect } from "@/lib/db";
import { parseCsv } from "@/lib/csv";
import { Category, Product } from "@/models";
import {
  IMPORT_COLUMNS,
  isKnownMaterial,
  parseBoolean,
  parseList,
  parseNumber,
  slugify,
  type ImportColumn,
} from "@/lib/product-import";

export const dynamic = "force-dynamic";

export const maxDuration = 60;

interface ImportResultRow {
  name: string;
  reason: string;
}

interface ImportReport {
  total: number;
  created: number;
  failed: ImportResultRow[];
  duplicateSlugs: number;
  error?: string;
}

interface CategoryLookup {
  bySlug: Map<string, string>;
  byName: Map<string, string>;
}

async function buildCategoryLookup(): Promise<CategoryLookup> {
  const categories = await Category.find({}).select("_id name slug").lean();
  const lookup: CategoryLookup = { bySlug: new Map(), byName: new Map() };
  for (const category of categories) {
    lookup.bySlug.set(category.slug.toLowerCase(), category._id.toString());
    lookup.byName.set(category.name.toLowerCase(), category._id.toString());
  }
  return lookup;
}

function resolveCategory(
  value: string | undefined,
  lookup: CategoryLookup
): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  const key = raw.toLowerCase();
  return lookup.bySlug.get(key) ?? lookup.byName.get(key) ?? null;
}

function getCell(
  row: string[],
  column: string,
  columnIndex: Map<ImportColumn, number>
): string | undefined {
  const index = columnIndex.get(column as ImportColumn) as number | undefined;
  return index != null && index < row.length ? row[index] : undefined;
}

function rowToRecord(
  row: string[],
  columnIndex: Map<ImportColumn, number>
): Record<ImportColumn, string | undefined> {
  const record = {} as Record<ImportColumn, string | undefined>;
  for (const column of IMPORT_COLUMNS) {
    record[column] = getCell(row, column, columnIndex);
  }
  return record;
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard instanceof NextResponse) return guard;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a CSV file upload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "CSV file must be under 5 MB" }, { status: 400 });
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded file" }, { status: 400 });
  }

  const rows = parseCsv(text);
  if (rows.length < 2) {
    return NextResponse.json(
      { error: "The CSV must contain a header row and at least one product row" },
      { status: 400 }
    );
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const columnIndex = new Map<ImportColumn, number>();
  for (const column of IMPORT_COLUMNS) {
    const position = header.indexOf(column);
    if (position !== -1) columnIndex.set(column, position);
  }

  const missing = IMPORT_COLUMNS.filter(
    (column) => !columnIndex.has(column)
  );
  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required columns in the header: ${missing.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const report: ImportReport = {
    total: rows.length - 1,
    created: 0,
    failed: [],
    duplicateSlugs: 0,
  };

  try {
    await dbConnect();
    const lookup = await buildCategoryLookup();

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index];
      if (row.length === 1 && row[0].trim() === "") continue;

      const record = rowToRecord(row, columnIndex);
      const name = (record.name ?? "").trim();
      const sku = (record.sku ?? "").trim();
      const price = parseNumber(record.price);
      const compareAtPrice = parseNumber(record.compareAtPrice);
      const stock = parseNumber(record.stock) ?? 0;
      const category = resolveCategory(record.category, lookup);
      const description = (record.description ?? "").trim();
      const materials = parseList(record.materials);
      const images = parseList(record.images).slice(0, 10);
      const tags = parseList(record.tags);
      const shortDescription = (record.shortDescription ?? "").trim();

      if (!name) {
        report.failed.push({ name: "", reason: `Row ${index + 1}: name is required` });
        continue;
      }
      if (!sku) {
        report.failed.push({ name, reason: "SKU is required" });
        continue;
      }
      if (price == null || price < 0) {
        report.failed.push({ name, reason: "price must be a valid number" });
        continue;
      }
      if (!description || description.length < 10) {
        report.failed.push({ name, reason: "description must be at least 10 characters" });
        continue;
      }
      if (!category) {
        report.failed.push({
          name,
          reason: `category "${record.category ?? ""}" was not found. Add the category first.`,
        });
        continue;
      }
      if (materials.length > 0 && materials.some((material) => !isKnownMaterial(material))) {
        const unknown = materials.filter((material) => !isKnownMaterial(material)).join(", ");
        report.failed.push({ name, reason: `unknown material(s): ${unknown}` });
        continue;
      }
      if (stock < 0 || !Number.isInteger(stock)) {
        report.failed.push({ name, reason: "stock must be a non-negative whole number" });
        continue;
      }

      const slug = (record.slug ?? "").trim() || slugify(name);
      if (!slug) {
        report.failed.push({ name, reason: "could not generate a slug" });
        continue;
      }
      const existingSlug = await Product.findOne({ slug }).select("_id").lean();
      if (existingSlug) {
        report.duplicateSlugs += 1;
        report.failed.push({ name, reason: `slug "${slug}" already exists` });
        continue;
      }
      const existingSku = await Product.findOne({ sku: sku.toUpperCase() }).select("_id").lean();
      if (existingSku) {
        report.failed.push({ name, reason: `SKU "${sku}" already exists` });
        continue;
      }

      try {
        await Product.create({
          name,
          slug,
          sku: sku.toUpperCase(),
          price,
          compareAtPrice,
          stock,
          category,
          description,
          shortDescription: shortDescription || undefined,
          materials: materials as unknown as import("@/types/models").Material[],
          images,
          tags,
          isFeatured: parseBoolean(record.isFeatured),
          isNewArrival: parseBoolean(record.isNewArrival),
          isActive: true,
        });
        report.created += 1;
      } catch (error) {
        const reason =
          error && typeof error === "object" && "code" in error && error.code === 11000
            ? "duplicate slug or SKU"
            : "could not create product";
        report.failed.push({ name, reason });
      }
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Bulk import failed:", error);
    return NextResponse.json(
      { error: "Import failed. Please try again." },
      { status: 502 }
    );
  }
}
