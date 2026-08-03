import { dbConnect } from "@/lib/db";
import { Category, Product } from "@/models";
import type { ProductDocument } from "@/types/models";
import type { ProductCategoryRef, ProductListItem } from "@/types/product";

export interface ProductQuery {
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
}

const SORTS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  "name-asc": { name: 1 },
};

type LeanProduct = {
  _id: { toString(): string };
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  shortDescription?: string;
  description: string;
  materials: string[];
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  sizeOptions: string[];
  weight?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  category: ProductCategoryRef | { _id: string; name: string; slug: string } | string | null;
  createdAt: Date;
};

function mapProduct(product: LeanProduct): ProductListItem {
  const category =
    product.category &&
    typeof product.category === "object" &&
    "name" in product.category
      ? {
          _id: product.category._id.toString(),
          name: product.category.name,
          slug: product.category.slug,
        }
      : null;

  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    images: product.images ?? [],
    shortDescription: product.shortDescription,
    description: product.description,
    materials: product.materials ?? [],
    stock: product.stock,
    sku: product.sku,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    sizeOptions: product.sizeOptions ?? [],
    weight: product.weight,
    tags: product.tags ?? [],
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    category,
    createdAt: product.createdAt.toISOString(),
  };
}

export async function getProducts(query: ProductQuery = {}): Promise<{
  products: ProductListItem[];
  total: number;
}> {
  await dbConnect();

  const filter: Record<string, unknown> = { isActive: true };

  if (query.category) {
    const category = await Category.findOne({
      slug: query.category,
      isActive: true,
    }).select("_id");
    if (!category) {
      return { products: [], total: 0 };
    }
    filter.category = category._id;
  }

  if (query.featured) {
    filter.isFeatured = true;
  }

  if (query.newArrival) {
    filter.isNewArrival = true;
  }

  if (query.minPrice != null || query.maxPrice != null) {
    const price: Record<string, number> = {};
    if (query.minPrice != null) price.$gte = query.minPrice;
    if (query.maxPrice != null) price.$lte = query.maxPrice;
    filter.price = price;
  }

  const search = query.search?.trim();
  if (search) {
    const tokens = search
      .split(/\s+/)
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .filter(Boolean);

    if (tokens.length > 0) {
      const pattern = tokens.length === 1 ? tokens[0] : tokens.join("|");
      const regex = new RegExp(pattern, "i");
      filter.$or = [
        { name: regex },
        { shortDescription: regex },
        { description: regex },
        { tags: { $in: [regex] } },
        { sku: regex },
        { materials: { $in: [regex] } },
      ];
    }
  }

  const sort = SORTS[query.sort ?? ""] ?? SORTS.newest;
  const limit =
    query.limit && query.limit > 0 ? Math.min(query.limit, 60) : 60;

  const docs = await Product.find(filter)
    .sort(sort)
    .limit(limit)
    .populate("category", "name slug")
    .lean();

  return {
    products: (docs as unknown as LeanProduct[]).map(mapProduct),
    total: docs.length,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductListItem | null> {
  await dbConnect();

  const doc = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .lean();

  if (!doc) {
    return null;
  }

  return mapProduct(doc as unknown as LeanProduct);
}

export async function getRelatedProducts(
  product: ProductListItem,
  limit = 4
): Promise<ProductListItem[]> {
  if (!product.category) {
    return [];
  }

  await dbConnect();

  const docs = await Product.find({
    _id: { $ne: product._id },
    category: product.category._id,
    isActive: true,
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(limit)
    .populate("category", "name slug")
    .lean();

  return (docs as unknown as LeanProduct[]).map(mapProduct);
}

/**
 * Fetches active products by id, preserving the given order. Used by the
 * customer wishlist.
 */
export async function getProductsByIds(ids: string[]): Promise<ProductListItem[]> {
  if (ids.length === 0) {
    return [];
  }

  await dbConnect();

  const docs = await Product.find({ _id: { $in: ids }, isActive: true })
    .populate("category", "name slug")
    .lean();

  const byId = new Map(
    (docs as unknown as LeanProduct[]).map((doc) => [doc._id.toString(), doc])
  );

  return ids
    .map((id) => {
      const doc = byId.get(id);
      return doc ? mapProduct(doc) : null;
    })
    .filter((product): product is ProductListItem => product !== null);
}

export type { ProductDocument };
